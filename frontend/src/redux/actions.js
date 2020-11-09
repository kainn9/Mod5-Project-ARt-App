
import { getUserRoute, loginRoute, usersRoute } from '../railsRoutes';

// fetches user using jwt in local storage sets to null if the resp fails/user is not logged/has no token which will lead to a homepage redirect in app.js
export const getUserFromJWT = () => {
    
    let artScopeJWT = localStorage.getItem('artScopeJWT');
    
    return function (dispatch) {

        const fetchConfig = {
            method: 'GET',
            headers: { 
                Authorization: `Bearer ${artScopeJWT}`, 
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        };

        fetch(getUserRoute, fetchConfig)
        .then( response => {
            let validatedResponse = null;
            return response.ok ? (validatedResponse = response.json()) : (validatedResponse);
        })
        .then( user => dispatch({ type: 'getUser', payload: user }) )
    };
};
// post method to create a user and get a jwt token also
export const signupUser = (userData, setErrorMessage, setLoginFailed, history) => {

    return function (dispatch) {

        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('password', userData.password);
        formData.append('bio', userData.bio);
        formData.append('pro_pic', userData.pro_pic);
    

        const fetchConfig = {
            method: 'POST',
            // idk headers for formData
            headers: {}, 
            body: formData
            
        }
    
        fetch(usersRoute, fetchConfig)
        .then( response => {
            let validatedResponse = null;
            return response.ok ? (validatedResponse = response.json()) : (validatedResponse);
        })
        .then( user => {
            if (user) {
                localStorage.setItem('artScopeJWT', user.jwt);
                dispatch({ type: 'signupUser', payload: user })
                history.push('/')
            } else {
                setErrorMessage('Username already taken')
                setLoginFailed(true)
                dispatch({ type: 'signupUser', payload: user })

            }
        })


    }
    
    
}
// post method that creates jwt token in exchange for valid username/pass
export const loginUser = (userData, setErrorMessage, setLoginFailed, history) => {
    
    return function (dispatch) {
        const fetchConfig ={
            method:'POST',
            headers: {
              'content-type':'application/json',
              'accept':'application/json'
            },
            body: JSON.stringify({user: userData})

            
        };

        fetch(loginRoute, fetchConfig)
        .then( response => {
            let validatedResponse = null;
            return response.ok ? (validatedResponse = response.json()) : (validatedResponse);
        })
        .then( user => {
            if (user) {
                localStorage.setItem('artScopeJWT', user.jwt);
                dispatch({ type: 'loginUser', payload: user })
                history.push('/')
            } else {
                setErrorMessage('Username or password did not match')
                setLoginFailed(true)
                dispatch({ type: 'loginUser', payload: user })

            }
        })
    }
    
}
// passes in id of newly liked/unliked post to update action/reducer
export const updateUserLikes = (newLikeID) => {
    return function(dispatch) {
        dispatch({ type: 'updateLikes', payload: newLikeID })
    }
    
}
// passes in id of newly followed/unfollowed user to update action/reducer
export const updateFollows = (followID) => {
    return function(dispatch) {
        dispatch({ type: 'updateFollows', payload: followID })
    }
    
}