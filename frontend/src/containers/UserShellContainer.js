// imports
import React, { Component } from 'react';
import { activeStorageUrlConverter, usersRoute } from '../railsRoutes';
import PostPreview from '../components/PostPreview';
import { Segment, Header, Image, Button } from 'semantic-ui-react';
import { NavLink, use} from 'react-router-dom';
import { postGrid, width75MarginAuto, width75MarginAutoCenterText } from '../bigStyle';
import { followersRoute } from '../railsRoutes';
// end of imports ------------------------------------------------------

// normally like to write all functional components but wanted to demonstratea little knowledge of also class based too
// I used UserShellContainer as a parent for UserLikedContainer and UserPostContainer since they are similair
// class based doesnt seem to play so nicely with redux
class UserShellContainer extends Component {

    // we store the jwt token in state for easy reach
    // user is defaulted to null but will update on fetch
    // redux updated logged user in props which is used to rerender page by updating logged user in react state- there is probably a better way to do this
    state = {
        token: localStorage.getItem('artScopeJWT'),
        user: null,
        loggedUser: this.props.loggedUser,
    }

    // checks if logged in user is following the previewed user
   isLoggedUserFollowingPreviewedUser = () => {
    const idsOfFollowing = this.props.loggedUser.isFollowing.map(user => user.id)
    return idsOfFollowing.includes(this.state.user.id)
}

// checks if the logged in user is the previewed user
isLoggedUserViewingSelf = () => this.props.loggedUser.id === this.state.user.id

followHandler = () => {
    const httpVerb = this.isViewerFollowing() ? 'DELETE' : 'POST';
    const fetchConfig = {
        method: `${httpVerb}`,
        headers: {
            Authorization: `Bearer ${this.state.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            following_id: this.props.viewingUser.user.id,
            followed_id: this.state.user.id
        })
    }

    fetch(followersRoute, fetchConfig)
    .then( response => response.json())
    .then(data => {
        this.props.updateFollowerState(this.state.user.id)

    })
    
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
        .then( foundUser => this.setState({user: foundUser.user}) )
    }
    // fetch user on mount
    componentDidMount () {
        this.fetchUserData()
    }

    // we need to track props and refetch the post when changed. The main prop that is actully being tracked is the postID from the router params
    // if we dont track the page will only update the url when history.pushing to a post from a post or a user to user, etc
    // if we dont have a condition to compare props this will fetch the user nonstop. This pattern will be resused with a useEffect() for functional components
    componentDidUpdate (prevProps) {
        if ( prevProps !== this.props ) this.fetchUserData()
    }

    render() {

        return (
            <>
                {
                    this.state.user ? (
                        <Segment inverted secondary style={width75MarginAutoCenterText}>
                            <Segment inverted>
                                <Header as='h2'>

                                    <Image circular src={activeStorageUrlConverter(this.state.user.proPic.url)} />
                                    {this.state.user.username}'s {this.headerChange}

                                    <br></br>

                                    <h3>Short Bio: {this.state.user.bio}</h3>

                                    {
                                        this.isLoggedUserViewingSelf() ? (

                                            <NavLink to={`/home/user/${this.state.user.id}/connections`}>
                                                <Button color='pink' style ={{ width: '50%' }} >My Followers/Following</Button>
                                            </NavLink>

                                            ) : (
                                            <>
                                            {
                                                this.headerChange === 'Page:' ? (
                                                    <>
                                                        <NavLink to={`/home/user/${this.state.user.id}/liked`}>
                                                            <Button color='orange' style ={{ width: '50%' }} >View Likes</Button>
                                                        </NavLink>

                                                        <NavLink to={`/home/user/${this.state.user.id}/connections`}>
                                                            <Button color='pink' style ={{ width: '50%' }} >Followers/Following</Button>
                                                        </NavLink>
                                                    </>
                                                    
                                                ) : (

                                                    <NavLink to={`/home/user/${this.state.user.id}`}>
                                                        <Button color='orange' style ={{ width: '50%' }} >View Collection</Button>
                                                    </NavLink>

                                                )
                                            }
                                            
                                                <br></br>
                                            
                                                {
                                                    this.isLoggedUserFollowingPreviewedUser() ? (
                                                        
                                                        <Button color='red' onClick={this.followHandler} style ={{ width: '50%' }} >unfollow</Button>

                                                    ) : (

                                                        <Button color='blue' onClick={this.followHandler} style ={{ width: '50%' }} >Follow</Button>

                                                    )
                                                }
                                            </>
                                            
                                                
                                        )

                                    }
                                </Header>
                            </Segment>

                            <Segment inverted style={postGrid} >
                            
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