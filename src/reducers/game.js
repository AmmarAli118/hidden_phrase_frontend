import cardsReducer from './cards';
import clueReducer from './clue';
import playersReducer from './players';
import identitiesReducer from './identities';
import messagesReducer from './messages';

import {
  LOAD_GAME,
  REVEAL_IDENTITY,
  UPDATE_BOARD,
  NEW_CLUE,
  ADD_PLAYER,
  NEW_MESSAGE
} from '../actions/types'

const initialState = {
  id: null,
  cards: [],
  turn: null,
  clue: {
    word: '',
    number: ''
  },
  players: [],
  identities: {
    blue_spies: {},
    red_spies: {},
    innocent_bystander: {},
    assassin: {}
  },
  messages: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_GAME:
      return {
        ...state,
        id: action.id,
        turn: action.turn,
        players: playersReducer(state.players, action),
        cards: cardsReducer(state.cards, action),
        clue: clueReducer(state.clue, action),
        identities: identitiesReducer(state.identities, action),
        messages: messagesReducer(state.messages, action)
      };
    case REVEAL_IDENTITY:
      return {
        ...state,
        cards: cardsReducer(state.cards, action)
      };
    case UPDATE_BOARD:
      return { ...state, cards: cardsReducer(state.cards, action) };
    case NEW_CLUE:
      return { ...state, clue: clueReducer(state.clue, action) };
    case ADD_PLAYER:
      return { ...state, players: playersReducer(state.players, action) };
    case NEW_MESSAGE:
      return { ...state, messages: messagesReducer(state.messages, action) };
    default:
      return state;
  }
};
