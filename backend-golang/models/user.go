package models

import (
	"errors"
	"net/mail"
	"time"
)

type User struct {
	Id        string
	Email     string
	Password  string
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

func (u *User) Validate() error {

	if len(u.Email) == 0 || len(u.Email) > 255 {
		return errors.New("email must be between 1 and 255 characters")
	}

	if _, err := mail.ParseAddress(u.Email); err != nil {
		return errors.New("email is not valid")
	}

	if len(u.Password) < 8 || len(u.Password) > 100 {
		return errors.New("password must be between 6 and 100 characters")
	}

	if !time.Now().After(u.CreatedAt) {
		return errors.New("create at must be before now")
	}

	if !time.Now().After(u.UpdatedAt) {
		return errors.New("updated at must be before now")
	}

	if u.DeletedAt != nil && !time.Now().Before(*u.DeletedAt) {
		return errors.New("deleted at must be before now")
	}

	return nil
}

type UserRequest struct {
	Email                string `json:"email" binding:"required"`
	Password             string `json:"password" binding:"required"`
	PasswordConfirmation string `json:"passwordConfirmation" binding:"required"`
}

type UserResponse struct {
	Id        string     `json:"id"`
	Email     string     `json:"email"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt"`
}

func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		Id:        u.Id,
		Email:     u.Email,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
		DeletedAt: u.DeletedAt,
	}
}
