import { Action, Reducer } from 'redux';
import { GivingState } from './giving.interfaces';
import { RENDER } from './giving.action-creators';

let initialState: GivingState = { action: 'amount' };

export const givingReducer: Reducer<GivingState> =
  (state: GivingState = initialState, action: Action): GivingState => {
    switch (action.type) {
      case RENDER:
        return Object.assign({}, state, { action: action['action'] });
      default:
        return state;
    }
  };