import { getUserRoute, loginRoute, usersRoute } from '../railsRoutes';


export const getUserFromJWT = () => {
    
    let artScopeJWT = localStorage.getItem('artScopeJWT');
    
    return function (dispatch) {
        if(artScopeJWT) {
            
        }

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
        .catch(console.log);
    };
};

export const signupUser = (userData, setErrorMessage, setLoginFailed, history) => {

    return function (dispatch) {

        const fetchConfig = {
            method: 'POST',
            headers: { 
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({ user: userData })
            
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

export const updateUserLikes = (newLikeID) => {
    return function(dispatch) {
        dispatch({ type: 'updateLikes', payload: newLikeID })
    }
    
}

export const updateFollows = (followID) => {
    return function(dispatch) {
        dispatch({ type: 'updateFollows', payload: followID })
    }
    
}
