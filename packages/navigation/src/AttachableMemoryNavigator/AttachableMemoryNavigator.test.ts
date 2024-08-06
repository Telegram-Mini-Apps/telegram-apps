// describe('attach', () => {
//   beforeEach(() => {
//     createWindow({ env: 'iframe' });
//   });
//
//   afterEach(() => {
//     vi.restoreAllMocks();
//     resetMiniAppsEventEmitter();
//   });
//
//   it('should hide the BackButton, if index === 0', () => {
//     const postEvent = vi.fn();
//     const n = new Navigator([''], 0, postEvent);
//
//     expect(postEvent).not.toHaveBeenCalled();
//     n.attach();
//     expect(postEvent).toHaveBeenCalledOnce();
//     expect(postEvent).toHaveBeenCalledWith('web_app_setup_back_button', { is_visible: false });
//   });
//
//   it('should show the BackButton, if index >= 1', () => {
//     const postEvent = vi.fn();
//     const n = new Navigator(['', ''], 1, postEvent);
//
//     expect(postEvent).not.toHaveBeenCalled();
//     n.attach();
//     expect(postEvent).toHaveBeenCalledOnce();
//     expect(postEvent).toHaveBeenCalledWith('web_app_setup_back_button', { is_visible: true });
//   });
//
//   it('should start tracking for "back_button_pressed" event and call "back" method whenever it occurs', () => {
//     const n = new Navigator(['', ''], 1, vi.fn() as any);
//     expect(n.index).toBe(1);
//     n.attach();
//     dispatchWindowMessageEvent('back_button_pressed');
//     expect(n.index).toBe(0);
//   });
// });

// describe('attached', () => {
//   beforeEach(() => {
//     createWindow({ env: 'iframe' });
//   });
//
//   describe('back', () => {
//     it('should hide back button if navigator is attached and cursor became 0', () => {
//       const postEvent = vi.fn();
//       const n = new MemoryNavigator(['', ''], 1, { postEvent });
//       n.attach();
//
//       postEvent.mockClear();
//       n.back();
//       expect(postEvent).toHaveBeenCalledOnce();
//       expect(postEvent).toHaveBeenCalledWith('web_app_setup_back_button', { is_visible: false });
//
//       postEvent.mockClear();
//       n.forward();
//       expect(postEvent).not.toHaveBeenCalled();
//     });
//   });
// });
//
// describe('detached', () => {
//   describe('back', () => {
//     it('should not hide back button if navigator is detached and cursor became 0', () => {
//       const postEvent = vi.fn();
//       const n = new MemoryNavigator(['', ''], 1, { postEvent });
//       n.back();
//       expect(postEvent).not.toHaveBeenCalled();
//     });
//   });
// });

// describe('detach', () => {
//   beforeEach(() => {
//     createWindow({ env: 'iframe' });
//   });
//
//   afterEach(() => {
//     vi.restoreAllMocks();
//     resetMiniAppsEventEmitter();
//   });
//
//   it('should stop tracking for "back_button_pressed" event', () => {
//     const n = new Navigator(['', ''], 1, vi.fn() as any);
//     expect(n.index).toBe(1);
//     n.attach();
//     n.detach();
//     dispatchWindowMessageEvent('back_button_pressed');
//     expect(n.index).toBe(1);
//   });
// });
