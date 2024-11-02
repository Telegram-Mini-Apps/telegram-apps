# init-data-golang

该软件包提供用于处理 Telegram 迷你应用程序初始化数据的实用程序。 要了解
有关初始化数据及其用法的更多信息，请参阅
[文档](../platform/launch-parameters.md).

## 安装

```bash
go get github.com/telegram-mini-apps/init-data-golang
```

## 验证

如果过期时间设置为 `0`，函数将跳过过期时间检查。 不过，建议指定一个非零值，因为这一检查对于防止
使用被盗的旧初始化数据非常重要。

```go
package main

import (
	"fmt"
	"github.com/Telegram-Mini-Apps/init-data-golang"
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

## 解析

需要注意的是，`Parse` 函数不会执行与 `Validate` 函数相同的检查。 因此，该函数只对输入数据进行解析，而不对
哈希值或过期时间进行验证。

```go
package main

import (
    "fmt"
    "github.com/Telegram-Mini-Apps/init-data-golang"
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

## 签名

签署数据的函数会删除`hash`和`auth_date`等参数，因为假定
，`hash`将由函数返回，`auth_date`将由函数
本身设置。

```go
package main

import (
	"fmt"
	"github.com/Telegram-Mini-Apps/init-data-golang"
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

要查看 GoDoc 文档，请访问 [此链接](https://pkg.go.dev/github.com/telegram-mini-apps/init-data-golang)。
