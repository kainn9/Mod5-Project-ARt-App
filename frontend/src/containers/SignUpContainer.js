// imports:
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { connect } from 'react-redux';
import { signupUser } from '../redux/actions';

import { Button, Form, Message, Segment, Menu, Icon } from 'semantic-ui-react';
import cityScape from '../images/cityScape.jpg';
// end of imports--------------------------------------------------------------

// page for user signup
const SignUpContainer = (props) => {

    // state to control forms:
    const [usernameInput, setUserNameInput] =  useState('');
    const [passwordInput, setPasswordInput] =  useState('');
    const [passwordInput2, setPasswordInput2] =  useState('');
    // state for error messages
    const [loginFailed, setLoginFailed] =  useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // handle sign-up
    const signupHandler = () => {
        // inputs should match
        if (passwordInput !== passwordInput2) {
            setErrorMessage('passwords do not Match please try again')
            setLoginFailed(true)

            // username length must be greater than or equal to 5
        } else if (usernameInput.length <= 5) {
            setErrorMessage('username must be at least 5 characters')
            setLoginFailed(true)

            // password cannot be blank
        } else if (passwordInput.length <= 0) {
            setErrorMessage('password cannot be blank')
            setLoginFailed(true)

            // attempt to signup
        } else {
            // redux action
            // pass in the form information, setter hooks for errors, and history hook for redirect
            props.signupUser({ 
                username: usernameInput, 
                password: passwordInput 
            }, setErrorMessage, setLoginFailed, props.history);
        }

        
        
    }

    return(
        <div id='login' style = {{ height: '100%', width: '100%', backgroundImage: `url(${ cityScape })` }} >

            <Menu raised inverted color={'black'} icon='labeled'>

                <NavLink to='/login' style={{ width: '50%' }}>

                    <Menu.Item name='login' >
                        <Icon name='id badge' />
                        Login
                    </Menu.Item>

                </NavLink>

                <NavLink to='/signup' style ={{ width: '50%' }} >

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
            <Form error={ loginFailed }>

                <Form.Input 
                    type='text' 
                    label='enter username:' 
                    placeholder='username42'
                    value={ usernameInput }
                    onChange={ e => setUserNameInput(e.target.value)}
                />

                <Form.Input 
                    type='password' 
                    label='enter password:' 
                    placeholder='password goes here'
                    value={ passwordInput }
                    onChange={ e => setPasswordInput(e.target.value)}
                />

                <Form.Input 
                    type='password' 
                    label='confirm password:' 
                    placeholder='one more time please'
                    value={ passwordInput2 }
                    onChange={ e => setPasswordInput2(e.target.value)}
                />
                <Message
                    error
                    header='Error'
                    content={ errorMessage }
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

// pass in the form information, setter hooks for errors, and history hook for redirect
const mdp = (dispatch) => ({ signupUser: (userData, setErrorMessage, setLoginFailed, history) => dispatch(signupUser(userData, setErrorMessage, setLoginFailed, history)) });
export default connect(null, mdp)(SignUpContainer);