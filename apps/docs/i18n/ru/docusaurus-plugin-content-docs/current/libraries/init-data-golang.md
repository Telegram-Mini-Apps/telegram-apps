# init-data-golang

Пакет, который предоставляет утилиты для работы с данными инициализации Telegram Web Apps. Чтобы узнать больше о данных инициализации и их использовании, пожалуйста, обратитесь к [документации](../launch-params/init-data.mdx).

## Установка

```bash
go get github.com/telegram-web-apps/init-data-golang
```

## Валидация

Если время истечения установлено равным `0`, функция пропустит проверку времени истечения. Однако рекомендуется указывать ненулевое значение, поскольку эта проверка считается важной для предотвращения использования старых украденных данных инициализации.

```go
package main

import (
	"fmt"
	"github.com/Telegram-Web-Apps/init-data-golang"
	"time"
)

func main() {
	// Данные инициализации в сыром формате.
	initData := "query_id=AAHdF6IQAAAAAN0XohDhrOrc&..."

	// Секретный ключа бота Telegram.
	token := "627618978:amnnncjocxKJf"

  // Указываем как долго данные инициализации считаются валидными.
	expIn := 24 * time.Hour

  // Вернет ошибку в случае, данные инициализации невалидны. Чтобы
  // увидеть, какие ошибки могут быть возвращены, откройте файл errors.go.
	fmt.Println(initdata.Validate(initData, token, expIn))
}
```

## Парсинг

Важно отметить, что функция `Parse` не выполняет те же проверки, что и функция `Validate`. Таким образом, эта функция анализирует только входящие данные, не проводя проверку хэша или времени истечения срока действия.

```go
package main

import (
    "fmt"
    "github.com/Telegram-Web-Apps/init-data-golang"
)

func main() {
	// Данные инициализации в сыром формате.
	initData := "query_id=AAHdF6IQAAAAAN0XohDhrOrc&..."
	
	// Вернет 2 значения.
	// 1. Указатель на InitData в случае, переданные данные имеют корректный формат.
	// 2. Ошибку, в случае если возникли какие-либо проблемы.
	fmt.Println(initdata.Parse(initData))
}
```

## Подпись

Функции, которые подписывают данные, удаляют такие параметры, как `hash` и `auth_date`, поскольку предполагается, что `hash` будет возвращен функцией, а `auth_date` ей будет передан.

```go
package main

import (
	"fmt"
	"github.com/Telegram-Web-Apps/init-data-golang"
	"time"
)

func main() {
	// Данные инициализации в сыром формате.
	initData := "query_id=AAHdF6IQAAAAAN0XohDhrOrc&..."

	// Секретный ключа бота Telegram.
	token := "627618978:amnnncjocxKJf"

	// Время подписания параметров.
	authDate := time.Now()
	
	// Первое возвращаемое значение это результат подписи (свойство "hash" в данных инициализации).
	// Второе, очевидно является ошибкой в случае, если что-то пошло не так.
	fmt.Println(initdata.SignQueryString(initData, token, authDate))
	// или
	fmt.Println(initdata.Sign(map[string]string{
		"query_id": "AAHdF6IQAAAAAN0XohDhrOrc",
		// ...
	}, token, authDate))
}
```

## GoDoc

Для просмотра GoDoc документации, перейдите по [этой ссылке](https://pkg.go.dev/github.com/telegram-web-apps/init-data-golang).