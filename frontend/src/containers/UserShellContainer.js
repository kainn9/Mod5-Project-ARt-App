// imports
import React, { Component } from 'react';
import { activeStorageUrlConverter, usersRoute } from '../railsRoutes';
import PostPreview from '../components/PostPreview';
import { Segment, Header, Image, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
// end of imports ------------------------------------------------------

// class copment that handles rendering the post previews for a user
// I made it a class so I could extend from it when making UserLikesContainer
class UserShellContainer extends Component {

    state = {
        token: localStorage.getItem('artScopeJWT'),
        user: null,
    }
    headerChange = ''

    linkToLikesOrMain = () => (
        <Button color='orange'>view likes</Button>
    )
    // place holder for extended classes since Redux does not play nice
    isViewerFollowing = () => {
        return true;
    }
    // place holder for extended classes since Redux does not play nice
    isViewerUser = () => {
        return true;
    }
    // maps over provided users posts and creates PostPreview Components from the data
    renderPostPreviewsFromUserData = () => {
        return this.state.user.user.posts.map( postData => <PostPreview key={postData.id} data={postData} userID={this.props.userID} />)
    }
    
    // fetchs user based on provided user(router params)
    fetchUserData = () => {
        const fetchConfig = {
            method: 'GET', 
            headers: { Authorization: `Bearer ${this.state.token}` }
        }

        fetch(usersRoute + `/${this.props.userID}`, fetchConfig)
        .then( response => response.json() )
        // rerender upon getting user from resp
        .then( foundUser => this.setState({user: foundUser}) )
    }
    // fethc user on mount
    componentDidMount () {
        this.fetchUserData()
    }

    render() {
        return (
            <>
            {
                this.state.user ? (
                    <Segment inverted secondary style={{  width: '75%', margin: 'auto', textAlign: 'center' }}>
                        <Segment inverted>
                            <Header as='h2'>
                                <Image circular src={activeStorageUrlConverter(this.state.user.user.proPic.url)} />
                                {this.state.user.user.username}'s {this.headerChange}
                                <br></br>
                                <h3>Short Bio: {this.state.user.user.bio}</h3>
                                {
                                    this.isViewerUser() ? (
                                        <NavLink to={`/home/user/${this.state.user.user.id}/connections`}>
                                            <Button color='pink' style ={{ width: '50%' }} >My Followers/Following</Button>
                                        </NavLink>
                                        ) : (
                                        <>
                                        {
                                            this.headerChange === 'Page:' ? (
                                                <>
                                                    <NavLink to={`/home/user/${this.state.user.user.id}/liked`}>
                                                        <Button color='orange' style ={{ width: '50%' }} >View Likes</Button>
                                                    </NavLink>

                                                    <NavLink to={`/home/user/${this.state.user.user.id}/connections`}>
                                                        <Button color='pink' style ={{ width: '50%' }} >Followers/Following</Button>
                                                    </NavLink>
                                                </>
                                                
                                            ) :
                                            (
                                                <NavLink to={`/home/user/${this.state.user.user.id}`}>
                                                    <Button color='orange' style ={{ width: '50%' }} >View Collection</Button>
                                                </NavLink>
                                            )
                                        }
                                        
                                        <br></br>
                                            {this.isViewerFollowing() ? 
                                                (<Button color='red' onClick={this.followHandler} style ={{ width: '50%' }} >unfollow</Button>) 
                                            : 
                                                (<Button color='blue' onClick={this.followHandler} style ={{ width: '50%' }} >Follow</Button>)
                                            }
                                        </>
                                        
                                            
                                    )

                                }
                            </Header>
                        </Segment>
                        <Segment inverted style={{ display: 'grid', gridTemplateColumns: '25% 25% 25% 25%' }} >
                        
                            {this.renderPostPreviewsFromUserData()}
                            
                        </Segment>
                    </Segment>
    
                ) 
                : ( null )
            }
            </>
        )
    }
    
};

export default UserShellContainer;