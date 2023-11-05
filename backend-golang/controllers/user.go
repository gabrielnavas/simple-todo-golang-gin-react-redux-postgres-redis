package controllers

import (
	"backend/middlewares"
	"backend/services"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	userService   *services.UserService
	loggerService *services.LoggerService
}

func NewUserController(userService *services.UserService, loggerService *services.LoggerService) *UserController {
	return &UserController{userService, loggerService}
}

func (uc *UserController) RegisterUser(c *gin.Context) {
	var data services.CreateUserRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := uc.userService.CreateUser(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"user": user})
}

func (uc *UserController) CurrentUser(c *gin.Context) {
	userId, _ := c.Get(middlewares.USER_ID)
	user, err := uc.userService.GetUserById(userId.(string))
	if err != nil {
		uc.loggerService.Log(fmt.Sprintf("error on get currect on user - user => %s", user.Id))
		c.JSON(http.StatusBadRequest, gin.H{"details": "user not available"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"user": user})
}
