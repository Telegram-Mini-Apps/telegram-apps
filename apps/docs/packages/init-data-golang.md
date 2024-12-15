# init-data-golang

The package that provides utilities to work with
the [initialization data](../platform/launch-parameters.md) of Telegram Mini Apps.

## Installation

```bash
go get github.com/telegram-mini-apps/init-data-golang
```

## Validation

If the expiration time is set to `0`, the function will skip the expiration time check. However, it
is recommended to specify a non-zero value, as this check is considered important in preventing the
usage of old stolen initialization data.

```go
package main

import (
	"fmt"
	"time"

	initdata "github.com/telegram-mini-apps/init-data-golang"
)

func main() {
	// Init data in raw format.
	initData := "user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%20%2B%20-%20%3F%20%5C%2F%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%22%7D&chat_instance=8134722200314281151&chat_type=private&auth_date=1733509682&signature=TYJxVcisqbWjtodPepiJ6ghziUL94-KNpG8Pau-X7oNNLNBM72APCpi_RKiUlBvcqo5L-LAxIc3dnTzcZX_PDg&hash=a433d8f9847bd6addcc563bff7cc82c89e97ea0d90c11fe5729cae6796a36d73"

	// Telegram Bot secret key.
	token := "7342037359:AAHI25ES9xCOMPokpYoz-p8XVrZUdygo2J4"

	// Define how long since init data generation date init data is valid.
	expIn := 24 * time.Hour

	// Will return error in case, init data is invalid.
	fmt.Println(initdata.Validate(initData, token, expIn))
}

```

### Third-Party Validation

The package allows validating init data to check if it was signed by Telegram.

To do so, call the `ValidateThirdParty` function with the following arguments:

- `initData: string`: Init data in raw format.
- `botID: int64`: The Telegram Bot issuer identifier for the init data.
- `expIn: time.Time`: The maximum lifetime of the init data.

Here is an example:

```go
package main

import (
	"fmt"
	"time"

	initdata "github.com/telegram-mini-apps/init-data-golang"
)

func main() {
	// Init data in raw format.
	initData := "user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%20%2B%20-%20%3F%20%5C%2F%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%22%7D&chat_instance=8134722200314281151&chat_type=private&auth_date=1733584787&hash=2174df5b000556d044f3f020384e879c8efcab55ddea2ced4eb752e93e7080d6&signature=zL-ucjNyREiHDE8aihFwpfR9aggP2xiAo3NSpfe-p7IbCisNlDKlo7Kb6G4D0Ao2mBrSgEk4maLSdv6MLIlADQ"

	// Telegram Bot secret key.
	var botID int64 = 7342037359

	// Define how long since init data generation date init data is valid.
	expIn := 24 * time.Hour

	// Will return an error if init data is invalid.
	fmt.Println(initdata.ValidateThirdParty(initData, botID, expIn))
}
```

You can also use the `ValidateThirdPartyWithEnv` function with the additional boolean
argument responsible for marking the environment as the testing one.

## Parsing

It is important to note that the `Parse` function does not perform the same checks as the `Validate`
function. Therefore, this function solely parses incoming data without conducting validations for
the hash or expiration time.

```go
package main

import (
	"fmt"

	initdata "github.com/telegram-mini-apps/init-data-golang"
)

func main() {
	// Init data in raw format.
	initData := "user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%20%2B%20-%20%3F%20%5C%2F%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%22%7D&chat_instance=8134722200314281151&chat_type=private&auth_date=1733509682&signature=TYJxVcisqbWjtodPepiJ6ghziUL94-KNpG8Pau-X7oNNLNBM72APCpi_RKiUlBvcqo5L-LAxIc3dnTzcZX_PDg&hash=a433d8f9847bd6addcc563bff7cc82c89e97ea0d90c11fe5729cae6796a36d73"

	// Will return 2 values.
	// 1. InitData instance if passed data has a correct format.
	// 2. Error in case, something is wrong. 
	fmt.Println(initdata.Parse(initData))
}

```

## Signing

The functions that sign data remove parameters such as `hash` and `auth_date` since it is assumed
that the `hash` will be returned by the function and the `auth_date` will be set by the function
itself.

```go
package main

import (
	"fmt"
	"time"

	initdata "github.com/telegram-mini-apps/init-data-golang"
)

func main() {
	// Init data in raw format.
	initData := "user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%20%2B%20-%20%3F%20%5C%2F%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%22%7D&chat_instance=8134722200314281151&chat_type=private&auth_date=1733509682&signature=TYJxVcisqbWjtodPepiJ6ghziUL94-KNpG8Pau-X7oNNLNBM72APCpi_RKiUlBvcqo5L-LAxIc3dnTzcZX_PDg&hash=a433d8f9847bd6addcc563bff7cc82c89e97ea0d90c11fe5729cae6796a36d73"

	// Telegram Bot secret key.
	token := "7342037359:AAHI25ES9xCOMPokpYoz-p8XVrZUdygo2J4"

	// Signing timestamp.
	// Here we took the value from the initData variable
	// above (auth_date query parameter).
	authDate := time.Unix(1733509682, 0)

	// Signing query parameters.
	// Returned values:
	// 1. Parameters sign result ("hash" init data property).
	// 2. Error occurring while parsing query string as query parameters.
	fmt.Println(initdata.SignQueryString(initData, token, authDate))

	// Signing the same query parameters presented as a map.
	fmt.Println(initdata.Sign(map[string]string{
		"user":          "{\"id\":279058397,\"first_name\":\"Vladislav + - ? \\/\",\"last_name\":\"Kibenko\",\"username\":\"vdkfrost\",\"language_code\":\"ru\",\"is_premium\":true,\"allows_write_to_pm\":true,\"photo_url\":\"https:\\/\\/t.me\\/i\\/userpic\\/320\\/4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg\"}",
		"chat_instance": "8134722200314281151",
		"chat_type":     "private",
		"signature":     "TYJxVcisqbWjtodPepiJ6ghziUL94-KNpG8Pau-X7oNNLNBM72APCpi_RKiUlBvcqo5L-LAxIc3dnTzcZX_PDg",
	}, token, authDate))

	// In the console, you should see the same results.
}

```

## GoDoc

To see GoDoc documentation,
visit [this link](https://pkg.go.dev/github.com/telegram-mini-apps/init-data-golang).