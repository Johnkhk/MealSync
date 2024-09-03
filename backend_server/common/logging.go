// common/logging.go
package common

import (
	"os"

	"github.com/rs/zerolog"
)

var Logger zerolog.Logger

// NewLogger initializes the zerolog logger
func NewLogger() {
	// Initialize zerolog with colorized output using ConsoleWriter
	output := zerolog.ConsoleWriter{Out: os.Stderr}

	// Customize the format of the log level to add colors
	output.FormatLevel = func(i interface{}) string {
		if i == nil {
			return ""
		}
		level := i.(string)
		switch level {
		case "debug":
			return "\033[36mDEBUG\033[0m" // Cyan
		case "info":
			return "\033[32mINFO\033[0m" // Green
		case "warn":
			return "\033[33mWARN\033[0m" // Yellow
		case "error":
			return "\033[31mERROR\033[0m" // Red
		case "fatal":
			return "\033[35mFATAL\033[0m" // Magenta
		case "trace":
			return "\033[34mTRACE\033[0m" // Blue
		default:
			return level
		}
	}

	// Initialize the global logger
	Logger = zerolog.New(output).With().Timestamp().Logger()
}

// LogInfo returns an event for logging info level messages
func LogInfo() *zerolog.Event {
	return Logger.Info()
}

// LogError returns an event for logging error level messages
func LogError() *zerolog.Event {
	return Logger.Error()
}

// LogDebug returns an event for logging debug level messages
func LogDebug() *zerolog.Event {
	return Logger.Debug()
}

// Add more functions for other log levels if needed...
