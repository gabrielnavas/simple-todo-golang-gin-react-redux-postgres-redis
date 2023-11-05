package services

import (
	"errors"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

type EncryptPassword struct {
	logger *LoggerService
}

func NewEncryptPasswordService(logger *LoggerService) *EncryptPassword {
	return &EncryptPassword{logger}
}

func (pe *EncryptPassword) EncryptPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		pe.logger.Log(fmt.Sprintf("problem on encrypt password: %v - error => %s", password, err))
		return "", errors.New("error on generate from password")
	}
	return string(hashedPassword), nil
}

func (pe *EncryptPassword) VerifyPassword(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
