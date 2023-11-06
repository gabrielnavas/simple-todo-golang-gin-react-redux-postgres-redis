package services

import (
	"backend/models"
	"backend/repositories"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
)

type TaskService struct {
	taskRepository         *repositories.TaskRepositoryPostgres
	userRepositoryPostgres *repositories.UserRepositoryPostgres
	loggerService          *LoggerService
}

func NewTaskService(
	taskRepository *repositories.TaskRepositoryPostgres,
	userRepositoryPostgres *repositories.UserRepositoryPostgres,
	loggerService *LoggerService,
) *TaskService {
	return &TaskService{taskRepository, userRepositoryPostgres, loggerService}
}

func (ts *TaskService) CreateTask(data *models.TaskRequest) (*models.TaskResponse, error) {
	owner, err := ts.userRepositoryPostgres.GetUserByID(data.OwnerId)
	if err != nil {
		ts.loggerService.Log(fmt.Sprintf("error on create task and get user by id %s - error => %s", data.OwnerId, err.Error()))
		return nil, errors.New("error on create task")
	}
	if owner == nil {
		ts.loggerService.Log(fmt.Sprintf("error on get user by id %s", data.OwnerId))
		return nil, errors.New("error on create task")
	}

	now := time.Now()
	task := &models.Task{
		Id:          uuid.NewString(),
		Description: strings.TrimSpace(data.Description),
		Owner:       *owner,
		CreatedAt:   now,
		UpdatedAt:   now,
		DeletedAt:   nil,
	}

	err = task.Validate()
	if err != nil {
		return nil, err
	}

	err = ts.taskRepository.InsertTask(task)
	if err != nil {
		ts.loggerService.Log(fmt.Sprintf("error on insert on postgres task: %v", task))
		return nil, errors.New("error on create task")
	}

	return task.ToDataResponse(), nil
}

func (ts *TaskService) UpdateTask(id string, data *models.TaskPartialsUpdateRequest) error {
	task, err := ts.taskRepository.GetTaskByID(id)
	if err != nil {
		ts.loggerService.Log(fmt.Sprintf("error on get task by id on postgres: %s", id))
		return errors.New("error on update task")
	}
	if task == nil {
		return errors.New("task not found")
	}
	if task.DeletedAt != nil {
		return errors.New("task already deleted")
	}

	task.Description = data.Description
	task.UpdatedAt = time.Now()

	err = ts.taskRepository.UpdateTask(id, task)
	if err != nil {
		ts.loggerService.Log(fmt.Sprintf("error on update on postgres task: %v", task))
		return errors.New("error on update task")
	}

	return nil
}

func (ts *TaskService) GetAllTasksByUserId(userId string) ([]*models.TaskResponse, error) {
	tasks, err := ts.taskRepository.GetAllTasksByUserId(userId)
	if err != nil {
		ts.loggerService.Log("error on get all tasks on postgres")
		return nil, errors.New("error on get all tasks on postgres")
	}

	tasksResponses := []*models.TaskResponse{}
	for _, task := range tasks {
		if task.DeletedAt == nil {
			tasksResponses = append(tasksResponses, task.ToDataResponse())
		}
	}

	return tasksResponses, nil
}

func (ts *TaskService) GetTaskById(id string) (*models.TaskResponse, error) {
	task, err := ts.taskRepository.GetTaskByID(id)
	if err != nil {
		ts.loggerService.Log(fmt.Sprintf("error on get task by id on postgres: %s", id))
		return nil, errors.New("error on get task on postgres by id")
	}
	if task == nil {
		return nil, nil
	}
	if task.DeletedAt != nil {
		return nil, nil
	}

	return task.ToDataResponse(), nil
}

func (ts *TaskService) RemoveTaskById(id string) error {
	task, err := ts.taskRepository.GetTaskByID(id)
	if err != nil {
		ts.loggerService.Log(fmt.Sprintf("error on get task by id on postgres: %s", id))
		return errors.New("error on get task on postgres by id")
	}
	if task == nil {
		return nil
	}

	ts.taskRepository.DeleteTask(id)

	return nil
}
