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

func (us *UserService) CreateUser(data *models.UserRequest) (*models.UserResponse, error) {
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
		Email:     strings.TrimSpace(data.Email),
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

	userFromRedis, err := us.userRepositoryRedis.GetUserByEmail(data.Email)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on get user by email: %v - error => %s", user.Email, err))
		return nil, err
	}
	if userFromRedis != nil {
		us.logger.Log(fmt.Sprintf("user already exists by email: %v - error => %s", user.Email, err))
		return nil, errors.New("user already exists by email")
	}

	userFromPg, err := us.userRepositoryPostgres.GetUserByEmail(data.Email)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on get user by email: %v - error => %s", user.Email, err))
		return nil, err
	}
	if userFromPg != nil {
		err := us.userRepositoryRedis.InsertUser(userFromPg)
		if err != nil {
			us.logger.Log(fmt.Sprintf("problem on insert user redis cache: %v - error => %s", user.Email, err))
			return nil, err
		}
		us.logger.Log(fmt.Sprintf("user already exists by email: %v - error => %s", user.Email, err))
		return nil, errors.New("user already exists by email")
	}

	err = us.userRepositoryPostgres.InsertUser(user)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on insert user postgres: %v - error => %s", user, err))
		return nil, errors.New("problem on insert user")
	}
	return user.ToResponse(), nil
}

func (us *UserService) GetUserById(id string) (*models.UserResponse, error) {
	user, err := us.userRepositoryRedis.GetUserByID(id)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on get user by id from redis: %v - error => %s", id, err))
		return nil, errors.New("problem on get user by id")
	}
	if user != nil {
		return user.ToResponse(), nil
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

	return user.ToResponse(), nil
}

func (us *UserService) GetUserByEmail(email string) (*models.UserResponse, error) {
	userFromRedis, err := us.userRepositoryRedis.GetUserByEmail(email)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on get user by email from redis: %v - error => %s", email, err))
		return nil, errors.New("problem on get user by email")
	}
	if userFromRedis != nil {
		return userFromRedis.ToResponse(), nil
	}

	userFromPg, err := us.userRepositoryPostgres.GetUserByEmail(email)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on get user by email from postgres: %v - error => %s", email, err))
		return nil, errors.New("problem on get user by email")
	}

	err = us.userRepositoryRedis.InsertUser(userFromPg)
	if err != nil {
		us.logger.Log(fmt.Sprintf("problem on insert user by email on redis: %v - error => %s", email, err))
		return nil, errors.New("problem on get user by email")
	}

	return userFromPg.ToResponse(), nil
}
