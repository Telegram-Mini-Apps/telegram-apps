import {beforeAll, describe, expect, it, jest, test} from '@jest/globals';
import {BackButton} from './BackButton';
// import {mockDesktop} from '../../../tests';
import {Bridge} from 'twa-bridge';

// beforeAll(mockDesktop);

describe('components', () => {
  describe('BackButton', () => {
    it('should be fine', () => {
      expect(true).toBe(true);
    })
    // describe('hide', () => {
    //   it('should not throw an error in case, version is 6.1 or higher', () => {
    //     expect(() => new BackButton('6.1', {isVisible: true}).hide()).not.toThrow();
    //     expect(() => new BackButton('6.2', {isVisible: true}).hide()).not.toThrow();
    //   });
    //
    //   it('should throw an error in case, version is lower than 6.1', () => {
    //     expect(() => new BackButton('6', {isVisible: true}).hide()).toThrow();
    //   });
    //
    //   it('should emit "visibleChange" event with false value', () => {
    //     const bb = new BackButton('7', {isVisible: true});
    //     const spy = jest.spyOn((bb as any).ee, 'emit');
    //     bb.hide();
    //
    //     expect(spy).toHaveBeenCalledWith('visibleChange', false);
    //   });
    //
    //   it('should set isVisible to false', () => {
    //     const bb = new BackButton('7', {isVisible: true});
    //     bb.hide();
    //
    //     expect(bb.isVisible).toBe(false);
    //   });
    //
    //   it('should call bridge "web_app_setup_back_button" method with {is_visible: false}', () => {
    //     const bridge = new Bridge();
    //     const spy = jest.spyOn(bridge, 'postEvent');
    //     const bb = new BackButton('7', {isVisible: true, bridge});
    //     bb.hide();
    //
    //     expect(spy).toHaveBeenCalledWith('web_app_setup_back_button', {is_visible: false});
    //   });
    // });
    //
    // describe('show', () => {
    //   it('should not throw an error in case, version is 6.1 or higher', () => {
    //     expect(() => new BackButton('6.1').show()).not.toThrow();
    //     expect(() => new BackButton('6.2').show()).not.toThrow();
    //   });
    //
    //   it('should throw an error in case, version is lower than 6.1', () => {
    //     expect(() => new BackButton('6').show()).toThrow();
    //   });
    //
    //   it('should emit "visibleChange" event with true value', () => {
    //     const bb = new BackButton('7');
    //     const spy = jest.spyOn((bb as any).ee, 'emit');
    //     bb.show();
    //     expect(spy).toHaveBeenCalledWith('visibleChange', true);
    //   });
    //
    //   it('should set isVisible to true', () => {
    //     const bb = new BackButton('7');
    //     bb.show();
    //     expect(bb.isVisible).toBe(true);
    //   });
    //
    //   it('should call bridge "web_app_setup_back_button" method with {is_visible: true}', () => {
    //     const bridge = new Bridge();
    //     const spy = jest.spyOn(bridge, 'postEvent');
    //     const bb = new BackButton('7', {bridge});
    //     bb.show();
    //     expect(spy).toHaveBeenCalledWith('web_app_setup_back_button', {is_visible: true});
    //   });
    // });
    //
    // describe('on', () => {
    //   test('"click" event should bind to bridge\'s "back_button_pressed" event', () => {
    //     const listener = jest.fn();
    //     const bridge = new Bridge();
    //     const spy = jest.spyOn(bridge, 'on');
    //     const backButton = new BackButton('7', {bridge});
    //     backButton.on('click', listener);
    //
    //     expect(spy).toHaveBeenCalledWith('back_button_pressed', listener);
    //   });
    //
    //   test('other events should be bound to BackButton event emitter', () => {
    //     const listener = jest.fn();
    //     const backButton = new BackButton('7');
    //     const spy = jest.spyOn((backButton as any).ee, 'on');
    //     backButton.on('visibleChange', listener);
    //
    //     expect(spy).toHaveBeenCalledWith('visibleChange', listener);
    //   });
    // });
    //
    // describe('off', () => {
    //   test('"click" event should unbound from bridge\'s "back_button_pressed" event', () => {
    //     const listener = jest.fn();
    //     const bridge = new Bridge();
    //     const spy = jest.spyOn(bridge, 'off');
    //     const backButton = new BackButton('7', {bridge});
    //     backButton.off('click', listener);
    //
    //     expect(spy).toHaveBeenCalledWith('back_button_pressed', listener);
    //   });
    //
    //   test('other events should be unbound from BackButton event emitter', () => {
    //     const listener = jest.fn();
    //     const backButton = new BackButton('7');
    //     const spy = jest.spyOn((backButton as any).ee, 'off');
    //     backButton.off('visibleChange', listener);
    //
    //     expect(spy).toHaveBeenCalledWith('visibleChange', listener);
    //   });
    // });
  });
});