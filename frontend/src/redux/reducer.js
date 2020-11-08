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

        case 'updateFollows':
            let shallowClone2 = {...state}
            let following = false;
            
            shallowClone2.user.isFollowing.forEach( user => { if (user.id === action.payload) following = true })

            following ? 
            (
                shallowClone2.user.isFollowing = shallowClone2.user.isFollowing.filter(user => user.id !== action.payload)
            ) 
                : 
            (   
                 shallowClone2.user.isFollowing = [...shallowClone2.user.isFollowing, { id: action.payload }]
            )
            
        return shallowClone2
        


        default: return state;
    };
};


let rootReducer = combineReducers({
    user: userReducer,
});

export default rootReducer;