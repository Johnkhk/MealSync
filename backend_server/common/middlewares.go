// package middleware

// import (
// 	"fmt"
// 	"net/http"
// 	"os"
// 	"strings"

// 	"github.com/golang-jwt/jwt/v4"
// 	"github.com/labstack/echo/v4"
// )

// // Your JWT secret (should match NEXTAUTH_SECRET)
// var jwtSecret = []byte(os.Getenv("NEXTAUTH_SECRET")) // Ensure this matches NEXTAUTH_SECRET

// // JWTMiddleware validates the custom JWT and extracts claims
// func JWTMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
// 	return func(c echo.Context) error {
// 		authHeader := c.Request().Header.Get("Authorization")
// 		if authHeader == "" {
// 			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Missing Authorization header"})
// 		}

// 		// Extract the token from the Authorization header (remove "Bearer " prefix)
// 		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
// 		fmt.Println("Received token:", tokenString)

// 		// Parse the JWT token
// 		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
// 			// Validate the signing method
// 			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
// 				return nil, fmt.Errorf("unexpected signing method")
// 			}
// 			return jwtSecret, nil
// 		})

// 		if err != nil || !token.Valid {
// 			fmt.Println("Token validation failed:", err)
// 			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Invalid or expired token"})
// 		}

// 		// Extract claims
// 		claims, ok := token.Claims.(jwt.MapClaims)
// 		if !ok || !token.Valid {
// 			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Invalid token claims"})
// 		}

// 		// Extract internal user ID from claims
// 		userID, ok := claims["userId"].(string)
// 		if !ok {
// 			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Invalid user ID in token"})
// 		}

// 		c.Set("user_id", userID)

// 		return next(c)
// 	}
// }

package common

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

// var jwtSecret = []byte(os.Getenv("NEXTAUTH_SECRET")) // Secret key loaded from environment
var jwtSecret = []byte("98E3B2CC28F61492C6934531C828C") // Secret key loaded from environment

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

func JWTMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Missing Authorization header"})
		}

		// Extract the token from the Authorization header (remove "Bearer " prefix)
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		// fmt.Println("Received token:", tokenString)

		// Parse the JWT token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate the signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			// Debug: Print the secret used for verification
			secret := os.Getenv("NEXTAUTH_SECRET")
			// fmt.Println("JWT secret:", secret)

			return []byte(secret), nil // Use the secret from environment variable
		})

		if err != nil || !token.Valid {
			// fmt.Println("Token validation failed:", err)
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Invalid or expired token"})
		}

		// Extract claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Invalid token claims"})
		}

		// Debug: Print claims for inspection
		// fmt.Println("Token claims:", claims)

		// Handle user ID from `sub` claim (usually a string)
		sub, ok := claims["sub"].(float64) // JWT library often parses numbers as float64
		if !ok {
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Invalid or missing subject (sub) in token"})
		}

		// Convert `sub` to an integer if needed
		userID := int(sub)

		// Set user_id in the context
		c.Set("user_id", userID)

		// Debug log to confirm setting
		// fmt.Printf("Set user_id in context: %d\n", userID)

		return next(c)
	}
}

// func LoggingMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
// 	return func(c echo.Context) error {
// 		// log the request
// 		Logger.LogInfo().Fields(map[string]interface{}{
// 			"method": c.Request().Method,
// 			"uri":    c.Request().URL.Path,
// 			"query":  c.Request().URL.RawQuery,
// 		}).Msg("Request")

// 		// call the next middleware/handler
// 		err := next(c)
// 		if err != nil {
// 			Logger.LogError().Fields(map[string]interface{}{
// 				"error": err.Error(),
// 			}).Msg("Response")
// 			return err
// 		}

// 		return nil
// 	}
// }

func LoggingMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		startTime := time.Now()

		// Log the request details
		LogInfo().
			Str("method", c.Request().Method).
			Str("uri", c.Request().URL.Path).
			Str("query", c.Request().URL.RawQuery).
			Msg("Incoming request")

		// Call the next middleware or handler
		err := next(c)

		// Log the response details and duration
		duration := time.Since(startTime)
		if err != nil {
			LogError().
				Str("method", c.Request().Method).
				Str("uri", c.Request().URL.Path).
				Str("query", c.Request().URL.RawQuery).
				Err(err).
				Dur("duration", duration).
				Msg("Request completed with error")
			return err
		}

		LogInfo().
			Str("method", c.Request().Method).
			Str("uri", c.Request().URL.Path).
			Str("query", c.Request().URL.RawQuery).
			Int("status", c.Response().Status).
			Dur("duration", duration).
			Msg("Request completed successfully")

		return nil
	}
}
