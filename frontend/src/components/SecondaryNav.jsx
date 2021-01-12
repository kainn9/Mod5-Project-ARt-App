
import React from 'react';

import { NavLink } from 'react-router-dom';

import { Segment, Icon, Menu } from 'semantic-ui-react';

import hiro from '../images/hiro.png';
import skyCastleImg from '../images/skyCastle.png';

import {
  secondaryNavSeg,
  maxWidthMinHeight60,
  secondaryNavHeader,
  secondaryNavSmallHeader,

} from '../bigStyle';


// nav for logged out users
const SecondaryNav = () => {

  return(
    <div 
      style={{ 
        backgroundImage: `url(${ skyCastleImg })`,
        backgroundRepeat: 'repeat', 
        height: 'fit', 
        minHeight: '100%' 
      }} 
    >
      
    <div style={secondaryNavSeg} >

      <Segment inverted >

        <Menu 
          inverted 
          color="black" 
          icon='labeled'
        >

          <NavLink 
            to="/login"
            style={{width: '50%'}} 
          >
            <Menu.Item name="login" >
              <Icon name="id badge" />
              Login
            </Menu.Item>
          </NavLink>

          <NavLink 
            to="/signup" 
            style={{width: '50%'}} 
          >
            <Menu.Item name="sign-up">
              <Icon name="user secret" />
              Sign-Up
            </Menu.Item>
          </NavLink>

        </Menu>
        
        <Segment inverted secondary >
          <h2 style={secondaryNavHeader} > 
            Welcome to ARt App,  
            <br />
            Login/Sign-up above 
          </h2>
        </Segment>
          
        
          <img 
            alt= "hiro symbol for ar"
            src={hiro}  
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