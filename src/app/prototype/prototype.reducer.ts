import { Action, Reducer } from 'redux';
import { PrototypeState } from './prototype.interfaces';
import { INCREMENT, DECREMENT, RENDER } from './prototype.action-creators';

let initialState: PrototypeState = { counter: 0, action: 'amount' };

export const prototypeReducer: Reducer<PrototypeState> = 
  (state: PrototypeState = initialState, action: Action): PrototypeState => {
    switch (action.type) {
      case INCREMENT:
        return Object.assign({}, state, { counter: state.counter + 1 });
      case DECREMENT:
        return Object.assign({}, state, { counter: state.counter - 1 });
      case RENDER:
        return Object.assign({}, state, { action: action['action'] });
      default:
        return state;
    }
  };