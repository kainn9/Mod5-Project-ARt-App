// imports:
import React from 'react';

import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';

import { connect } from 'react-redux';

import { Segment, Icon, Menu } from 'semantic-ui-react';
// end of imports-----------------------------------------

// Primary Navbar for logged in  views
const PrimaryNav = (props) => {
  // uses history for redirect on sign-out-- navLink/Link could also work I think...
  const history = useHistory();

  // logout -- props.logoutUser() -> sets user to null in redux store, remove authToken from localStorage, redirect to home
  const logoutHandler = () => {
    props.logoutUser()
    localStorage.removeItem('artScopeJWT');
    history.push('/')
  }

  return(
    <div style={{ width: '75%', margin: 'auto', textAlign: 'center' }} >

      <Segment raised inverted >

        <Menu raised inverted color={'black'} icon='labeled'>
          <NavLink to='/home' style={{ width: '25%' }} >
            <Menu.Item name='home' >
              <Icon name='home' />
              Home
            </Menu.Item>
          </NavLink>

          <NavLink to='/home/create-post' style ={{ width: '25%' }} >
            <Menu.Item name='create-post'>
              <Icon name='file image outline' />
              Create Post
            </Menu.Item>
          </NavLink>

            
          <Menu.Item id='filler' style ={{ width: '50%' }} />
            
          <Menu.Item name='logOut' onClick={ logoutHandler }>
            <Icon name='hand peace' />
            Log Out
          </Menu.Item>

        </Menu>
      
      </Segment>
    </div>
  );
    
};

// set user to null in redux
const mdp = dispatch => ({ logoutUser: () => dispatch({ type: 'logoutUser' }) })

export default connect(null, mdp)(PrimaryNav);