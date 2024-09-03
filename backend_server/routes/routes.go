package routes

import (
	"github.com/Johnkhk/MealSync/controllers"
	"github.com/labstack/echo/v4"
)

func RegisterRoutes(e *echo.Echo, authGroup *echo.Group) {

	// Users (No authentication needed)
	e.POST("/users", controllers.CreateUser)

	// Restaurants
	authGroup.GET("/restaurants", controllers.GetRestaurantsByOwnerID)
	authGroup.POST("/restaurants", controllers.CreateRestaurant)

	// Categories
	authGroup.GET("/categories", controllers.GetCategories)
}
