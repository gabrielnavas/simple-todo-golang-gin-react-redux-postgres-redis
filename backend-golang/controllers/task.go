package controllers

import (
	"backend/middlewares"
	"backend/models"
	"backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type TaskController struct {
	taskService *services.TaskService
}

func NewTaskController(taskService *services.TaskService) *TaskController {
	return &TaskController{taskService}
}

func (tc *TaskController) CreateTask(c *gin.Context) {
	var data *models.TaskRequest
	c.ShouldBindJSON(&data)

	task, err := tc.taskService.CreateTask(data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"task": task,
	})
}

func (tc *TaskController) UpdateTask(c *gin.Context) {
	currentUserId, _ := c.Get(middlewares.USER_ID)

	userId, err := uuid.Parse(c.Query("userId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"details": "missing userId from query"})
		return
	}

	if currentUserId != userId.String() {
		c.JSON(http.StatusForbidden, gin.H{"details": "you do not have permission for this"})
		return
	}

	var data *models.TaskPartialsUpdateRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"details": err.Error()})
		return
	}

	taskId, err := uuid.Parse(c.Param("taskId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"details": "missing param id from path"})
		return
	}

	task, err := tc.taskService.GetTaskById(taskId.String())
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"details": err.Error(),
		})
		return
	}
	if task == nil {
		c.JSON(http.StatusNotFound, gin.H{
			"details": "task not found",
		})
		return
	}

	err = tc.taskService.UpdateTask(taskId.String(), data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"details": err.Error(),
		})
		return
	}

	c.Status(http.StatusNoContent)
}

func (tc *TaskController) GetTask(c *gin.Context) {
	currentUserId, _ := c.Get(middlewares.USER_ID)

	userId, err := uuid.Parse(c.Query("userId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"details": "missing userId from query"})
		return
	}

	if currentUserId != userId.String() {
		c.JSON(http.StatusForbidden, gin.H{"details": "you do not have permission for this"})
		return
	}

	taskId, err := uuid.Parse(c.Param("taskId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"details": "missing param id from path"})
		return
	}

	task, err := tc.taskService.GetTaskById(taskId.String())
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"details": err.Error(),
		})
		return
	}
	if task == nil {
		c.JSON(http.StatusNotFound, gin.H{
			"details": "task not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"task": task,
	})
}

func (tc *TaskController) GetAllTasks(c *gin.Context) {
	currentUserId, _ := c.Get(middlewares.USER_ID)

	userId, err := uuid.Parse(c.Query("userId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"details": "missing userId from query"})
		return
	}

	if currentUserId != userId.String() {
		c.JSON(http.StatusForbidden, gin.H{"details": "you do not have permission for this"})
		return
	}

	tasks, err := tc.taskService.GetAllTasksByUserId(userId.String())
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"tasks": tasks,
	})
}

func (tc *TaskController) RemoveTask(c *gin.Context) {
	currentUserId, _ := c.Get(middlewares.USER_ID)

	userId, err := uuid.Parse(c.Query("userId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"details": "missing userId from query"})
		return
	}

	if currentUserId != userId.String() {
		c.JSON(http.StatusForbidden, gin.H{"details": "you do not have permission for this"})
		return
	}

	taskId, err := uuid.Parse(c.Param("taskId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"details": "missing param id from path"})
		return
	}

	task, err := tc.taskService.GetTaskById(taskId.String())
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"details": err.Error(),
		})
		return
	}
	if task == nil {
		c.JSON(http.StatusNotFound, gin.H{
			"details": "task not found",
		})
		return
	}

	err = tc.taskService.RemoveTaskById(taskId.String())
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusNoContent, task)
}
