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

        case 'updateLikes':
            let shallowClone = {...state}
            let isLiked = false;

            shallowClone.user.likedPosts.forEach( post => { if (post.id === action.payload) isLiked = true })

            isLiked ? 
            (
                shallowClone.user.likedPosts = shallowClone.user.likedPosts.filter(post => post.id !== action.payload)
            ) 
                : 
            (   
                 shallowClone.user.likedPosts = [...shallowClone.user.likedPosts, { id: action.payload }]
            )
            
        return shallowClone
        


        default: return state;
    };
};


let rootReducer = combineReducers({
    user: userReducer,
});

export default rootReducer;