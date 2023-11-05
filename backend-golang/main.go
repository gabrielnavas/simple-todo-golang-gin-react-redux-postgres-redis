package main

import (
	"backend/controllers"
	"backend/middlewares"
	"backend/repositories"
	"backend/services"
	"database/sql"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	var (
		SECRET_JWT      = os.Getenv("SECRET_JWT")
		HOURS_EXP_TOKEN = os.Getenv("HOURS_EXP_TOKEN")

		DB_PG_HOST     = os.Getenv("DB_PG_HOST")
		DB_PG_USER     = os.Getenv("DB_PG_USER")
		DB_PG_PASSWORD = os.Getenv("DB_PG_PASSWORD")
		DB_PG_NAME     = os.Getenv("DB_PG_NAME")
		DB_PG_PORT     = os.Getenv("DB_PG_PORT")

		DB_REDIS_HOST           = os.Getenv("DB_REDIS_HOST")
		DB_REDIS_PORT           = os.Getenv("DB_REDIS_PORT")
		DB_REDIS_PASSWORD       = os.Getenv("DB_REDIS_PASSWORD")
		DB_REDIS_DURATION_CACHE = os.Getenv("DB_REDIS_DURATION_CACHE")
	)

	dbPostgreSql := repositories.MakePostgresConnection(DB_PG_HOST, DB_PG_USER, DB_PG_PASSWORD, DB_PG_NAME, DB_PG_PORT)
	dbRedis := repositories.MakeRedisConnection(DB_REDIS_HOST, DB_REDIS_PORT, DB_REDIS_PASSWORD)
	authController := makeAuthController(dbPostgreSql, SECRET_JWT, HOURS_EXP_TOKEN, dbRedis, DB_REDIS_DURATION_CACHE)
	userController := makeUserController(dbPostgreSql, dbRedis, DB_REDIS_DURATION_CACHE)
	middlewareAuthJwt := makeMiddlewareAuthenticationJwt(SECRET_JWT, HOURS_EXP_TOKEN)

	r := gin.Default()

	public := r.Group("/api")

	public.POST("/register", userController.RegisterUser)
	public.POST("/login", authController.Login)

	protected := r.Group("/api/admin")
	protected.Use(middlewareAuthJwt.VerifyJwtAuthMiddleware())
	protected.Use(middlewareAuthJwt.AddUserIdOnStoreFromTokenJwt())
	protected.GET("/user", userController.CurrentUser)

	r.Run(":8080")
}

func makeAuthController(db *sql.DB, secret, hoursExpToken string, redisDb *redis.Client, redisTimeDuration string) *controllers.AuthenticationController {
	redisTimeDurationInt, _ := strconv.Atoi(redisTimeDuration)
	hoursExpTokenInt, _ := strconv.Atoi(hoursExpToken)
	loggerService := services.NewLoggerService()
	userRepository := repositories.NewUserRepositoryPostgres(db)
	userRepositoryRedis := repositories.NewUserRepositoryRedis(redisDb, time.Duration(redisTimeDurationInt))
	encryptPasswordService := services.NewEncryptPasswordService(loggerService)
	tokenJWTService := services.NewTokenJWTService(secret, hoursExpTokenInt)
	authenticationService := services.NewAuthenticationService(userRepository, userRepositoryRedis, loggerService, encryptPasswordService, tokenJWTService)
	return controllers.NewAuthenticationController(authenticationService)
}

func makeUserController(postgreSqlDb *sql.DB, redisDb *redis.Client, redisTimeDuration string) *controllers.UserController {
	redisTimeDurationInt, _ := strconv.Atoi(redisTimeDuration)
	loggerService := services.NewLoggerService()
	userRepositoryPostgres := repositories.NewUserRepositoryPostgres(postgreSqlDb)
	userRepositoryRedis := repositories.NewUserRepositoryRedis(redisDb, time.Duration(redisTimeDurationInt))
	encryptPasswordService := services.NewEncryptPasswordService(loggerService)
	authenticationService := services.NewUserService(userRepositoryPostgres, userRepositoryRedis, loggerService, encryptPasswordService)
	return controllers.NewUserController(authenticationService, loggerService)
}

func makeMiddlewareAuthenticationJwt(secret, hoursExpToken string) *middlewares.AuthenticationJwt {
	hoursExpTokenInt, _ := strconv.Atoi(hoursExpToken)
	tokenJWTService := services.NewTokenJWTService(secret, hoursExpTokenInt)
	loggerService := services.NewLoggerService()
	return middlewares.NewAuthenticationJwt(secret, loggerService, tokenJWTService)
}
