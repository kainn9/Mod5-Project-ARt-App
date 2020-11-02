// imports:
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { connect } from 'react-redux';
import { signupUser } from '../redux/actions';

import { Button, Form, Message, Segment, Menu, Icon } from 'semantic-ui-react';
import cityScape from '../images/cityScape.jpg';
import defaultPhoto from '../images/blank.png'
// end of imports--------------------------------------------------------------

// page for user signup
const SignUpContainer = (props) => {

    // state to control forms:
    const [usernameInput, setUserNameInput] =  useState('');
    const [passwordInput, setPasswordInput] =  useState('');
    const [passwordInput2, setPasswordInput2] =  useState('');
    const [bio, setBio] =  useState('');
    const [img, setImg] = useState(null);
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
            setErrorMessage('username must be at least 6 characters')
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
                password: passwordInput,
                bio: bio ? bio : 'No Bio',
                pro_pic: img ? img : new Blob([`url(${defaultPhoto})`])

            }, setErrorMessage, setLoginFailed, props.history);
        }

        
        
    }

    return(
        <div id='login' style = {{ height: 'fit', width: '100%', backgroundImage: `url(${ cityScape })`, minHeight: '100%'  }} >

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
                    <Message
                        error
                        header='Error'
                        content={ errorMessage }
                    />



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

                    <Form.Input 
                        type='text' 
                        label='optional short bio' 
                        placeholder='optional bio'
                        value={ bio }
                        onChange={ e => setBio(e.target.value)}
                    />

                    <span style={{  display: 'block', textAlign: 'center'}}>
                    <img src ={img ? URL.createObjectURL(img) : null } alt='upload preview' hidden={ !img } style={{ height: '25%', width: '100%' }} /> 
                    <br></br>
                        <label style = {{
                            display: 'inline-block',
                            padding: '6px 12px',
                            cursor: 'pointer',

                            }}
                        >
                        Optional Profile Picture
                        <Form.Input 
                            type="file" 
                            accept="image/*" 
                            multiple={false} 
                            onChange={ e => setImg(e.target.files[0]) } 
                            style ={{ width: '100%'}} 
                        />
                        </label>
                        <br></br>
                        
                            

                        
                        <Button
                            onClick={ signupHandler }
                            style ={{ width: '50%'}}
                        >
                            
                            Submit
                        </Button>
                        </span>
                </Form>
            </Segment>
        </div>
    );
};

// pass in the form information, setter hooks for errors, and history hook for redirect
const mdp = (dispatch) => ({ signupUser: (userData, setErrorMessage, setLoginFailed, history) => dispatch(signupUser(userData, setErrorMessage, setLoginFailed, history)) });
export default connect(null, mdp)(SignUpContainer);