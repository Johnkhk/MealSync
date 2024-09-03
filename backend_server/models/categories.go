package models

type Category struct {
	ID           int    `json:"id"`
	Name         string `json:"name" validate:"required"`          // Category name is required
	RestaurantID int    `json:"restaurant_id" validate:"required"` // RestaurantID is required
}
