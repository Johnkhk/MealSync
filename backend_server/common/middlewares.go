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

var jwtSecret = []byte(os.Getenv("NEXTAUTH_SECRET")) // Secret key loaded from environment

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
