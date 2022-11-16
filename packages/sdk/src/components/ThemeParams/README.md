# `ThemeParams`

Contains information about currently used theme by application.

## Usage

### Init

```typescript  
import {ThemeParams} from 'twa-sdk';  
  
const themeParams = new ThemeParams();  
```  

### Creating from JSON

`ThemeParams` could be created from their JSON representation (or JSON object
converted to string):

```typescript
const themeParams = ThemeParams.fromJson({bg_color: '#RRGGBB', ...})
```

Internally, `fromJson` uses `extractThemeFromJson` function
from `twa-theme-params` package.

### Requesting fresh theme params

To get fresh theme parameters information, you could use `request` static
function. It will return `TwaThemeParams` interface from `twa-theme-params`
package:

```typescript
import {init} from 'twa-bridge';

ThemeParams.request().then(console.log);
// or with bridge instance.
ThemeParams.request(init()).then(console.log);

// Output:
// { backgroundColor: '#aabbcc', ... }
```