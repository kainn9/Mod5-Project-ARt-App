// imports:
import React from 'react';

import { NavLink } from 'react-router-dom';

import { Segment, Icon, Menu } from 'semantic-ui-react';

import ss from '../images/sskain.png';
import skyCastleImg from '../images/skyCastle.png';

import {
  secondaryNavSeg,
  maxWidthMinHeight60,
  secondaryNavHeader,
  secondaryNavSmallHeader,

} from '../bigStyle';
// end of imports-----------------------------------------

// nav for logged out users
const SecondaryNav = () => {

  return(
    <div style={{ backgroundImage: `url(${ skyCastleImg })`, backgroundRepeat: 'repeat', height: 'fit', minHeight: '100%' }} >
      
    <div style={secondaryNavSeg} >

      <Segment raised inverted >

        <Menu raised inverted color={'black'} icon='labeled'>

          <NavLink to='/login' style={{ width: '50%' }} >
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
        
        <Segment inverted raised secondary >
          <h2 style={secondaryNavHeader} > 
            Welcome to Art Scope,  <br />Login/Sign-up above 
          </h2>
        </Segment>
          
        
          <img 
            alt= 'hiro symbol for ar'
            src={ ss }  
            style={maxWidthMinHeight60}
          />
          
          <h4 style={secondaryNavSmallHeader} >
            Use This Hiro Symbol For AR!
          </h4>
          
        </Segment>
      </div>

    </div>
    
  );
};

export default SecondaryNav;