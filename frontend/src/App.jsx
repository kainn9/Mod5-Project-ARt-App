import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUserFromJWT } from './redux/actions';

import SecondaryHomeContainer from './containers/SecondaryHomeContainer';
import PrimaryHomeContainer from './containers/PrimaryHomeContainer';
import LoginContainer from './containers/LoginContainer';
import SignUpContainer from './containers/SignUpContainer';

function App(props) {
  App.propTypes = {
    getUser: PropTypes.func,

    user: PropTypes.shape({
      bio: PropTypes.string,
      id: PropTypes.number,
      isFollowedBy: PropTypes.array,
      isFollowing: PropTypes.array,
      likedPosts: PropTypes.array,
      posts: PropTypes.array,
      proPic: PropTypes.object,
      username: PropTypes.string,
      postID: PropTypes.number,
    }),

  };

  App.defaultProps = {
    getUser: null,
    user: null,
  };

  const { user } = props;
  // fetch user on component mount
  useEffect(() => props.getUser(), []);

  return (
    // routing for login-signup/home... nested routing for logged in users in PrimaryHomeContainer
    <Switch>
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
      {user ? (
        <Route path="/home" render={() => <PrimaryHomeContainer />} />
      ) : (
        <Route path="/home" render={() => <SecondaryHomeContainer />} />
      )}
      <Route path="/login" render={() => <LoginContainer />} />
      <Route path="/signup" render={() => <SignUpContainer />} />
    </Switch>
  );
}

// saving user to redux and accessing user from redux
const msp = (state) => ({ user: state.user });

const mdp = (dispatch) => ({
  getUser: () => dispatch(getUserFromJWT()),
});

export default connect(msp, mdp)(App);
