// import SpiedGetter = jest.SpiedGetter;
//
// const retrieveLaunchParams = jest.fn();
//
// jest.mock('../../src/init/launch-params', () => {
//   return {
//     retrieveLaunchParams,
//   };
// });
//
// import {describe, expect, jest, it, afterEach, beforeEach} from '@jest/globals';
// import {init} from '../../src';
//
// describe('init', () => {
//   describe('init.ts', () => {
//     describe('init', () => {
//       // const windowSpy = jest.spyOn(global, 'window', 'get');
//       //
//       // let listeners: Record<string, ((...args: any) => any)[]>;
//       // let dispatchEvent: (event: string, ...args: any[]) => void;
//       // let addEventListener: (event: string, cb: (...args: any) => any) => void;
//       //
//       // beforeEach(() => {
//       //   listeners = {};
//       //   dispatchEvent = (event, ...args) => {
//       //     const cbs = listeners[event] || [];
//       //     cbs.forEach(cb => cb(...args));
//       //   };
//       //   addEventListener = (event, cb) => {
//       //     if (listeners[event] === undefined) {
//       //       listeners[event] = [];
//       //     }
//       //     listeners[event].push(cb);
//       //   };
//       // });
//       //
//       // afterEach(() => {
//       //   windowSpy.mockReset();
//       // });
//       //
//       // it('should call "web_app_request_viewport" bridge method ' +
//       //   'in case, current platform is not "macos"', () => {
//       //   const postMessage = jest.fn();
//       //   const wnd = {
//       //     addEventListener,
//       //     self: 1000,
//       //     top: 100,
//       //     parent: {postMessage},
//       //   };
//       //   windowSpy.mockImplementation(() => wnd as any);
//       //
//       //   retrieveLaunchParams.mockImplementationOnce(() => ({
//       //     initData: {authDate: new Date(), hash: 'abc'},
//       //     version: '5.0',
//       //     platform: 'test',
//       //     themeParams: {},
//       //   }));
//       //
//       //   expect(postMessage).toHaveBeenCalledTimes(0);
//       //   init({acceptScrollbarStyle: false});
//       //   expect(postMessage).toHaveBeenCalledTimes(1);
//       //   expect(postMessage).toHaveBeenCalledWith('web_app_request_viewport');
//       // });
//       expect(true).toBe(true);
//     });
//   });
// });