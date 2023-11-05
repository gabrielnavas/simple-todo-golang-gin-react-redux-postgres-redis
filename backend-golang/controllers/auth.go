package controllers

import (
	"backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthenticationController struct {
	authenticationService *services.AuthenticationService
}

func NewAuthenticationController(authenticationService *services.AuthenticationService) *AuthenticationController {
	return &AuthenticationController{authenticationService}
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
