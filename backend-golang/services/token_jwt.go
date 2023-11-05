package services

import (
	"backend/models"
	"fmt"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

const (
	SUBJECT_CLAIMS    = "sub"
	EXPIRATION_CLAIMS = "exp"
	CREATED_AT_CLAIMS = "iat"
)

type TokenJWTService struct {
	secretJwt     string
	hoursExpToken int
}

func NewTokenJWTService(
	secretJwt string,
	hoursExpToken int,
) *TokenJWTService {
	return &TokenJWTService{secretJwt, hoursExpToken}
}

func (ats *TokenJWTService) GenerateToken(user *models.User) (string, error) {
	claims := ats.makeClaims(user)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(ats.secretJwt))
}

func (ats *TokenJWTService) TokenValid(tokenJwt string) error {
	_, err := jwt.Parse(tokenJwt, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(ats.secretJwt), nil
	})
	return err
}

func (ats *TokenJWTService) ExtractToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(ats.secretJwt), nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
}

func (ats *TokenJWTService) makeClaims(user *models.User) jwt.MapClaims {
	claims := jwt.MapClaims{}
	claims[SUBJECT_CLAIMS] = user.Id
	claims[EXPIRATION_CLAIMS] = ats.makeHours(time.Hour, time.Duration(ats.hoursExpToken))
	return claims
}

func (ats *TokenJWTService) makeHours(hours, hoursExpToken time.Duration) int64 {
	return time.Now().Add(time.Hour * hoursExpToken).Unix()
}
