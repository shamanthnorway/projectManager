import { USER, FETCH_TEAMS, FETCH_TEAM } from '../actions';

export default function(state = {}, action) {
    switch(action.type) {
        case USER: {
            // console.log('Inside reducer: ', action.payload);
            return  {...state, user: action.payload};
        };
        case FETCH_TEAMS: {
            // console.log('Inside reducer',action);
            return  {...state, teams: action.payload.data};
        }
        case FETCH_TEAM: {
            // console.log('Inside reducer',action);
            return  {...state, team: action.payload.data};
        }
        default: return state
    }
}