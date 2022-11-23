---
sidebar_position: 2
---

# Events listening

Component instances use common way of events listening through `on` and `off`
functions:

```typescript  
const listener = (...args) => {  
  console.log(...args);
};  
component.on(event, listener); // add listener.  
component.off(event, listener); // remove listener.  
```  

Example with `BackButton` component:

```typescript
import {BackButton} from 'twa-sdk';

const backButton = new BackButton();
backButton.on('click', () => {
  console.log('Back button clicked.');
});
```

You can find list of supported events in components own documentations.