// /**
//  * You can import any code from other packages here. There are currently 2 shortcuts:
//  *
//  * 1. "@packages/*". Provides access to "packages" directory:
//  * import { postEvent } from '@packages/sdk/src/index.js';
//  *
//  * 2. "@/*". Provides easy access to packages' index files:
//  * import { postEvent } from '@/sdk';
//  */
//
// import { initBackButton } from '@/sdk';
//
// const bb = initBackButton();
//
// // setDebug(true);
//
// bb.show();
//
// // on('main_button_pressed', console.warn);

class Collector {
  private readonly listeners: (() => void)[] = [];

  add(fn: () => void) {
    this.listeners.push(fn);
  }

  cleanup() {
    this.listeners.forEach(l => l());
  }
}

function createCollector(): [(fn: (() => void)) => void, ()  => void] {
  const listeners: (() => void)[] = [];

  return [
    listeners.push.bind(listeners),
    () => listeners.forEach(l => l())
  ]
}

const a = new Collector();
const b = createCollector();

console.log(a, b);