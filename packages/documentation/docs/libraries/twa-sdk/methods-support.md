---
sidebar_position: 3
---

# Methods support

Almost each component is capable of checking whether is its method supported by
passed Web App version or not. To check if some methods are supported, you
should use `{Component}.supports()` function. For example:

```typescript  
import {BackButton} from 'twa-sdk';  
  
console.log(BackButton.supports('show', '6.0')); // false  
console.log(BackButton.supports('hide', '6.3')); // true  
```  

It is recommended to use this functionality before calling some component method
as long as this will make you sure, it will work. Component itself is not
checking if method is supported by current Web App version, what could lead to
issues.

List of supported methods by components is described in each component's
documentation.