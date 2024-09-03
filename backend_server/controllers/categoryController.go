package controllers

import (
	"context"
	"net/http"

	"github.com/Johnkhk/MealSync/config"
	"github.com/Johnkhk/MealSync/models"
	"github.com/labstack/echo/v4"
)

func GetCategories(c echo.Context) error {
	rows, err := config.Conn.Query(context.Background(), "SELECT id, name, restaurant_id FROM categories WHERE restaurant_id = $1", c.Param("restaurant_id"))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to fetch restaurants"})
	}
	defer rows.Close()

	var categories []models.Category
	for rows.Next() {
		var category models.Category
		err := rows.Scan(&category.ID, &category.Name, &category.RestaurantID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to scan category"})
		}
		categories = append(categories, category)
	}

	return c.JSON(http.StatusOK, categories)
}
