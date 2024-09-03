package models

import "time"

type Restaurant struct {
	ID          int       `json:"id"`
	Name        string    `json:"name" validate:"required"`        // Restaurant name is required
	Location    string    `json:"location"`                        // Location is optional
	PhoneNumber string    `json:"phone_number"`                    // Phone number is optional
	Email       string    `json:"email" validate:"required,email"` // Email should be required and valid
	Website     string    `json:"website"`                         // Website is optional
	OwnerID     int       `json:"ownerID" validate:"required"`     // OwnerID is required
	CreatedAt   time.Time `json:"created_at"`
}
