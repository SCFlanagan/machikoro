import React, { Component } from 'react';
import {browserHistory} from 'react-router';
import SelfDashboard from './SelfDashboard';
import CardGrid from './CardGrid';
import Opponent from './Opponent';
import DiceView from '../components/DiceView';
import ChooseDiceNumModal from './ChooseDiceNumModal';
import GameStatusModal from './GameStatusModal';
import InstructionButton from './Instructions'
import { Col, Row, Tooltip } from 'react-bootstrap';
import {connect} from 'react-redux'

class GamePage extends Component {

constructor(){
  super()
  this.state = {
    diceModal: false,
    statusModal: false
  }
  this.showDiceModal = this.showDiceModal.bind(this);
  this.closeDiceModal = this.closeDiceModal.bind(this);
  this.showStatusModal = this.showStatusModal.bind(this);
  this.closeStatusModal = this.closeStatusModal.bind(this);
  this.oponentsOrder = this.oponentsOrder.bind(this);
  }

  showDiceModal(){
    this.setState({diceModal: true});
  }
  closeDiceModal(){
    this.setState({diceModal: false});
  }
  showStatusModal(){
    this.setState({statusModal: true});
  }
  closeStatusModal(){
    this.setState({statusModal: false});
  }

  // componentWillReceiveProps(nextProps){
  //   console.log('nextprops', nextProps)
  //   if (nextProps.game) {
  //     this.oponentsOrder()
  //   }
  // }

  oponentsOrder(){
      let turnOrder = this.props.game.turnOrder;
      const turnArr = Object.keys(turnOrder);
      let oppArr = []
      turnArr.forEach(element => {
        oppArr.push(turnOrder[element])
      })

      let turn = this.props.game.turn
      let players = this.props.game.players
      let user = this.props.user.name
      const playersObj = Object.keys(players)

      let currentPlayer;
      playersObj.forEach(player => {
        if (players[player].name === user) {
          currentPlayer = player
        }
      })

      //loop to find current turn position in array
      const end = oppArr.length + 1
      const idx = oppArr.indexOf(currentPlayer)
      const result = oppArr.slice(idx+1, end).concat(oppArr.slice(0,idx))
      return result
  }

  render() {
    // need to make sure game is also on state
    if (this.props.firebaseRef === null || this.props.game === null) {
      return <h1>Loading...</h1>
    }

    //check who is this computer's player
    const oponent = this.oponentsOrder()

    return (
      <div className="global-board">
        <div className="row row-top">
          <Col sm={4}/>
          <Col sm={4}>
            <Opponent id='oponent-top' player={oponent[1]} avatar={'/images/avatar2.png'}/>
          </Col>
          <Col sm={4}>
            <InstructionButton />
          </Col>
        </div>
        <div className="row game-page-central">
          <Col sm={2}>
            <Opponent id='oponent-left' player={oponent[2]} avatar={'/images/avatar3.png'}/>
          </Col>
          <Col sm={8}>
            <CardGrid id="center" showStatus={this.showStatusModal} />
          </Col>
          <Col sm={2}>
            <Opponent id='oponent-right' player={oponent[0]} avatar={'/images/avatar4.png'}/>
          </Col>
        </div>
        <div className="row game-part-opponent">
          <SelfDashboard showStatus={this.showStatusModal} showModal={this.showDiceModal}/>
        </div>
        {this.state.diceModal ? <ChooseDiceNumModal closeModal={this.closeDiceModal} /> : null}
        {this.state.statusModal ? <GameStatusModal closeModal= {this.closeStatusModal} /> : null}
      </div>
    )

  }
}

export default connect(state => {
  return {
    firebaseRef: state.firebaseRef,
    game: state.game,
    user: state.auth
  }
})(GamePage)
