package repositories

import (
	"fmt"

	"github.com/redis/go-redis/v9"
)

func MakeRedisConnection(host, port, password string) *redis.Client {
	uriConnection := fmt.Sprintf("%s:%s", host, port)
	rdb := redis.NewClient(&redis.Options{
		Addr:     uriConnection,
		Password: password, // no password set
		DB:       0,        // use default DB
	})
	return rdb
}
