package middlewares

import (
	"backend/services"
	"fmt"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

const (
	USER_ID = "user_id"
)

type AuthenticationJwt struct {
	secretJwt       string
	loggerService   *services.LoggerService
	tokenJWTService *services.TokenJWTService
}

func NewAuthenticationJwt(secretJwt string, loggerService *services.LoggerService, tokenJWTService *services.TokenJWTService) *AuthenticationJwt {
	return &AuthenticationJwt{
		secretJwt,
		loggerService,
		tokenJWTService,
	}
}

func (aj *AuthenticationJwt) VerifyJwtAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := aj.tokenValid(c)
		if err != nil {
			c.String(http.StatusUnauthorized, "Unauthorized")
			c.Abort()
			return
		}
		c.Next()
	}
}

func (aj *AuthenticationJwt) tokenValid(c *gin.Context) error {
	tokenString := aj.extractTokenString(c)
	_, err := aj.tokenJWTService.ExtractToken(tokenString)
	return err
}

func (aj *AuthenticationJwt) extractTokenString(c *gin.Context) string {
	bearerToken := c.Request.Header.Get("Authorization")
	if len(strings.Split(bearerToken, " ")) == 2 {
		return strings.Split(bearerToken, " ")[1]
	}
	return ""
}

func (aj *AuthenticationJwt) AddUserIdOnStoreFromTokenJwt() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := aj.extractTokenString(c)
		token, err := aj.tokenJWTService.ExtractToken(tokenString)
		if err != nil {
			aj.loggerService.Log(fmt.Sprintf("parse token unauthorized - error => %s", err.Error()))
			c.String(http.StatusUnauthorized, "Unauthorized")
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if ok && token.Valid {
			userId := claims[services.SUBJECT_CLAIMS]
			c.Set(USER_ID, userId)
			c.Next()
		}
	}
}
