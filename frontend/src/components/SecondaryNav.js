// imports
import React from 'react';
import { NavLink } from 'react-router-dom';

import { Segment, Icon, Menu } from 'semantic-ui-react';
import ss from '../images/sskain.png';
import skyCastleImg from '../images/skyCastle.png';
// end of imports-----------------------------------------


const SecondaryNav = () => {

    return(
    <div 
    style={{ 
      backgroundImage: `url(${skyCastleImg})`,
      backgroundRepeat: 'repeat-y',
      height: 'fit',
      minHeight: '100%',

    }}>
      
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
        
          <Segment inverted raised secondary >
            <h2
                style={{ 
                  'fontFamily': 'funSized',
                  'fontSize': '45px'
                
                }}
              > 
                Welcome to Art Scope,  <br />Login/Sign-up above 
              </h2>
          </Segment>
          
        
          <img 
            alt= 'Wolf and forest with pixel village backround'
            src={ss}  
            style={{
              width: '100%',
              'maxHeight': '60%'
            }}
          />
          <h4
            style={{ 
              bottom: '15%',
              position: 'relative',
              fontFamily: 'funSized',
              fontSize: '35px'
            
            }}
          >Explore Samples Below...</h4>
          
      
        </Segment>
      </div>
    </div>
    
    );
};

export default SecondaryNav;