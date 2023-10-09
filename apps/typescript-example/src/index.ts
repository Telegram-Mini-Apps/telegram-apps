import { init, type InitResult } from '@tma.js/sdk';

function onInit({ mainButton, backButton }: InitResult) {
  let counter = 0;

  const setCounter = (value: number) => {
    counter = value;

    if (counter === 0) {
      backButton.hide();
    } else {
      backButton.show();
    }

    mainButton.setText(`Counter: ${counter}`);
  };

  backButton.on('click', () => setCounter(counter - 1));
  mainButton.on('click', () => setCounter(counter + 1));
  mainButton.setText('Click me').enable().show();
}

function onError(e: unknown) {
  const div = document.createElement('div');
  div.innerText = e instanceof Error ? e.message : JSON.stringify(e);

  document.body.appendChild(div);
}

// Initialize SDK with debug mode on.
init({ debug: true })
  .then(onInit)
  .catch(onError);