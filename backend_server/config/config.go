package config

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v4"
	"github.com/joho/godotenv"
)

var Conn *pgx.Conn

func LoadConfig() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}
}

func ConnectDB() {
	var err error
	connString := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"))

	Conn, err = pgx.Connect(context.Background(), connString)
	if err != nil {
		fmt.Println("Unable to connect to database:", err)
		os.Exit(1)
	}

	fmt.Println("Connected to the database successfully!")
}
