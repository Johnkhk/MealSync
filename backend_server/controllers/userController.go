package controllers

import (
	"context"
	"log"
	"net/http"

	"github.com/Johnkhk/MealSync/config"
	"github.com/Johnkhk/MealSync/models"
	"github.com/labstack/echo/v4"
)

// CreateUser handles the creation of a new user or returns the existing user
func CreateUser(c echo.Context) error {
	// Bind the incoming JSON body to the User struct
	user := new(models.User)
	if err := c.Bind(user); err != nil {
		log.Printf("Binding error: %v", err)
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid request payload"})
	}

	// Log the bound user data for debugging
	log.Printf("Received user data: %+v", user)

	// Validate the incoming user data
	if err := c.Validate(user); err != nil {
		log.Printf("Validation error: %v", err)
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Validation failed: " + err.Error()})
	}

	// Check if the user with the same provider_id already exists
	var existingUser models.User
	err := config.Conn.QueryRow(context.Background(),
		"SELECT id, provider_id, email, role, provider, created_at FROM users WHERE provider_id = $1",
		user.ProviderID).Scan(&existingUser.ID, &existingUser.ProviderID, &existingUser.Email, &existingUser.Role, &existingUser.Provider, &existingUser.CreatedAt)

	if err == nil {
		// User exists, return the existing user data
		log.Printf("User already exists with provider_id: %v", user.ProviderID)
		return c.JSON(http.StatusOK, echo.Map{
			"message": "User already exists",
			"user":    existingUser,
		})
	} else if err.Error() != "no rows in result set" {
		// Handle other errors that are not related to "no rows in result set"
		log.Printf("Database query error: %v", err)
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to check for existing user: " + err.Error()})
	}

	// Insert the new user into the database using the custom connection
	query := `INSERT INTO users (provider_id, email, role, provider) VALUES ($1, $2, $3, $4) RETURNING id, created_at`
	err = config.Conn.QueryRow(context.Background(), query, user.ProviderID, user.Email, user.Role, user.Provider).Scan(&user.ID, &user.CreatedAt)
	if err != nil {
		log.Printf("Database insertion error: %v", err)
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to create user: " + err.Error()})
	}

	// Return the created user with ID and created_at fields populated
	return c.JSON(http.StatusCreated, echo.Map{
		"message": "User created successfully",
		"user":    user,
	})
}
