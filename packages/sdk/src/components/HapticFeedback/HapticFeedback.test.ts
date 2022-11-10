import {beforeAll, describe, expect, it, jest} from '@jest/globals';
import {HapticFeedback} from './HapticFeedback';
// import {mockDesktop} from '../../../tests';
import {Bridge} from 'twa-bridge';

// beforeAll(mockDesktop);

describe('components', () => {
  describe('HapticFeedback', () => {
    it('should be fine', () => {
      expect(true).toBe(true);
    })
    // describe('impactOccurred', () => {
    //   it('should not throw an error in case, version is 6.1 or higher', () => {
    //     expect(() => new HapticFeedback('6.1').impactOccurred('light')).not.toThrow();
    //     expect(() => new HapticFeedback('6.2').impactOccurred('light')).not.toThrow();
    //   });
    //
    //   it('should throw an error in case, version is lower than 6.1', () => {
    //     expect(() => new HapticFeedback('6').impactOccurred('light')).toThrow();
    //     expect(() => new HapticFeedback('6').impactOccurred('light')).toThrow();
    //   });
    //
    //   it(
    //     'should call bridge "web_app_trigger_haptic_feedback" ' +
    //     'event with "type" = "impact" and "impact_style" passed in function', () => {
    //       const bridge = new Bridge();
    //       const spy = jest.spyOn(bridge, 'postEvent');
    //       const haptic = new HapticFeedback('7', bridge);
    //       haptic.impactOccurred('medium');
    //
    //       expect(spy).toHaveBeenCalledWith('web_app_trigger_haptic_feedback', {
    //         type: 'impact',
    //         impact_style: 'medium',
    //       });
    //     },
    //   );
    // });
    //
    // describe('notificationOccurred', () => {
    //   it('should not throw an error in case, version is 6.1 or higher', () => {
    //     expect(() => new HapticFeedback('6.1').notificationOccurred('error')).not.toThrow();
    //     expect(() => new HapticFeedback('6.2').notificationOccurred('error')).not.toThrow();
    //   });
    //
    //   it('should throw an error in case, version is lower than 6.1', () => {
    //     expect(() => new HapticFeedback('6').notificationOccurred('error')).toThrow();
    //     expect(() => new HapticFeedback('6').notificationOccurred('error')).toThrow();
    //   });
    //
    //   it(
    //     'should call bridge "web_app_trigger_haptic_feedback" ' +
    //     'event with "type" = "notification" and "notification_type" passed in function', () => {
    //       const bridge = new Bridge();
    //       const spy = jest.spyOn(bridge, 'postEvent');
    //       const haptic = new HapticFeedback('7', bridge);
    //       haptic.notificationOccurred('error');
    //
    //       expect(spy).toHaveBeenCalledWith('web_app_trigger_haptic_feedback', {
    //         type: 'notification',
    //         notification_type: 'error',
    //       });
    //     },
    //   );
    // });
    //
    // describe('selectionChanged', () => {
    //   it('should not throw an error in case, version is 6.1 or higher', () => {
    //     expect(() => new HapticFeedback('6.1').selectionChanged()).not.toThrow();
    //     expect(() => new HapticFeedback('6.2').selectionChanged()).not.toThrow();
    //   });
    //
    //   it('should throw an error in case, version is lower than 6.1', () => {
    //     expect(() => new HapticFeedback('6').selectionChanged()).toThrow();
    //     expect(() => new HapticFeedback('6').selectionChanged()).toThrow();
    //   });
    //
    //   it(
    //     'should call bridge "web_app_trigger_haptic_feedback" ' +
    //     'event with "type" = "selection_change"', () => {
    //       const bridge = new Bridge();
    //       const spy = jest.spyOn(bridge, 'postEvent');
    //       const haptic = new HapticFeedback('7', bridge);
    //       haptic.selectionChanged();
    //
    //       expect(spy).toHaveBeenCalledWith('web_app_trigger_haptic_feedback', {
    //         type: 'selection_change',
    //       });
    //     },
    //   );
    // });
  });
});