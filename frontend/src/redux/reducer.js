import { combineReducers } from 'redux';

const defaultState = {
  user: null,
};

function userReducer(state = defaultState.user, action) {
  switch (action.type) {
    // getUser -->  signup user set the payload as the loggedUser because the payload is a user
    case 'getUser': return action.payload;

    case 'loginUser': return action.payload;

    case 'signupUser': return action.payload;

      // sets logged user to null on logout
    case 'logoutUser': return null;

      // either removes or adds an {id: someID} object to the likedPosts of the logged user. This keeps the front end relationships in state consistent with the backend
    case 'updateLikes':
      const shallowClone = { ...state };
      let isLiked = false;

      shallowClone.user.likedPosts.forEach((post) => { if (post.id === action.payload) isLiked = true; });

      isLiked
        ? (
          shallowClone.user.likedPosts = shallowClone.user.likedPosts.filter((post) => post.id !== action.payload)
        )
        : (
          shallowClone.user.likedPosts = [...shallowClone.user.likedPosts, { id: action.payload }]
        );

      return shallowClone;

      // same pattern as update likes but with followers
    case 'updateFollows':
      const shallowClone2 = { ...state };
      let following = false;

      shallowClone2.user.isFollowing.forEach((user) => { if (user.id === action.payload) following = true; });

      following
        ? (
          shallowClone2.user.isFollowing = shallowClone2.user.isFollowing.filter((user) => user.id !== action.payload)
        )
        : (
          shallowClone2.user.isFollowing = [...shallowClone2.user.isFollowing, { id: action.payload }]
        );

      return shallowClone2;

    case 'updatePosts':
      const shallowClone3 = { ...state };
      console.log(shallowClone3.user.posts);
      shallowClone3.user.posts.push({ id: action.payload });

      return shallowClone3;

    default: return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
