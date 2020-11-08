// imports:
import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { getUserFromJWT } from './redux/actions';

import SecondaryHomeContainer from './containers/SecondaryHomeContainer';
import PrimaryHomeContainer from './containers/PrimaryHomeContainer';
import LoginContainer from './containers/LoginContainer';
import SignUpContainer from './containers/SignUpContainer';

// end of imports ------------------------------------

function App(props) {

  // fetch user on component mount
  useEffect(() => {
    return props.getUser();
  }, []);

  return (

      // routing for login-signup/home... nested routing for logged in users in PrimaryHomeContainer
      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        {
          props.user ? (
            <Route path='/home' render={ () => <PrimaryHomeContainer />} />
          ) : (
            <Route path='/home' render={ () => <SecondaryHomeContainer /> } />
          )
        }
        <Route path='/login'  render={ () => < LoginContainer /> } />
        <Route path='/signup'  render={ () => < SignUpContainer /> } />
      </Switch>
  );
}

// saving user to redux and accessing user from redux
const msp = state => ({ user: state.user })
const mdp = dispatch => ({ getUser: () => dispatch(getUserFromJWT()) })

export default connect(msp, mdp)(App);
