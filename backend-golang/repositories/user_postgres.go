package repositories

import (
	"backend/models"
	"database/sql"
)

type UserRepositoryPostgres struct {
	db *sql.DB
}

func NewUserRepositoryPostgres(db *sql.DB) *UserRepositoryPostgres {
	return &UserRepositoryPostgres{db}
}

func (ur *UserRepositoryPostgres) InsertUser(user *models.User) error {
	query := "INSERT INTO users (id, email, password, created_at, updated_at, deleted_at) VALUES ($1, $2, $3, $4, $5, $6)"
	err := ur.db.QueryRow(query, &user.Id, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt, &user.DeletedAt).Err()
	return err
}

// func (ur *UserRepositoryPostgres) GetAllUsers() ([]models.User, error) {
// 	selectAllSQL := "SELECT id, email, password, created_at, updated_at, deleted_at FROM users"
// 	rows, err := ur.db.Query(selectAllSQL)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	var users []models.User
// 	for rows.Next() {
// 		var user models.User
// 		if err := rows.Scan(&user.Id, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt, &user.DeletedAt); err != nil {
// 			return nil, err
// 		}
// 		users = append(users, user)
// 	}
// 	return users, nil
// }

// func (ur *UserRepositoryPostgres) UpdateUser(id string, user *models.User) error {
// 	updateTodoSQL := `
// 		UPDATE users
// 		SET
// 			email = $1
// 			password = $2
// 			updated_at = $3
// 		WHERE id = $4
// 	`
// 	_, err := ur.db.Exec(updateTodoSQL, user.Email, user.Password, time.Now(), id)
// 	return err
// }

func (ur *UserRepositoryPostgres) GetUserByID(id string) (*models.User, error) {
	query := "SELECT id, email, password, created_at, updated_at, deleted_at FROM users WHERE id = $1"
	var user models.User
	err := ur.db.QueryRow(query, id).
		Scan(&user.Id, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt, &user.DeletedAt)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	} else if err == sql.ErrNoRows {
		return nil, nil
	}
	return &user, nil
}

func (ur *UserRepositoryPostgres) GetUserByEmail(email string) (*models.User, error) {
	query := "SELECT id, email, password, created_at, updated_at, deleted_at FROM users WHERE email = $1"
	var user models.User
	err := ur.db.QueryRow(query, email).
		Scan(&user.Id, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt, &user.DeletedAt)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	} else if err == sql.ErrNoRows {
		return nil, nil
	}
	return &user, nil
}

// func (ur *UserRepositoryPostgres) DeleteUser(id int) {
// 	updateTodoSQL := `
// 	UPDATE users
// 	SET
// 		deleted_at = $1
// 	WHERE id = $2
// `
// 	_, err := ur.db.Exec(updateTodoSQL, time.Now(), id)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// }
