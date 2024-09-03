package controllers

import (
	"net/http"
	"strconv"

	"github.com/Johnkhk/MealSync/common"
	"github.com/Johnkhk/MealSync/config"
	"github.com/Johnkhk/MealSync/models"
	"github.com/labstack/echo/v4"
)

// func GetCategories(c echo.Context) error {
// 	common.LogInfo().Msg("In GetCategories")
// 	rows, err := config.Conn.Query(context.Background(), "SELECT id, name, restaurant_id FROM categories WHERE restaurant_id = $1", c.Param("restaurant_id"))
// 	if err != nil {
// 		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to fetch restaurants"})
// 	}
// 	defer rows.Close()

// 	var categories []models.Category
// 	for rows.Next() {
// 		var category models.Category
// 		err := rows.Scan(&category.ID, &category.Name, &category.RestaurantID)
// 		if err != nil {
// 			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to scan category"})
// 		}
// 		categories = append(categories, category)
// 	}

// 	return c.JSON(http.StatusOK, categories)
// }
func GetCategories(c echo.Context) error {
	logger := common.Logger

	// Log the entry to the function
	logger.Info().Str("handler", "GetCategories").Msg("Fetching categories")

	// Get the restaurant ID from the query parameters
	restaurantID := c.QueryParam("restaurant_id")
	logger.Debug().Str("restaurant_id", restaurantID).Msg("Received restaurant ID")

	// Fetch the user ID from the context
	userID, ok := c.Get("user_id").(int)
	if !ok {
		logger.Error().Str("handler", "GetCategories").Msg("Invalid user ID in context")
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid user ID"})
	}

	// Check if the restaurant belongs to the user
	var ownerID int
	query := `SELECT ownerID FROM restaurants WHERE id = $1`
	err := config.Conn.QueryRow(c.Request().Context(), query, restaurantID).Scan(&ownerID)
	if err != nil {
		logger.Error().Err(err).Str("handler", "GetCategories").Str("restaurant_id", restaurantID).Msg("Error fetching restaurant ownership")
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to verify restaurant ownership"})
	}

	// Ensure the user owns the restaurant
	if ownerID != userID {
		logger.Warn().Str("handler", "GetCategories").Int("user_id", userID).Int("owner_id", ownerID).Msg("Unauthorized access attempt")
		return c.JSON(http.StatusForbidden, echo.Map{"error": "You do not have permission to view categories for this restaurant"})
	}

	// Query the database for categories
	rows, err := config.Conn.Query(c.Request().Context(), "SELECT id, name, restaurant_id FROM menu_categories WHERE restaurant_id = $1", restaurantID)
	if err != nil {
		logger.Error().Err(err).Str("restaurant_id", restaurantID).Msg("Failed to fetch categories from database")
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to fetch categories"})
	}
	defer rows.Close()

	// Prepare a slice to store categories
	var categories []models.Category
	for rows.Next() {
		var category models.Category
		err := rows.Scan(&category.ID, &category.Name, &category.RestaurantID)
		if err != nil {
			logger.Error().Err(err).Msg("Failed to scan category row")
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to scan category"})
		}
		categories = append(categories, category)
	}

	// Check for errors after rows iteration
	if err = rows.Err(); err != nil {
		logger.Error().Err(err).Msg("Error occurred during rows iteration")
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to read categories"})
	}

	// Log the success of the operation
	logger.Info().Int("count", len(categories)).Msg("Successfully fetched categories")

	// Return the categories as a JSON response
	return c.JSON(http.StatusOK, categories)
}

