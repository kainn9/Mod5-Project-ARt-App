// imports:
import React from 'react';

import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';

import { connect } from 'react-redux';

import { Segment, Icon, Menu } from 'semantic-ui-react';
// end of imports-----------------------------------------


const PrimaryNav = (props) => {

  const history = useHistory();

  const logoutHandler = () => {
    console.log(props)
    props.logoutUser()
    localStorage.removeItem('artScopeJWT');
    history.push('/')
  }

  return(
      <div
      style={{ 
        width: '90%', 
        margin: 'auto', 
        textAlign: 'center',
      }}
      >
        <Segment raised inverted >
          <Menu raised inverted color={'black'} icon='labeled'>
              <NavLink 
                to='/login' 
                style={{ width: '25%' }}
              >
                <Menu.Item name='login' >
                    <Icon name='id badge' />
                    Login
                </Menu.Item>
              </NavLink>

              <NavLink 
                to='/signup' 
                style ={{ width: '25%' }}
              >
                <Menu.Item name='sign-up'>
                  <Icon name='user secret' />
                  Sign-Up
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

const mdp = dispatch => ({logoutUser: test => dispatch({ type: 'logoutUser' }) })

export default connect(null, mdp)(PrimaryNav);