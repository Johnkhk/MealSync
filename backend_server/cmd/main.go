package main

import (
	"context"
	"log"

	"github.com/Johnkhk/MealSync/config"
	customMiddleware "github.com/Johnkhk/MealSync/middleware" // Import your JWT middleware package
	"github.com/Johnkhk/MealSync/routes"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// CustomValidator wraps the validator instance
type CustomValidator struct {
	validator *validator.Validate
}

// Validate method to implement Echo's Validator interface
func (cv *CustomValidator) Validate(i interface{}) error {
	return cv.validator.Struct(i)
}

// func init() {
// 	// Load environment variables from .env file
// 	if err := godotenv.Load(); err != nil {
// 		log.Fatalf("Error loading .env file: %v", err)
// 	}

// 	// Debug print to verify secret
// 	jwtSecret := os.Getenv("NEXTAUTH_SECRET")
// 	if jwtSecret == "" {
// 		log.Println("NEXTAUTH_SECRET is not set!")
// 	} else {
// 		fmt.Printf("JWT Secret from .env: %s\n", jwtSecret) // Be cautious with printing secrets
// 	}
// }

func main() {
	// Load environment variables
	config.LoadConfig()

	// Connect to the database
	config.ConnectDB()

	// Ensure the database connection is closed when the application exits
	defer config.Conn.Close(context.Background())

	// Create a new Echo instance
	e := echo.New()

	// Register the custom validator with Echo
	e.Validator = &CustomValidator{validator: validator.New()}

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORS Middleware to handle CORS requests including preflight
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"}, // Replace with your frontend's URL
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.OPTIONS},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	// JWT Middleware group
	authGroup := e.Group("")                      // Create a group for routes that require JWT
	authGroup.Use(customMiddleware.JWTMiddleware) // Apply your custom OAuth middleware to the group

	// Register routes
	routes.RegisterRoutes(e, authGroup) // Pass both main Echo instance and the auth group

	// Start the server
	log.Println("Starting server on :8080")
	e.Logger.Fatal(e.Start(":8080"))
}
