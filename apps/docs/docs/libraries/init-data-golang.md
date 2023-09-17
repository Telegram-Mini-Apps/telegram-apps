---
sidebar_position: 100
---

# init-data-golang

The package provides utilities to work with the initialization data of Telegram Web Apps. To learn more about the initialization data and its usage, please refer to the [documentation](../launch-params/init-data.mdx).

## Installation

```bash
go get github.com/telegram-web-apps/init-data-golang
```

## Validation

If the expiration time is set to `0`, the function will skip the expiration time check. However, it is recommended to specify a non-zero value, as this check is considered important in preventing the usage of old stolen initialization data.

```go
package main

import (
	"fmt"
	"github.com/Telegram-Web-Apps/init-data-golang"
	"time"
)

func main() {
	// Init data in raw format.
	initData := "query_id=AAHdF6IQAAAAAN0XohDhrOrc&..."

	// Telegram Bot secret key.
	token := "627618978:amnnncjocxKJf"

	// Define how long since init data generation date init data is valid.
	expIn := 24 * time.Hour

	// Will return error in case, init data is invalid. To see,
	// which error could be returned, see errors.go file.
	fmt.Println(initdata.Validate(initData, token, expIn))
}
```

## Parsing

It is important to note that the `Parse` function does not perform the same checks as the `Validate` function. Therefore, this function solely parses incoming data without conducting validations for the hash or expiration time.

```go
package main

import (
    "fmt"
    "github.com/Telegram-Web-Apps/init-data-golang"
)

func main() {
	// Init data in raw format.
	initData := "query_id=AAHdF6IQAAAAAN0XohDhrOrc&..."
	
	// Will return 2 values.
	// 1. Pointer to InitData in case, passed data has correct format.
	// 2. Error in case, something is wrong. 
	fmt.Println(initdata.Parse(initData))
}
```

## Signing

The functions that sign data remove parameters such as `hash` and `auth_date` since it is assumed that the `hash` will be returned by the function and the `auth_date` will be set by the function itself.

```go
package main

import (
	"fmt"
	"github.com/Telegram-Web-Apps/init-data-golang"
	"time"
)

func main() {
	// Init data in raw format.
	initData := "query_id=AAHdF6IQAAAAAN0XohDhrOrc&..."

	// Telegram Bot secret key.
	token := "627618978:amnnncjocxKJf"

	// Signing timestamp.
	authDate := time.Now()

	// The first value is parameters sign result ("hash" init data property).
	// The second one is error which could occur while parsing query string as
	// query parameters.
	fmt.Println(initdata.SignQueryString(initData, token, authDate))
	// or
	fmt.Println(initdata.Sign(map[string]string{
		"query_id": "AAHdF6IQAAAAAN0XohDhrOrc",
		// ...
	}, token, authDate))
}
```

## GoDoc

To see GoDoc documentation, visit [this link](https://pkg.go.dev/github.com/telegram-web-apps/init-data-golang).