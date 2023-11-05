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

type UserService struct {
	userRepositoryPostgres *repositories.UserRepositoryPostgres
	userRepositoryRedis    *repositories.UserRepositoryRedis
	logger                 *LoggerService
	encryptPassword        *EncryptPassword
}

func NewUserService(
	userRepositoryPostgres *repositories.UserRepositoryPostgres,
	userRepositoryRedis *repositories.UserRepositoryRedis,
	logger *LoggerService,
	encryptPassword *EncryptPassword,
) *UserService {
	return &UserService{userRepositoryPostgres, userRepositoryRedis, logger, encryptPassword}
}

type CreateUserRequest struct {
	Username             string `json:"username" binding:"required"`
	Password             string `json:"password" binding:"required"`
	PasswordConfirmation string `json:"password_confirmation" binding:"required"`
}

type UserResponse struct {
	Id        string     `json:"id"`
	Username  string     `json:"username"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
}

func modelToResponse(user *models.User) *UserResponse {
	return &UserResponse{
		Id:        user.Id,
		Username:  user.Username,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
		DeletedAt: user.DeletedAt,
	}
}

func (us *UserService) CreateUser(data *CreateUserRequest) (*UserResponse, error) {
	if data.Password != data.PasswordConfirmation {
		return nil, errors.New("password is different from password confirmation")
	}

	passwordHash, err := us.encryptPassword.EncryptPassword(strings.TrimSpace(data.Password))
	if err != nil {
		us.logger.Log(fmt.Sprintf("encrypt password - error => %s", err))
		return nil, errors.New("problem on encrypt password")
	}

	now := time.Now().UTC()
	user := &models.User{
		Id:        uuid.NewString(),
		Username:  strings.TrimSpace(data.Username),
		Password:  passwordHash,
		CreatedAt: now,
		UpdatedAt: now,
		DeletedAt: nil,
	}
	err = user.Validate()
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on validate user: %v - error => %s", user, err))
		return nil, err
	}

	userFromRedis, err := us.userRepositoryRedis.GetUserByUsername(data.Username)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on get user by username: %v - error => %s", user.Username, err))
		return nil, err
	}
	if userFromRedis != nil {
		us.logger.Log(fmt.Sprintf("user already exists by username: %v - error => %s", user.Username, err))
		return nil, errors.New("user already exists by username")
	}

	userFromPg, err := us.userRepositoryPostgres.GetUserByUsername(data.Username)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on get user by username: %v - error => %s", user.Username, err))
		return nil, err
	}
	if userFromPg != nil {
		err := us.userRepositoryRedis.InsertUser(userFromPg)
		if err != nil {
			us.logger.Log(fmt.Sprintf("problem on insert user redis cache: %v - error => %s", user.Username, err))
			return nil, err
		}
		us.logger.Log(fmt.Sprintf("user already exists by username: %v - error => %s", user.Username, err))
		return nil, errors.New("user already exists by username")
	}

	err = us.userRepositoryPostgres.InsertUser(user)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on insert user postgres: %v - error => %s", user, err))
		return nil, errors.New("problem on insert user")
	}
	return modelToResponse(user), nil
}

func (us *UserService) GetUserById(id string) (*UserResponse, error) {
	user, err := us.userRepositoryRedis.GetUserByID(id)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on get user by id from redis: %v - error => %s", id, err))
		return nil, errors.New("problem on get user by id")
	}
	if user != nil {
		return modelToResponse(user), nil
	}

	user, err = us.userRepositoryPostgres.GetUserByID(id)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on get user by id from postgres: %v - error => %s", id, err))
		return nil, errors.New("problem on get user by id")
	}

	err = us.userRepositoryRedis.InsertUser(user)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on insert user by id on redis: %v - error => %s", id, err))
		return nil, errors.New("problem on get user by id")
	}

	return modelToResponse(user), nil
}

func (us *UserService) GetUserByUsername(username string) (*UserResponse, error) {
	userFromRedis, err := us.userRepositoryRedis.GetUserByUsername(username)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on get user by username from redis: %v - error => %s", username, err))
		return nil, errors.New("problem on get user by username")
	}
	if userFromRedis != nil {
		return modelToResponse(userFromRedis), nil
	}

	userFromPg, err := us.userRepositoryPostgres.GetUserByUsername(username)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on get user by username from postgres: %v - error => %s", username, err))
		return nil, errors.New("problem on get user by username")
	}

	err = us.userRepositoryRedis.InsertUser(userFromPg)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on insert user by username on redis: %v - error => %s", username, err))
		return nil, errors.New("problem on get user by username")
	}

	return modelToResponse(userFromPg), nil
}
