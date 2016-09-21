import { Action, Reducer } from 'redux';
import { PrototypeState } from './prototype.state';
import { INCREMENT, DECREMENT } from './prototype.action-creators';

let initialState: PrototypeState = { counter: 0 };

export const prototypeReducer: Reducer<PrototypeState> = 
  (state: PrototypeState = initialState, action: Action): PrototypeState => {
    switch (action.type) {
      case INCREMENT:
        return Object.assign({}, state, { counter: state.counter + 1 });
      case DECREMENT:
        return Object.assign({}, state, { counter: state.counter - 1 });
      default:
        return state;
    }
  };