# telegram-webapp-auth

The package that provides utilities to work with
the [initialization data](../platform/init-data.md) of Telegram Mini Apps.

## Installation

::: code-group

```bash [pip]
pip install telegram-webapp-auth
```

```bash [poetry]
poetry add telegram-webapp-auth
```

```bash [uv]
uv add telegram-webapp-auth
```

:::

## Validating data received via the Mini App

If the expiration time is set to `None`, the function will skip the expiration time check. However, it
is recommended to specify a non-none value, as this check is considered important in preventing the
usage of old stolen initialization data.

```python
from datetime import timedelta

from telegram_webapp_auth.auth import TelegramAuthenticator
from telegram_webapp_auth.auth import generate_secret_key

# Bot token
BOT_TOKEN = "7342037359:AAHI25ES9xCOMPokpYoz-p8XVrZUdygo2J4"
SECRET_KEY = generate_secret_key(BOT_TOKEN)


def main():
    authenticator = TelegramAuthenticator(SECRET_KEY)
    
    # Init data in raw format.
    init_data = """user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%20%2B%20-%20%3F%20%5C%2F%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%22%7D&chat_instance=8134722200314281151&chat_type=private&auth_date=1733584787&hash=2174df5b000556d044f3f020384e879c8efcab55ddea2ced4eb752e93e7080d6&signature=zL-ucjNyREiHDE8aihFwpfR9aggP2xiAo3NSpfe-p7IbCisNlDKlo7Kb6G4D0Ao2mBrSgEk4maLSdv6MLIlADQ"""

	# Define how long since init data generation date init data is valid.
	expr_in = timedelta(hours=24)

    # Returns init data instance.
    # Will raise error in case, init data is invalid.
	authenticator.validate(init_data, expr_in)


if __name__ == '__main__':
    main()
```

### Third-Party Validation

The package allows validating init data to check if it was signed by Telegram.

To do so, call the `validate_third_party` method with the following arguments:
- `init_data: str`: Init data in raw format.
- `bot_id: int`: The Telegram Bot issuer identifier for the init data.
- `expr_in: Optional[timedelta]`: The maximum lifetime of the init data.
- `is_test: bool`: The flag that marks the environment as the testing one.

Here is an example:

```python
from datetime import timedelta

from telegram_webapp_auth.auth import TelegramAuthenticator
from telegram_webapp_auth.auth import generate_secret_key

# Bot token
BOT_TOKEN = "7342037359:AAHI25ES9xCOMPokpYoz-p8XVrZUdygo2J4"
SECRET_KEY = generate_secret_key(BOT_TOKEN)


def main():
    authenticator = TelegramAuthenticator(SECRET_KEY)
    
    # Init data in raw format.
    init_data = """user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%20%2B%20-%20%3F%20%5C%2F%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%22%7D&chat_instance=8134722200314281151&chat_type=private&auth_date=1733584787&hash=2174df5b000556d044f3f020384e879c8efcab55ddea2ced4eb752e93e7080d6&signature=zL-ucjNyREiHDE8aihFwpfR9aggP2xiAo3NSpfe-p7IbCisNlDKlo7Kb6G4D0Ao2mBrSgEk4maLSdv6MLIlADQ"""

	# The Telegram Bot issuer identifier for the init data.
	bot_id = 7342037359

	# Define how long since init data generation date init data is valid.
	expr_in = timedelta(hours=24)

    # Returns init data instance.
    # Will raise error in case, init data is invalid.
	authenticator.validate_third_party(init_data, bot_id, expr_in)


if __name__ == '__main__':
    main()
```

## Documentation

To see the documentation,
visit [this link](https://swimmwatch.github.io/telegram-webapp-auth).
