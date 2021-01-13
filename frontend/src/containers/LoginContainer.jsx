import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Button, Form, Message, Segment, Menu, Icon,
} from 'semantic-ui-react';
import { loginUser } from '../redux/actions';

import {
  formSegment,
  loginWrapperStyle,

} from '../bigStyle';

// login page
const LoginContainer = (props) => {
  // state to control inputs:
  const [usernameInput, setUserNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // state to control error messages/ small front end validations
  const [errorMessage, setErrorMessage] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);

  // history hook
  const history = useHistory();

  // handles login
  const loginHandler = () => {
    // checks for username
    if (usernameInput.length < 1) {
      setErrorMessage('Username cannot be blank');
      setLoginFailed(true);

      // checks for password
    } else if (passwordInput.length < 1) {
      setErrorMessage('Password Cannot be Blank');
      setLoginFailed(true);

      // attempts to login
    } else {
      // login user comes is a redux action to store user in external store/redux
      // pass in the form information, setter hooks for errors, and history hook for redirect
      props.loginUser({
        username: usernameInput,
        password: passwordInput,
      }, setErrorMessage, setLoginFailed, history);
    }
  };

  return (

    <div
      id="login"
      style={loginWrapperStyle}
    >
      <Menu
        inverted
        color="black"
        icon="labeled"
      >

        <NavLink
          to="/login"
          style={{ width: '50%' }}
        >
          <Menu.Item name="login">
            <Icon name="id badge" />
            Login
          </Menu.Item>
        </NavLink>

        <NavLink
          to="/signup"
          style={{ width: '50%' }}
        >
          <Menu.Item name="sign-up">
            <Icon name="user secret" />
            Sign-Up
          </Menu.Item>
        </NavLink>
      </Menu>

      <Segment style={formSegment}>

        <Form error={loginFailed}>

          <Form.Input
            type="text"
            label="enter username:"
            placeholder="username42"
            value={usernameInput}
            onChange={(e) => setUserNameInput(e.target.value)}
          />

          <Form.Input
            type="password"
            label="enter password:"
            placeholder="password goes here"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />

          <Message
            error
            header="Error"
            content={errorMessage}
          />

          <Button onClick={loginHandler}>
            Submit
          </Button>
        </Form>
      </Segment>
    </div>
  );
};

// pass in the form information, setter hooks for errors, and history hook for redirect
const mdp = (dispatch) => ({
  loginUser: (userData, setErrorMessage, setLoginFailed, history) => dispatch(loginUser(userData, setErrorMessage, setLoginFailed, history)),
});

export default connect(null, mdp)(LoginContainer);
