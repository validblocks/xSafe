import createObserver from './createObserver';

export enum GESTURE {
  SWIPE_LEFT = 'SWIPE_LEFT',
  SWIPE_RIGHT = 'SWIPE_RIGHT',
  SWIPE_UP = 'SWIPE_UP',
  SWIPE_DOWN = 'SWIPE_DOWN',
}

export const GestureObserver = createObserver<
  GESTURE,
  GESTURE | string | object
>();

export const { subscribe, publish } = GestureObserver;
