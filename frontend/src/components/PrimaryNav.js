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
        width: '75%', 
        margin: 'auto', 
        textAlign: 'center',
      }}
      >
        <Segment raised inverted >
          <Menu raised inverted color={'black'} icon='labeled'>
              <NavLink 
                to='/home' 
                style={{ width: '25%' }}
              >
                <Menu.Item name='home' >
                    <Icon name='home' />
                    Home
                </Menu.Item>
              </NavLink>

              <NavLink 
                to='/home/create-post' 
                style ={{ width: '25%' }}
              >
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

const mdp = dispatch => ({logoutUser: test => dispatch({ type: 'logoutUser' }) })

export default connect(null, mdp)(PrimaryNav);