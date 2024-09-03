package controllers

import (
	"context"
	"log"
	"net/http"

	"github.com/Johnkhk/MealSync/config"
	"github.com/Johnkhk/MealSync/models"
	"github.com/labstack/echo/v4"
)

func GetRestaurant(c echo.Context) error {
	id := c.Param("id")
	var restaurant models.Restaurant
	err := config.Conn.QueryRow(context.Background(),
		"SELECT id, name, location, phone_number, email FROM restaurants WHERE id = $1", id).Scan(&restaurant.ID, &restaurant.Name, &restaurant.Location, &restaurant.PhoneNumber, &restaurant.Email)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to fetch restaurant"})
	}

	return c.JSON(http.StatusOK, restaurant)
}

func GetRestaurants(c echo.Context) error {
	rows, err := config.Conn.Query(context.Background(), "SELECT id, name, location, phone_number, email FROM restaurants")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to fetch restaurants"})
	}
	defer rows.Close()

	var restaurants []models.Restaurant
	for rows.Next() {
		var restaurant models.Restaurant
		err := rows.Scan(&restaurant.ID, &restaurant.Name, &restaurant.Location, &restaurant.PhoneNumber, &restaurant.Email)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to scan restaurant"})
		}
		restaurants = append(restaurants, restaurant)
	}

	return c.JSON(http.StatusOK, restaurants)
}

// CreateRestaurant handles the creation of a new restaurant
func CreateRestaurant(c echo.Context) error {
	// Retrieve the user_id from the context to use as ownerID
	userID, ok := c.Get("user_id").(int) // Ensure it is of type int
	if !ok {
		log.Println("Failed to retrieve user_id from context or invalid type")
		return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Unauthorized access"})
	}

	// Bind the incoming JSON body to the Restaurant struct
	restaurant := new(models.Restaurant)
	if err := c.Bind(restaurant); err != nil {
		log.Printf("Binding error: %v", err)
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid request payload"})
	}

	// Log the bound restaurant data for debugging
	log.Printf("Received restaurant data: %+v", restaurant)

	// Set the ownerID to the retrieved userID
	restaurant.OwnerID = userID

	// Validate the incoming restaurant data
	if err := c.Validate(restaurant); err != nil {
		log.Printf("Validation error: %v", err)
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Validation failed: " + err.Error()})
	}

	// Insert the new restaurant into the database using the custom connection
	query := `INSERT INTO restaurants (name, location, phone_number, email, website, ownerID) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`
	err := config.Conn.QueryRow(context.Background(), query, restaurant.Name, restaurant.Location, restaurant.PhoneNumber, restaurant.Email, restaurant.Website, restaurant.OwnerID).Scan(&restaurant.ID, &restaurant.CreatedAt)
	if err != nil {
		log.Printf("Database insertion error: %v", err) // Enhanced logging
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to create restaurant: " + err.Error()})
	}

	// Return the created restaurant with ID and created_at fields populated
	return c.JSON(http.StatusCreated, echo.Map{
		"message":    "Restaurant created successfully",
		"restaurant": restaurant,
	})
}

// GetRestaurantsByOwnerID handles fetching restaurants by ownerID
func GetRestaurantsByOwnerID(c echo.Context) error {
	log.Println("In GetRestaurantsByOwnerID")
	// Retrieve the user_id from the context to use as ownerID
	userID, ok := c.Get("user_id").(int) // Ensure it is of type int
	if !ok {
		log.Println("Failed to retrieve user_id from context or invalid type")
		return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Unauthorized access"})
	}

	// Query the database for restaurants belonging to the ownerID
	query := `SELECT id, name, location, phone_number, email, website, created_at FROM restaurants WHERE ownerID = $1`
	rows, err := config.Conn.Query(context.Background(), query, userID)
	if err != nil {
		log.Printf("Database query error: %v", err)
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to retrieve restaurants: " + err.Error()})
	}
	defer rows.Close()

	// Prepare a slice to hold the restaurant results
	var restaurants []models.Restaurant

	// Iterate over the rows and populate the restaurants slice
	for rows.Next() {
		var restaurant models.Restaurant
		if err := rows.Scan(&restaurant.ID, &restaurant.Name, &restaurant.Location, &restaurant.PhoneNumber, &restaurant.Email, &restaurant.Website, &restaurant.CreatedAt); err != nil {
			log.Printf("Row scanning error: %v", err)
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to process restaurants: " + err.Error()})
		}
		restaurants = append(restaurants, restaurant)
	}

	// Check for any errors encountered during iteration
	if err = rows.Err(); err != nil {
		log.Printf("Rows iteration error: %v", err)
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to retrieve restaurants: " + err.Error()})
	}

	// Return the retrieved restaurants as a JSON response
	return c.JSON(http.StatusOK, echo.Map{
		"restaurants": restaurants,
	})
}
