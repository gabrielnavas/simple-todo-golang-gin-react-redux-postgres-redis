package services

import (
	"backend/models"
	"backend/repositories"
	"errors"
	"fmt"
)

type AuthenticationService struct {
	userRepositoryPostgres *repositories.UserRepositoryPostgres
	userRepositoryRedis    *repositories.UserRepositoryRedis
	logger                 *LoggerService
	encryptPassword        *EncryptPassword
	tokenJWT               *TokenJWTService
}

func NewAuthenticationService(
	userRepositoryPostgres *repositories.UserRepositoryPostgres,
	userRepositoryRedis *repositories.UserRepositoryRedis,
	logger *LoggerService,
	encryptPassword *EncryptPassword,
	tokenJWT *TokenJWTService,
) *AuthenticationService {
	return &AuthenticationService{
		userRepositoryPostgres,
		userRepositoryRedis,
		logger,
		encryptPassword,
		tokenJWT,
	}
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (as *AuthenticationService) Login(data LoginRequest) (string, error) {
	var user *models.User = nil

	user, err := as.userRepositoryRedis.GetUserByEmail(data.Email)
	if err != nil {
		as.logger.Log(fmt.Sprintf("problem on get user by email: %v - error => %s", data.Email, err))
		return "", errors.New("problem on get user by email")
	}
	if user == nil {
		user, err = as.userRepositoryPostgres.GetUserByEmail(data.Email)
		if err != nil {
			as.logger.Log(fmt.Sprintf("problem on get user by email: %v - error => %s", data.Email, err))
			return "", errors.New("problem on get user by email")
		}
		if user == nil {
			as.logger.Log("user not found on login")
			return "", errors.New("email/password is not equals")
		}
	}

	if !as.encryptPassword.VerifyPassword(user.Password, data.Password) {
		return "", errors.New("email/password is not equals")
	}

	tokenJWT, err := as.tokenJWT.GenerateToken(user)
	if err != nil {
		as.logger.Log(fmt.Sprintf("problem on generate token by user: %v - error => %s", user.Id, err))
		return "", errors.New("problem on generate token")
	}

	return tokenJWT, nil
}
