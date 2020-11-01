import React, { useState } from 'react';
import FollowList from './FollowList';
import { Segment, Menu } from 'semantic-ui-react';


const UserConnections = (props) => {
    
    
    const [activeTab, setActiveTab] = useState('following');

    return(
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
    );
};


export default UserConnections;