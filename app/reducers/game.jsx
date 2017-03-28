import axios from 'axios'
import {createRef, connectToGame} from './firebase';
import {getDBGame} from './gameServer'
import {whoami} from './auth'
import {machiObject} from '../machiObjectTemplate'
import { browserHistory } from 'react-router';


const reducer = (state=null, action) => {

  switch(action.type) {

    case 'SET_GAME':
      return action.game

    // case 'CREATE_NEW_GAME':
    //   return action.game

    case 'FETCH_GAME':
      return action.game
  }

  return state
}

const SET_GAME = 'SET_GAME'

export const settingGame = game => {
  console.trace('set game');
  return { type: SET_GAME, game };
}

// const CREATE_NEW_GAME = 'CREATE_NEW_GAME'
//
// export const creatingNewGame = game => ({
//   type: CREATE_NEW_GAME, game
// })

const FETCH_GAME = 'FETCH_GAME'

export const fetchingGame = game => ({
  type: FETCH_GAME, game
})

// export const createGame = () => {
//   return dispatch =>
//     axios.post('/api/lobby/')
//       .then((game) => {
//         const gameData = game.data
//         dispatch(createRef(gameData.gameLink));
//
//         return gameData
//       })
//       .then((game) => {
//         dispatch(creatingNewGame(game))
//         browserHistory.push(`/lobby/${game.gameLink}`)
//       })
//       .catch(console.error)
// }

export const fetchGame = (game) => {
  return dispatch => {
    axios.get(`/api/game/${game.gameLink}`)
      .then((uniqueGame) => {
        let id = uniqueGame.data.id

        database.child(id).on('value', snap => {
          console.warn('called');
          dispatch(fetchingGame(snap.val()))
        })
        dispatch(getDBGame(uniqueGame))
        console.log('am i in here fetching game')
      })
      .catch(console.error)
  }
}

// export const addUserToGame = (link) => {
//   return dispatch => {
//     axios.get(`/api/lobby/${link}`)
//       .then((uniqueGame) => {
//         dispatch(connectToGame(uniqueGame.data.id))
//       })
//       .catch(console.error)
//   }
// };


export default reducer
