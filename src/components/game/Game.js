import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionCable } from 'react-actioncable-provider';

import Board from './Board';
import SpyMasterBoard from './SpyMasterBoard';
import TeamSelection from './TeamSelection';
import Loader from '../Loader';
import withAuth from '../hocs/withAuth';
import { fetchGame, updateBoard, addMessage, addPlayer } from '../../actions';

class Game extends Component {
  state = { loaded: false };

  componentDidMount() {
    const { fetchGame, match } = this.props;
    fetchGame(match.params.id).then(() => {
      this.setState({ loaded: true });
    });
  }

  currentPlayer() {
    const { currentUser, players } = this.props;

    return players.find(player => player.id === currentUser.id);
  }

  hasJoined() {
    return !!this.currentPlayer();
  }

  renderBoard() {
    const player = this.currentPlayer();

    return player.role.includes('spy_master') ? <SpyMasterBoard /> : <Board />;
  }

  handleSocketResponse = data => {
    switch (data.type) {
      case 'UPDATE_BOARD':
        this.props.updateBoard(data.payload);
        break;
      case 'NEW_CLUE':
        this.props.changeClue(data.payload);
        break;
      case 'NEW_MESSAGE':
        this.props.addMessage(data.payload);
        break;
      case 'NEW_PLAYER':
        this.props.addPlayer(data.payload);
        break;
      default:
        console.log(data);
    }
  };

  renderGame() {
    if (this.state.loaded) {
      return this.hasJoined() ? this.renderBoard() : <TeamSelection />;
    } else {
      return <Loader />;
    }
  }

  render() {
    const { match } = this.props;
    return (
      <div className="Game">
        <ActionCable
          channel={{ channel: 'GamesChannel', game_id: match.params.id }}
          onReceived={this.handleSocketResponse}
        />
        {this.renderGame()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    players: state.game.players,
    currentUser: state.auth.currentUser
  };
};

export default withAuth(
  connect(mapStateToProps, { fetchGame, updateBoard, addMessage, addPlayer })(
    Game
  )
);
