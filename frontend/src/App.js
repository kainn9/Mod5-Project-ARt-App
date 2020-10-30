// imports:
import './App.css';

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

  useEffect(() => {
    return props.getUser();
  }, []);

  return (
    <>
    {console.log('app current user:', props.user)}
      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        {
          props.user ? (
            <Route  path='/home' render={ () => <PrimaryHomeContainer/>} />
          ) : (
            <Route path='/home' render={ () => <SecondaryHomeContainer /> } />
          )
        }
        <Route path='/login'  render={ () => < LoginContainer /> } />
        <Route path='/signup'  render={ () => < SignUpContainer /> } />
      </Switch>
    </>
  );
}


// mapStateToProps/mapDispatchToProps
const msp = state => ({ user: state.user })
const mdp = dispatch => ({ getUser: () => dispatch(getUserFromJWT()) })

export default connect(msp, mdp)(App);
