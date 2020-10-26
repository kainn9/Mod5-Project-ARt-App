// imports:
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';

import { connect } from 'react-redux';
import { signupUser } from '../redux/actions';

import { Button, Form, Message, Segment, Menu, Icon } from 'semantic-ui-react';
import cityScape from '../images/cityScape.jpg';
// end of imports--------------------------------------------------------------

const SignUpContainer = (props) => {

    const history = useHistory();
    const [usernameInput, setUserNameInput] =  useState('');
    const [passwordInput, setPasswordInput] =  useState('');
    const [passwordInput2, setPasswordInput2] =  useState('');
    const [loginFailed, setLoginFailed] =  useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const signupHandler = () => {

        if (passwordInput !== passwordInput2) {
            setErrorMessage('passwords do not Match please try again')
            setLoginFailed(true)
        } else if (usernameInput.length < 5) {
            setErrorMessage('username must be at least 5 characters')
            setLoginFailed(true)
        } else if (passwordInput.length <= 0) {
            setErrorMessage('password cannot be blank')
            setLoginFailed(true)
        } else {

            props.signupUser({ 
                username: usernameInput, 
                password: passwordInput 
            }, setErrorMessage, setLoginFailed, history);
        }

        
        
    }

    return(
        <div 
            id='login'
            style = {{ height: '100%', width: '100%', backgroundImage: `url(${cityScape})` }}
        >
            <Menu raised inverted color={'black'} icon='labeled'>
        <NavLink 
          to='/login' 
          style={{ width: '50%' }}
        >
          <Menu.Item name='login' >
              <Icon name='id badge' />
              Login
          </Menu.Item>
        </NavLink>

        <NavLink 
          to='/signup' 
          style ={{ width: '50%' }}
        >
          <Menu.Item name='sign-up'>
            <Icon name='user secret' />
            Sign-Up
          </Menu.Item>
        </NavLink>
    </Menu>
        <Segment
        raised
            style ={{
                height: '30',
                width: '50%',
                margin: 'auto',
                top: '30%',
                position: 'relative',
            }}
        >
            <Form error={loginFailed}>
                <Form.Input 
                    type='text' 
                    label='enter username:' 
                    placeholder='username42'
                    value={usernameInput}
                    onChange={ (e) => setUserNameInput(e.target.value)}
                />
                <Form.Input 
                    type='password' 
                    label='enter password:' 
                    placeholder='password goes here'
                    value={passwordInput}
                    onChange={ (e) => setPasswordInput(e.target.value)}
                />
                <Form.Input 
                    type='password' 
                    label='confirm password:' 
                    placeholder='one more time please'
                    value={passwordInput2}
                    onChange={ (e) => setPasswordInput2(e.target.value)}
                />
                <Message
                    error
                    header='Error'
                    content={errorMessage}
                />
                <Button
                    onClick={ signupHandler }
                >
                    Submit
                </Button>
            </Form>
        </Segment>
        </div>
    );
};


const mdp = (dispatch) => ({ signupUser: (userData, setErrorMessage, setLoginFailed, history) => dispatch(signupUser(userData, setErrorMessage, setLoginFailed, history)) });
export default connect(null, mdp)(SignUpContainer);