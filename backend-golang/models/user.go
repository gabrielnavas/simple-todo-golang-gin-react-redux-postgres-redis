package models

import (
	"errors"
	"time"
)

type User struct {
	Id        string
	Username  string
	Password  string
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

func (u *User) Validate() error {
	if len(u.Username) == 0 || len(u.Username) > 255 {
		return errors.New("username must be between 1 and 255 characters")
	}

	if len(u.Password) < 8 || len(u.Password) > 100 {
		return errors.New("password must be between 6 and 100 characters")
	}

	if !time.Now().After(u.CreatedAt) {
		return errors.New("create at must be before now")
	}

	if !time.Now().After(u.UpdatedAt) {
		return errors.New("updated at must be before now")
	}

	if u.DeletedAt != nil && !time.Now().Before(*u.DeletedAt) {
		return errors.New("deleted at must be before now")
	}

	return nil
}

// func (u *User) SaveUser() (*User, error) {
// 	var err error
// 	err = DB.Create(&u).Error
// 	if err != nil {
// 		return &User{}, err
// 	}
// 	return u, nil
// }

// func (u *User) BeforeSave(*gorm.DB) error {
// 	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
// 	if err != nil {
// 		return err
// 	}
// 	u.Password = string(hashedPassword)
// 	u.Username = html.EscapeString(strings.TrimSpace(u.Username))
// 	return nil
// }

// func GetUserByID(uid uint) (User, error) {
// 	var u User

// 	if err := DB.First(&u, uid).Error; err != nil {
// 		return u, errors.New("User not found!")
// 	}

// 	u.PrepareGive()
// 	return u, nil
// }

// func (u *User) PrepareGive() {
// 	u.Password = ""
// }

// func MakeLogin(username string, password string) (string, error) {
// 	var err error

// 	u := User{}

// 	err = DB.Model(User{}).Where("username = ?", username).Take(&u).Error

// 	if err != nil {
// 		return "", err
// 	}

// 	err = VerifyPassword(password, u.Password)

// 	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
// 		return "", err
// 	}

// 	token, err := token.GenerateToken(u.ID)

// 	if err != nil {
// 		return "", err
// 	}

// 	return token, nil
// }

// func VerifyPassword(password, hashedPassword string) error {
// 	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
// }
