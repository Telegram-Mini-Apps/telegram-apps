# 授权用户

本文提供了不同编程语言的代码示例，说明开发人员如何使用
Telegram [init data]（init-data.md）授权用户。

## 客户

首先，需要从客户端向服务器传输初始数据开始。 我们可以使用此代码
：

```typescript
import { retrieveLaunchParams } from '@telegram-apps/sdk';

const { initDataRaw } = retrieveLaunchParams();

fetch('https://example.com/api', {
  method: 'POST',
  headers：{
    Authorization: `tma ${initDataRaw}`
  },
})；
```

我们使用 `https://example.com/api` URL 向假想的服务器发送请求。 该请求使用 HTTP POST
方法（你可以使用任何你想要的方法），并附加 "Authorization"（授权）标头，这在这里是最重要的。
表示一个字符串，包含由空格分割的两个部分。 第一个描述授权方法（在
的情况下，我们的服务器将支持其他几种方法），第二个包含授权数据。 就
Telegram Mini Apps 而言，第二部分是原始 init 数据。

## 服务器

现在，当 init 数据传输到服务器端时，我们应该创建一个简单的 HTTP 服务器，使用这些数据并
授权用户。

### Node.js

Node.js 示例使用 [express](https://www.npmjs.com/package/express) 处理 HTTP 请求。

```typescript
import { validate, parse, type InitDataParsed } from '@telegram-apps/init-data-node';
import express, {
  type ErrorRequestHandler,
  type RequestHandler,
  type Response,
} from 'express';

/**
 * 在指定的 Response 对象中设置初始数据。
 * @param res - 响应对象。
 * @param initData - 初始数据。
 */
function setInitData(res: Response, initData: InitDataParsed): void {
  res.locals.initData = initData;
}

/**
 * 从响应对象中提取初始数据。
 * @param res - 响应对象。
 * 返回存储在响应对象中的初始数据。如果
 * 客户端未获授权，则返回未定义的数据。
 */
function getInitData(res: Response)：InitDataParsed | undefined {
  return res.locals.initData;
}

/**
 * 中间件授权外部客户端。
 * @param req - 请求对象。
 * @param res - 响应对象。
 * @param next - 调用下一个中间件的函数。
 */
const authMiddleware：RequestHandler = (req, res, next) => {
  // 我们希望以以下格式在授权头中传递初始数据：
  <auth-type> <auth-data>
  <auth-type> <auth-data> //
  const [authType, authData = ''] = (req.header('authorization') || '').split(' ');

  switch (authType) {
    case 'tma':
      try {
        // Validate init data.
        validate(authData, token, {
          // 我们认为初始数据标志的有效期为创建后 1 小时。
          expiresIn：3600,
        });

        // 解析初始数据。
        setInitData(res, parse(authData));
        return next();
      } catch (e) {
        return next(e);
      }
    // ... 其他授权方法。
    默认：
      return next(new Error('Unauthorized'));
  }
};

/**
 * 显示用户初始数据的中间件。
 * @param _req
 * @param res - 响应对象。
 * @param next - 调用下一个中间件的函数。
 */
const showInitDataMiddleware：RequestHandler = (_req, res, next) => {
  const initData = getInitData(res);
  if (!initData) {
    return next(new Error('Cant display init data as long as it was not found'));
  }
  res.json(initData);
};

/**
 * 显示用户初始数据的中间件。
 * @param err - 处理的错误。
 * @param _req
 * @param res - 响应对象。
 */
const defaultErrorMiddleware：ErrorRequestHandler = (err, _req, res) => {
  res.status(500).json({
    error: err.message,
  });
};

// 您的秘密机器人令牌。
const token = '1234567890:ABC';

// 创建一个 Express applet 并开始监听端口 3000。
const app = express();

app.use(authMiddleware);
app.get('/', showInitDataMiddleware);
app.use(defaultErrorMiddleware);

app.listen(3000);

// HTTP 服务器启动后，尝试向 URL 
// http://localhost:3000/ 发送 HTTP GET 请求，并在授权头中包含所需格式的数据。
```

### GoLang

GoLang 示例使用 [gin](https://gin-gonic.com/) 处理 HTTP 请求。

```go
package main

import (
	"context"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	initdata "github.com/telegram-mini-apps/init-data-golang"
)

type contextKey string

const (
	_initDataKey contextKey = "init-data"
)

// Returns new context with specified init data.
func withInitData(ctx context.Context, initData initdata.InitData) context.Context {
	return context.WithValue(ctx, _initDataKey, initData)
}

//
func ctxInitData(ctx context.Context) (initdata.InitData, bool) {
	initData, ok := ctx.Value(_initDataKey).(initdata.InitData)
	return initData, ok
}

//
func authMiddleware(token string) gin.HandlerFunc {
	return func(context *gin.Context) {
		// 我们希望以以下格式在授权头中传递初始数据：
		//<auth-type> <auth-data>
		//<auth-type> 必须是 "tma"，<auth-data> 是 Telegram Mini Apps 初始数据。
		authParts := strings.Split(context.GetHeader("authorization"), " ")
		if len(authParts) != 2 {
			context.AbortWithStatusJSON(401, map[string]any{
				"message": "Unauthorized",
			})
			return
		}

		authType := authParts[0]
		authData := authParts[1]

		switch authType {
		case "tma"：
			// 验证初始数据。我们认为初始数据标志的有效期为自
			// 创建时刻起 1 小时。
			if err := initdata.Validate(authData, token, time.Hour); err != nil {
				context.AbortWithStatusJSON(401, map[string]any{
					"message": err.Error(),
				})
				return
			}

			// 解析初始数据。我们将来肯定会用到它。
			initData, err := initdata.Parse(authData)
			if err != nil {
				context.AbortWithStatusJSON(500, map[string]any{
					"message": err.Error(),
				})
				return
			}

			context.Request = context.Request.WithContext(
				withInitData(context.Request.Context(), initData),
			)
		}
	}
}

//
func showInitDataMiddleware(context *gin.Context) {
	initData, ok := ctxInitData(context.Request.Context())
	if !ok {
		context.AbortWithStatusJSON(401, map[string]any{
			"message": "Init data not found",
		})
		return
	}

	context.JSON(200, initData)
}

func main() {
	// 您的秘密机器人令牌。
	token := "1234567890:ABC"

	r := gin.New()

	r.Use(authMiddleware(token))
	r.GET("/", showInitDataMiddleware)

	if err := r.Run(":3000"); err != nil {
		panic(err)
	}
}
```
