import { Action, Reducer } from 'redux';
import { PrototypeState } from './prototype.interfaces';
import { RENDER } from './prototype.action-creators';

let initialState: PrototypeState = { action: 'amount' };

export const prototypeReducer: Reducer<PrototypeState> =
  (state: PrototypeState = initialState, action: Action): PrototypeState => {
    switch (action.type) {
      case RENDER:
        return Object.assign({}, state, { action: action['action'] });
      default:
        return state;
    }
  };