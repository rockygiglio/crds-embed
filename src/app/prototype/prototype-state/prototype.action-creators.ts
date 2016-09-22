import { Action, ActionCreator } from 'redux';

export const RENDER: string = 'RENDER';
export const render: ActionCreator<Action> = (action: string) => ({
  type: RENDER,
  action: action
});

