package repositories

import (
	"backend/models"
	"database/sql"
	"time"
)

type TaskRepositoryPostgres struct {
	db             *sql.DB
	userRepository *UserRepositoryPostgres
}

func NewTaskRepositoryPostgres(db *sql.DB, userRepository *UserRepositoryPostgres) *TaskRepositoryPostgres {
	return &TaskRepositoryPostgres{db, userRepository}
}

func (trp *TaskRepositoryPostgres) InsertTask(task *models.Task) error {
	query := `
		INSERT INTO tasks 
			(id, description, id_users, created_at, updated_at, deleted_at)
		VALUES 
			($1, $2, $3, $4, $5, $6)
	`

	err := trp.db.QueryRow(query, task.Id, task.Description, task.Owner.Id, task.CreatedAt, task.UpdatedAt, task.DeletedAt).Err()
	return err
}

func (trp *TaskRepositoryPostgres) GetAllTasksByUserId(userId string) ([]models.Task, error) {
	selectAllSQL := `
		SELECT id, description, id_users, created_at, updated_at, deleted_at 
		FROM tasks 
		WHERE id_users=$1
		ORDER BY 
			created_at DESC, 
			updated_at DESC
	`
	rows, err := trp.db.Query(selectAllSQL, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []models.Task
	for rows.Next() {
		var task models.Task
		var userId string

		// find task
		if err := rows.Scan(&task.Id, &task.Description, &userId, &task.CreatedAt, &task.UpdatedAt, &task.DeletedAt); err != nil {
			return nil, err
		}

		// find user
		user, err := trp.userRepository.GetUserByID(userId)
		if err != nil {
			return nil, err
		}
		task.Owner = *user

		tasks = append(tasks, task)
	}
	return tasks, nil
}

func (trp *TaskRepositoryPostgres) UpdateTask(id string, user *models.Task) error {
	updateTodoSQL := `
		UPDATE tasks
		SET
			description = $1,
			updated_at = $2
		WHERE id = $3
	`
	_, err := trp.db.Exec(updateTodoSQL, user.Description, time.Now(), id)
	return err
}

func (trp *TaskRepositoryPostgres) GetTaskByID(id string) (*models.Task, error) {
	query := `
		SELECT 
			id, description, id_users, created_at, updated_at, deleted_at 
		FROM tasks 
		WHERE id = $1
	`
	var task models.Task
	var userId string
	err := trp.db.QueryRow(query, id).
		Scan(&task.Id, &task.Description, &userId, &task.CreatedAt, &task.UpdatedAt, &task.DeletedAt)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	} else if err == sql.ErrNoRows {
		return nil, nil
	}

	// find user
	user, err := trp.userRepository.GetUserByID(userId)
	if err != nil {
		return nil, err
	}
	task.Owner = *user
	return &task, nil
}

func (trp *TaskRepositoryPostgres) DeleteTask(id string) error {
	updateTodoSQL := `
		UPDATE tasks
		SET
			deleted_at = $1
		WHERE id = $2
	`
	_, err := trp.db.Exec(updateTodoSQL, time.Now(), id)
	return err
}
