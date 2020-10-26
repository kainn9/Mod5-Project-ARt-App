import { combineReducers } from 'redux';

let defaultState = {
    user: null,
};

function userReducer(state = defaultState.user, action) {
    
    switch (action.type) {

        case 'getUser': return action.payload;

        case 'loginUser': return action.payload;

        case 'signupUser': return action.payload;

        case 'logoutUser': return null;


        default: return state;
    };
};

let rootReducer = combineReducers({
    user: userReducer,
});

export default rootReducer;