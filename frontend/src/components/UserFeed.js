import React from 'react';
import { Segment } from 'semantic-ui-react';


const UserFeed = () => {
    return(
        <Segment
            secondary
            inverted
            id='mainStrip'
            style ={{
                width: '75%',
                margin: 'auto',
                minHeight: '100vh',
                height: 'fit'
            }}
        >
        </Segment>
    );
}

export default UserFeed;