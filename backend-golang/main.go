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

	"github.com/gin-contrib/cors"

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

	// databases
	dbPostgreSql := repositories.MakePostgresConnection(DB_PG_HOST, DB_PG_USER, DB_PG_PASSWORD, DB_PG_NAME, DB_PG_PORT)
	dbRedis := repositories.MakeRedisConnection(DB_REDIS_HOST, DB_REDIS_PORT, DB_REDIS_PASSWORD)

	// controllers
	authController := makeAuthController(dbPostgreSql, SECRET_JWT, HOURS_EXP_TOKEN, dbRedis, DB_REDIS_DURATION_CACHE)
	userController := makeUserController(dbPostgreSql, dbRedis, DB_REDIS_DURATION_CACHE)
	taskController := makeTaskController(dbPostgreSql)

	// middlewwares
	middlewareAuthJwt := makeMiddlewareAuthenticationJwt(SECRET_JWT, HOURS_EXP_TOKEN)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"*"},
		AllowCredentials: true,
		// AllowOriginFunc: func(origin string) bool {
		// 	return origin == "https://github.com"
		// },
		MaxAge: 12 * time.Hour,
	}))

	public := r.Group("/api")

	public.POST("/register", authController.RegisterUser)
	public.POST("/login", authController.Login)

	userProtected := r.Group("/api/admin")
	userProtected.Use(middlewareAuthJwt.VerifyJwtAuthMiddleware())
	userProtected.Use(middlewareAuthJwt.AddUserIdOnStoreFromTokenJwt())
	userProtected.GET("/users", userController.CurrentUser)

	taskProtected := r.Group("/api")
	taskProtected.Use(middlewareAuthJwt.VerifyJwtAuthMiddleware())
	taskProtected.Use(middlewareAuthJwt.AddUserIdOnStoreFromTokenJwt())
	taskProtected.POST("/tasks", taskController.CreateTask)
	taskProtected.GET("/tasks", taskController.GetAllTasks)
	taskProtected.GET("/tasks/:taskId", taskController.GetTask)
	taskProtected.PATCH("/tasks/:taskId", taskController.UpdateTask)
	taskProtected.DELETE("/tasks/:taskId", taskController.RemoveTask)

	r.Run(":8080")
}

func makeAuthController(postgreSqlDb *sql.DB, secret, hoursExpToken string, redisDb *redis.Client, redisTimeDuration string) *controllers.AuthenticationController {
	redisTimeDurationInt, _ := strconv.Atoi(redisTimeDuration)
	hoursExpTokenInt, _ := strconv.Atoi(hoursExpToken)
	loggerService := services.NewLoggerService()
	userRepository := repositories.NewUserRepositoryPostgres(postgreSqlDb)
	userRepositoryRedis := repositories.NewUserRepositoryRedis(redisDb, time.Duration(redisTimeDurationInt))
	encryptPasswordService := services.NewEncryptPasswordService(loggerService)
	tokenJWTService := services.NewTokenJWTService(secret, hoursExpTokenInt)
	userRepositoryPostgres := repositories.NewUserRepositoryPostgres(postgreSqlDb)
	authenticationService := services.NewAuthenticationService(userRepository, userRepositoryRedis, loggerService, encryptPasswordService, tokenJWTService)
	userService := services.NewUserService(userRepositoryPostgres, userRepositoryRedis, loggerService, encryptPasswordService)
	return controllers.NewAuthenticationController(authenticationService, userService)
}

func makeUserController(postgreSqlDb *sql.DB, redisDb *redis.Client, redisTimeDuration string) *controllers.UserController {
	redisTimeDurationInt, _ := strconv.Atoi(redisTimeDuration)
	loggerService := services.NewLoggerService()
	userRepositoryPostgres := repositories.NewUserRepositoryPostgres(postgreSqlDb)
	userRepositoryRedis := repositories.NewUserRepositoryRedis(redisDb, time.Duration(redisTimeDurationInt))
	encryptPasswordService := services.NewEncryptPasswordService(loggerService)
	userService := services.NewUserService(userRepositoryPostgres, userRepositoryRedis, loggerService, encryptPasswordService)
	return controllers.NewUserController(userService, loggerService)
}

func makeMiddlewareAuthenticationJwt(secret, hoursExpToken string) *middlewares.AuthenticationJwt {
	hoursExpTokenInt, _ := strconv.Atoi(hoursExpToken)
	tokenJWTService := services.NewTokenJWTService(secret, hoursExpTokenInt)
	loggerService := services.NewLoggerService()
	return middlewares.NewAuthenticationJwt(secret, loggerService, tokenJWTService)
}

func makeTaskController(db *sql.DB) *controllers.TaskController {
	userRepositoryPostgres := repositories.NewUserRepositoryPostgres(db)
	taskRepositoryPostgres := repositories.NewTaskRepositoryPostgres(db, userRepositoryPostgres)
	loggerService := services.NewLoggerService()
	taskService := services.NewTaskService(taskRepositoryPostgres, userRepositoryPostgres, loggerService)
	return controllers.NewTaskController(taskService)
}
