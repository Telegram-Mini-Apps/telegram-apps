# telegram-webapp-auth

提供用於處理 Telegram Mini Apps 初始化資料的實用程式的軟體包。

## 安裝

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

## 驗證透過小程式收到的數據

如果將過期時間設為`None`，則函數將跳過過期時間檢查。但是，建議指定一個非無值，因為此檢查對於防止使用舊的被盜初始化資料非常重要。

```python
from datetime import timedelta

from telegram_webapp_auth.auth import TelegramAuthenticator
from telegram_webapp_auth.auth import generate_secret_key

# Bot token
BOT_TOKEN = "7342037359:AAHI25ES9xCOMPokpYoz-p8XVrZUdygo2J4"
SECRET_KEY = generate_secret_key(BOT_TOKEN)


def main():
    authenticator = TelegramAuthenticator(SECRET_KEY)
    
    # 以原始格式初始化資料。
    init_data = """user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%20%2B%20-%20%3F%20%5C%2F%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%22%7D&chat_instance=8134722200314281151&chat_type=private&auth_date=1733584787&hash=2174df5b000556d044f3f020384e879c8efcab55ddea2ced4eb752e93e7080d6&signature=zL-ucjNyREiHDE8aihFwpfR9aggP2xiAo3NSpfe-p7IbCisNlDKlo7Kb6G4D0Ao2mBrSgEk4maLSdv6MLIlADQ"""

	# 定義自初始化資料產生日期以來初始化資料的有效期限。
	expr_in = timedelta(hours=24)

    # 傳回初始化資料實例。
    # 如果初始化資料無效，將會引發錯誤。
	authenticator.validate(init_data, expr_in)


if __name__ == '__main__':
    main()
```

### Third-Party Validation

該套件允許驗證初始化資料以檢查它是否由 Telegram 簽署。

為此，請使用以下參數呼叫`validate_third_party`方法：
- `init_data: str`：原始格式的初始化資料。
- `bot_id: int`: 初始化資料的 Telegram Bot 發行者識別碼。
- `expr_in: Optional[timedelta]`: 初始化資料的最大壽命。
- `is_test: bool`: 此標誌表示該環境為測試環境。

以下是一個例子：

```python
from datetime import timedelta

from telegram_webapp_auth.auth import TelegramAuthenticator
from telegram_webapp_auth.auth import generate_secret_key

# Bot token
BOT_TOKEN = "7342037359:AAHI25ES9xCOMPokpYoz-p8XVrZUdygo2J4"
SECRET_KEY = generate_secret_key(BOT_TOKEN)


def main():
    authenticator = TelegramAuthenticator(SECRET_KEY)
    
    # 以原始格式初始化資料。
    init_data = """user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%20%2B%20-%20%3F%20%5C%2F%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%22%7D&chat_instance=8134722200314281151&chat_type=private&auth_date=1733584787&hash=2174df5b000556d044f3f020384e879c8efcab55ddea2ced4eb752e93e7080d6&signature=zL-ucjNyREiHDE8aihFwpfR9aggP2xiAo3NSpfe-p7IbCisNlDKlo7Kb6G4D0Ao2mBrSgEk4maLSdv6MLIlADQ"""

	# 初始化資料的 Telegram Bot 發行者識別碼。
	bot_id = 7342037359

	# 定義自初始化資料產生日期以來初始化資料的有效期限。
	expr_in = timedelta(hours=24)

    # 傳回初始化資料實例。
    # 如果初始化資料無效，將會引發錯誤。
	authenticator.validate_third_party(init_data, bot_id, expr_in)


if __name__ == '__main__':
    main()
```

## 文件

要查看文檔, [請訪問此鏈接](https://swimmwatch.github.io/telegram-webapp-auth).
