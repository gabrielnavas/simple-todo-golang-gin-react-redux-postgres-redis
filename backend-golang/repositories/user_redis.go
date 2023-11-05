package repositories

import (
	"backend/models"
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()

const (
	USER_KEY_ID   = "USER_ID"
	USER_KEY_NAME = "USER_NAME"
)

type UserRepositoryRedis struct {
	rdb            *redis.Client
	expirationTime time.Duration
}

func NewUserRepositoryRedis(rdb *redis.Client, expirationTime time.Duration) *UserRepositoryRedis {
	return &UserRepositoryRedis{rdb, expirationTime}
}

func (urr *UserRepositoryRedis) InsertUser(user *models.User) error {
	userKeyId := fmt.Sprintf("%s%s", USER_KEY_ID, user.Id)
	userKeyUsername := fmt.Sprintf("%s%s", USER_KEY_NAME, user.Username)

	value, err := json.Marshal(user)
	if err != nil {
		return err
	}

	err = urr.rdb.Set(ctx, userKeyId, string(value), 0).Err()
	if err != nil {
		return err
	}

	err = urr.rdb.Set(ctx, userKeyUsername, string(value), 0).Err()
	if err != nil {
		return err
	}

	return nil
}

func (urr *UserRepositoryRedis) GetUserByID(id string) (*models.User, error) {
	userKeyId := fmt.Sprintf("%s%s", USER_KEY_ID, id)
	return urr.getByKey(userKeyId)
}

func (urr *UserRepositoryRedis) GetUserByUsername(username string) (*models.User, error) {
	userKeyUsername := fmt.Sprintf("%s%s", USER_KEY_NAME, username)
	return urr.getByKey(userKeyUsername)
}

func (urr *UserRepositoryRedis) getByKey(key string) (*models.User, error) {
	val, err := urr.rdb.Get(ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			return nil, nil
		}
		return nil, err
	}

	user := &models.User{}
	json.Unmarshal([]byte(val), &user)
	return user, nil
}
