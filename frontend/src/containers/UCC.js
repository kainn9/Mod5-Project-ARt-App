import React, { useState } from 'react';
import FollowList from '../components/FollowList';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Menu, Button } from 'semantic-ui-react';


const UserConnectionsContainer = (props) => {
    
    
    const [activeTab, setActiveTab] = useState('following');

    return(
        <>
            <div id='wrapper' style={{ textAlign: 'center' }}> 
            {/* <div> */}
                <NavLink to={`/home/user/${props.loggedUser.id}/connections`} >

                    <Button 
                        color='pink' 
                        style={{ width: '37.5%', margin: 'auto' }} 
                    > 
                        My Followers/Following
                    </Button>

                </NavLink>

                <NavLink to={`/home/user/${props.userID}`} >

                    <Button 
                        color='orange' 
                        style={{ width: '37.5%', margin: 'auto' }}
                    >
                        Back to Collection
                    </Button>

                </NavLink>
            {/* </div> */}
            </div>  
            <Segment inverted secondary style={{ margin: 'auto', width: '75%' }}>

                <Menu attached='top' tabular  inverted>
                    <Menu.Item
                        name='following'
                        active={activeTab === 'following'}
                        onClick={ (e, { name }) => setActiveTab(name) }
                        style={{ width: '50%'}}
                    />
                    
                    <Menu.Item
                        name='followers'
                        active={activeTab === 'followers'}
                        onClick={ (e, { name }) => setActiveTab(name) }
                        style={{ width: '50%'}}
                    />
                </Menu>

            {
                activeTab === 'following' ? (
                    <FollowList relationship='isFollowing' userID={props.userID} />
                ) : (
                    <FollowList relationship='isFollowedBy' userID={props.userID} />
                )
            }

            </Segment>
        </>
    );
};

const msp = state => ({ loggedUser: state.user.user })
export default connect(msp, null)(UserConnectionsContainer);