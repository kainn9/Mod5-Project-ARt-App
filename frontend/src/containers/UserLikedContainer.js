// imports
import React, { useState, useEffect } from 'react';
import { usersRoute } from '../railsRoutes';
import PostPreview from '../components/PostPreview';
import UserPostContainer from './UserPostContainer';
import { Segment, Header, Image } from 'semantic-ui-react';

// end of imports ------------------------------------------------------

// same as user posts but filters base likes also
class UserLikedContainer extends UserPostContainer {
    headerChange = 'Likes:'
    // maps over provided users liked posts and creates PostPreview Components from the data
    renderPostPreviewsFromUserData = () => {
        console.log(this.state.user.user.likedPosts)
        return this.state.user.user.likedPosts.map( postData => <PostPreview key={postData.id} data={postData} userID={this.props.userID} />)
    }

}


export default UserLikedContainer;