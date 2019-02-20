import {
  FETCH_CURRENT_GAMES,
  NEW_GAME,
  PLAYER_JOIN
} from '../actions/actions'

const initialState = { games: [] };

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CURRENT_GAMES:
      return { ...state, games: action.games };
    case NEW_GAME:
      const game = state.games.find(game => game.id === action.game.id);
      return game
        ? state
        : {
            ...state,
            games: [...state.games, action.game]
          };
    case PLAYER_JOIN:
      return {
        ...state,
        games: state.games.map(game => {
          if (game.id === action.game.id) {
            return action.game;
          } else {
            return game;
          }
        })
      };
    default:
      return state;
  }
};
