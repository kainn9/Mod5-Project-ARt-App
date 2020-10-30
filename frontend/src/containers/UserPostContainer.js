// imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostPreview from '../components/PostPreview';
import { Button } from 'semantic-ui-react';
import UserShellContainer from './UserShellContainer';
// end of imports ------------------------------------------------------

// class copment that handles rendering the post previews for a user
// I made it a class so I could extend from it when making UserLikesContainer
class UserPostContainer extends UserShellContainer {
    

    headerChange = 'Page:'

    linkToLikesOrMain = () => (
        <Button color='orange'>view likes</Button>
    )
    // place holder for extended classes since Redux does not play nice
    isViewerFollowing = () => {
        return true;
    }
    // place holder for extended classes since Redux does not play nice
    isViewerUser = () => this.props.viewingUser.user.id === this.state.user.user.id
    
    // maps over provided users posts and creates PostPreview Components from the data
    renderPostPreviewsFromUserData = () => {
        return this.state.user.user.posts.map( postData => <PostPreview key={postData.id} data={postData} userID={this.props.userID} />)
    }
};
const msp = state => ({ viewingUser: state.user })

export default connect(msp, null)(UserPostContainer);