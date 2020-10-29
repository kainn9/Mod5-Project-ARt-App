// imports
import React, { useState, useEffect } from 'react';
import { activeStorageUrlConverter ,usersRoute } from '../railsRoutes';
import PostPreview from '../components/PostPreview';
import { Segment, Header, Image } from 'semantic-ui-react';
// end of imports ------------------------------------------------------


const UserLikedContainer = (props) => {
    // auth token
    const artScopeJWT = localStorage.getItem('artScopeJWT');
    // state for current user show page
    const [viewingUser, setViewingUser] = useState(null);

    //creates post previews JSX
    const renderPostPreviewsFromUserData = () => (
        viewingUser.user.posts.map( postData => <PostPreview key={postData.id} data={postData} userID={props.userID} />)
    )

    

    // fetches user and saves to state for render
    const fetchUserData = () => {

        const fetchConfig = {
            method: 'GET', 
            headers: { Authorization: `Bearer ${artScopeJWT}` }
        }

        fetch(usersRoute + `/${props.userID}`, fetchConfig)
        .then( response => response.json() )
        .then( foundUser => setViewingUser(foundUser) )
    }
    // runs when component mounts -> fetches user triggering rerender on state change
    useEffect(() => {

        fetchUserData()

    }, []) 
    

    return (
        <>
        {
            viewingUser ? (
                <Segment inverted secondary style={{  width: '75%', margin: 'auto', textAlign: 'center' }}>
                    <Header as='h2'>
                        
                        <Image circular src='https://react.semantic-ui.com/images/avatar/large/patrick.png' />
                        {viewingUser.user.username}'s Page:
                        {console.log(viewingUser)}
                    </Header>
                    <Segment inverted style={{ display: 'grid', gridTemplateColumns: '25% 25% 25% 25%', border: '2px dashed rgba(114, 186, 94, 0.35)' }} >
                    
                        {renderPostPreviewsFromUserData()}
                    </Segment>
                </Segment>

            ) 
            : ( null )
        }
        </>
    )
};

export default UserLikedContainer;