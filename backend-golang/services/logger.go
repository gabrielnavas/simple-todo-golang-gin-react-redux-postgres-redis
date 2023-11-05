package services

import (
	"fmt"
	"log"
	"os"
	"time"
)

type LoggerService struct {
}

func NewLoggerService() *LoggerService {
	return &LoggerService{}
}

func (l *LoggerService) Log(message string) {
	message = fmt.Sprintf("[ * ] %s - %s", time.Now().UTC(), message)

	// Nome do arquivo de log
	logFileName := "log.txt"

	// Verifique se o arquivo de log já existe
	_, err := os.Stat(logFileName)

	if os.IsNotExist(err) {
		// O arquivo de log não existe, crie um novo
		file, err := os.Create(logFileName)
		if err != nil {
			log.Fatal("Não foi possível criar o arquivo de log:", err)
		}
		defer file.Close()
	}

	// Abra o arquivo de log em modo de anexação (append)
	file, err := os.OpenFile(logFileName, os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatal("Não foi possível abrir o arquivo de log:", err)
	}
	defer file.Close()

	// Escreva a linha de texto no arquivo de log
	_, err = file.WriteString(message)
	if err != nil {
		log.Fatal("Erro ao escrever no arquivo de log:", err)
	}

	fmt.Println(message)
}
