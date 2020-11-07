// imports:
import './App.css';

import React, { useEffect } from 'react';

import { Route, Switch, Redirect, useHistory } from 'react-router-dom';



import { connect } from 'react-redux';
import { getUserFromJWT } from './redux/actions';

import SecondaryHomeContainer from './containers/SecondaryHomeContainer';
import PrimaryHomeContainer from './containers/PrimaryHomeContainer';
import LoginContainer from './containers/LoginContainer';
import SignUpContainer from './containers/SignUpContainer';



// end of imports ------------------------------------

function App(props) {
  const history = useHistory()

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
            <Route path='/home' render={ () => <PrimaryHomeContainer history={history} />} />
          ) : (
            <Route path='/home' render={ () => <SecondaryHomeContainer history /> } />
          )
        }
        <Route path='/login'  render={ () => < LoginContainer history={history} /> } />
        <Route path='/signup'  render={ () => < SignUpContainer history={history} /> } />
      </Switch>
    </>
  );
}


// mapStateToProps/mapDispatchToProps
const msp = state => ({ user: state.user })
const mdp = dispatch => ({ getUser: () => dispatch(getUserFromJWT()) })

export default connect(msp, mdp)(App);
