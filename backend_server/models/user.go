package models

import "time"

type User struct {
	ID         int       `json:"id"`                              // Internal unique identifier (SERIAL PRIMARY KEY)
	ProviderID string    `json:"provider_id" validate:"required"` // Unique ID from the provider (e.g., Google sub)
	Email      string    `json:"email" validate:"required,email"` // User's email
	Role       string    `json:"role" validate:"required"`        // User role (e.g., 'owner', 'admin', 'staff')
	Provider   string    `json:"provider" validate:"required"`    // Provider name (e.g., 'google', 'github')
	CreatedAt  time.Time `json:"created_at"`                      // Timestamp when the user was created
}
