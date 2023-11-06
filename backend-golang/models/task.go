package models

import (
	"errors"
	"time"
)

type Task struct {
	Id          string
	Description string
	Owner       User
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   *time.Time
}

func (t *Task) Validate() error {
	if len(t.Description) == 0 {
		return errors.New("description must be between 1 and 255 characters")
	}

	err := t.Owner.Validate()
	if err != nil {
		return err
	}

	if !time.Now().After(t.CreatedAt) {
		return errors.New("create at must be before now")
	}

	if !time.Now().After(t.UpdatedAt) {
		return errors.New("updated at must be before now")
	}

	if t.DeletedAt != nil && !time.Now().Before(*t.DeletedAt) {
		return errors.New("deleted at must be before now")
	}

	return nil
}

func (t *Task) ToDataResponse() *TaskResponse {
	return &TaskResponse{
		Id:          t.Id,
		Description: t.Description,
		Owner:       *t.Owner.ToResponse(),
		CreatedAt:   t.CreatedAt,
		UpdatedAt:   t.UpdatedAt,
		DeletedAt:   t.DeletedAt,
	}
}

type TaskRequest struct {
	Description string `json:"description" binding:"required"`
	OwnerId     string
}

type TaskPartialsUpdateRequest struct {
	Description string `json:"description" binding:"required"`
}

type TaskResponse struct {
	Id          string `json:"id"`
	Description string `json:"description" binding:"required"`
	Owner       UserResponse
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   *time.Time `json:"deleted_at"`
}
