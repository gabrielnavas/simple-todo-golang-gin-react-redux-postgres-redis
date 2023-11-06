package controllers

import (
	"backend/models"
	"backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthenticationController struct {
	authenticationService *services.AuthenticationService
	userService           *services.UserService
}

func NewAuthenticationController(
	authenticationService *services.AuthenticationService,
	userService *services.UserService,
) *AuthenticationController {
	return &AuthenticationController{authenticationService, userService}
}

func (ac *AuthenticationController) Login(c *gin.Context) {
	var data services.LoginRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tokenJWT, err := ac.authenticationService.Login(data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": tokenJWT})
}

func (ac *AuthenticationController) RegisterUser(c *gin.Context) {
	var data models.UserRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := ac.userService.CreateUser(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"user": user})
}
