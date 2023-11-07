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

	loginResponse, err := ac.authenticationService.Login(data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, loginResponse)
}

func (ac *AuthenticationController) RegisterUser(c *gin.Context) {
	var data models.UserRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// create user
	_, err := ac.userService.CreateUser(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"details": err.Error()})
		return
	}

	// make login
	loginRequest := services.LoginRequest{
		Email:    data.Email,
		Password: data.Password,
	}
	loginResponse, err := ac.authenticationService.Login(loginRequest)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, loginResponse)
}