func CreateCategory(c echo.Context) error {
	logger := common.Logger
	// Log entry into the handler
	logger.Info().Str("handler", "CreateCategory").Msg("Creating a new category")

	// Initialize a new Category instance
	category := new(models.Category)

	// Bind the incoming JSON request to the category struct
	if err := c.Bind(category); err != nil {
		logger.Error().Str("handler", "CreateCategory").Err(err).Msg("Error binding request")
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid request payload"})
	}

	// Validate the category data
	if err := c.Validate(category); err != nil {
		logger.Error().Str("handler", "CreateCategory").Err(err).Msg("Validation error")
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Validation failed", "details": err.Error()})
	}

	// Fetch the user ID from the context
	userID, ok := c.Get("user_id").(int)
	if !ok {
		logger.Error().Str("handler", "CreateCategory").Msg("Invalid user ID in context")
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid user ID"})
	}

	// Log the restaurant ID being used
	restaurantID := category.RestaurantID
	logger.Debug().Int("restaurant_id", restaurantID).Msg("Received restaurant ID for category creation")

	// Check if the restaurant belongs to the user
	var ownerID int
	query := `SELECT ownerID FROM restaurants WHERE id = $1`
	err := config.Conn.QueryRow(c.Request().Context(), query, restaurantID).Scan(&ownerID)
	if err != nil {
		logger.Error().Str("handler", "CreateCategory").Err(err).Msg("Error fetching restaurant ownership")
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to verify restaurant ownership"})
	}

	// Ensure the user owns the restaurant
	if ownerID != userID {
		logger.Warn().Str("handler", "CreateCategory").Int("user_id", userID).Int("owner_id", ownerID).Msg("Unauthorized access attempt")
		return c.JSON(http.StatusForbidden, echo.Map{"error": "You do not have permission to create a category for this restaurant"})
	}

	// SQL query to insert the category into the database
	insertQuery := `INSERT INTO menu_categories (name, restaurant_id) VALUES ($1, $2) RETURNING id`

	// Execute the insert query and scan the returning ID into the category struct
	err = config.Conn.QueryRow(c.Request().Context(), insertQuery, category.Name, restaurantID).Scan(&category.ID)
	if err != nil {
		logger.Error().Str("handler", "CreateCategory").Err(err).Msg("Database error during category creation")
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to create category", "details": err.Error()})
	}

	logger.Info().Str("handler", "CreateCategory").Int("category_id", category.ID).Msg("Category created successfully")

	// Return the created category with a success response
	return c.JSON(http.StatusCreated, category)
}

func DeleteCategory(c echo.Context) error {
	logger := common.Logger

	// Log entry into the handler
	logger.Info().Str("handler", "DeleteCategory").Msg("Deleting a category")

	// Fetch the user ID from the context
	userID, ok := c.Get("user_id").(int)
	if !ok {
		logger.Error().Str("handler", "DeleteCategory").Msg("Invalid user ID in context")
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid user ID"})
	}

	// Get category ID from request parameters
	categoryIDParam := c.Param("id")
	categoryID, err := strconv.Atoi(categoryIDParam)
	if err != nil {
		logger.Error().Str("handler", "DeleteCategory").Str("category_id", categoryIDParam).Err(err).Msg("Invalid category ID")
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid category ID"})
	}

	// Retrieve the restaurant ID associated with the category
	var restaurantID int
	query := `SELECT restaurant_id FROM menu_categories WHERE id = $1`
	err = config.Conn.QueryRow(c.Request().Context(), query, categoryID).Scan(&restaurantID)
	if err != nil {
		logger.Error().Str("handler", "DeleteCategory").Int("category_id", categoryID).Err(err).Msg("Error fetching category")
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to fetch category"})
	}

	// Check if the restaurant belongs to the user
	var ownerID int
	query = `SELECT ownerID FROM restaurants WHERE id = $1`
	err = config.Conn.QueryRow(c.Request().Context(), query, restaurantID).Scan(&ownerID)
	if err != nil {
		logger.Error().Str("handler", "DeleteCategory").Int("restaurant_id", restaurantID).Err(err).Msg("Error fetching restaurant ownership")
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to verify restaurant ownership"})
	}

	// Ensure the user owns the restaurant
	if ownerID != userID {
		logger.Warn().Str("handler", "DeleteCategory").Int("user_id", userID).Int("owner_id", ownerID).Msg("Unauthorized access attempt")
		return c.JSON(http.StatusForbidden, echo.Map{"error": "You do not have permission to delete a category for this restaurant"})
	}

	// Delete the category
	// The ON DELETE CASCADE will automatically delete related menu_items and customizations
	deleteQuery := `DELETE FROM menu_categories WHERE id = $1`
	_, err = config.Conn.Exec(c.Request().Context(), deleteQuery, categoryID)
	if err != nil {
		logger.Error().Str("handler", "DeleteCategory").Int("category_id", categoryID).Err(err).Msg("Database error during category deletion")
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to delete category", "details": err.Error()})
	}

	logger.Info().Str("handler", "DeleteCategory").Int("category_id", categoryID).Msg("Category and related items deleted successfully")

	// Return success response
	return c.JSON(http.StatusOK, echo.Map{"message": "Category and related items deleted successfully"})
}
