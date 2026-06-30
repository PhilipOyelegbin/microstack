package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Note struct {
	ID      uint   `gorm:"primaryKey" json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Summary string `json:"summary"`
}

var DB *gorm.DB

func initDB() {
	_ = godotenv.Load()
	dsn := os.Getenv("DATABASE_URL")
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}
	DB.AutoMigrate(&Note{})
}

func createNote(c *gin.Context) {
	var note Note
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Call Flask Service for summary
	flaskURL := os.Getenv("FLASK_SERVICE_URL") + "/summarize"
	jsonData, _ := json.Marshal(map[string]string{"content": note.Content})
	resp, err := http.Post(flaskURL, "application/json", bytes.NewBuffer(jsonData))

	if err == nil {
		defer resp.Body.Close()
		var result map[string]string
		json.NewDecoder(resp.Body).Decode(&result)
		note.Summary = result["summary"]
	}

	DB.Create(&note)
	c.JSON(http.StatusCreated, note)
}

func getNotes(c *gin.Context) {
	var notes []Note
	DB.Find(&notes)
	c.JSON(http.StatusOK, notes)
}

func getHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "OK"})
}

func main() {
	initDB()
	r := gin.Default()
	r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:8000"},
        AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
        ExposeHeaders:     []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))
	r.POST("/notes", createNote)
	r.GET("/notes", getNotes)
	r.GET("/health", getHealth)
	r.Run(":" + os.Getenv("PORT"))
}
