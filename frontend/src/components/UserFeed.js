// imports
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Segment, Card, Image, Header, Button, Icon, Label, Dimmer, Loader } from 'semantic-ui-react';
import { activeStorageUrlConverter, feedRoute, likedPostsRoute } from '../railsRoutes';
import { updateUserLikes } from '../redux/actions';

import {
    width75MarginAutoCenterText,
    widthMaxMarginAutoCenterText,
    feedImage,
    widthIs100,
    mainStrip,


} from '../bigStyle';

// end of imports ----------------------------------------------------------------------

const UserFeed = (props) => {

    // auth token
    const artScopeJWT = localStorage.getItem('artScopeJWT');

    // state for feed
    const [feed, setFeed] = useState(null);

    // state for likes
    const [loggedUserLikes, setLoggedUserLikes] = useState( props.loggedUser.likedPosts.map( p => p.id ) );

    // state for like count -> array maps to posts...got lazy could of also made components out of the previews that held their own state
    const [likeCounter, setLikeCounter] = useState({});

    // returns bool if logged user has liked post
    const hasLoggedUserLiked = (postID) => {
        return loggedUserLikes.includes(postID);
    }

    // handles updating server/state upon clicking a like/unlike button
    const likePost = (postID, e) => {

        const httpVerb = hasLoggedUserLiked(postID) ? 'DELETE' : 'POST'
        const fetchConfig = {
            method: `${httpVerb}`, 
            headers: { 
                Authorization: `Bearer ${artScopeJWT}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: props.loggedUser.id, post_id: postID })
        }

        fetch(likedPostsRoute, fetchConfig)
        .then( response => response.json() )
        .then(json => {
            
            //updating render, props.upateCurrentUserLikes is a redux action and maintains that state in store likeCounter is local state
            if (json.message === 'created') {
                
                props.updateCurrentUserLikes(postID)
                setLoggedUserLikes(props.loggedUser.likedPosts.map( p => p.id ))

                const index = parseInt(e.target.parentElement.attributes[0].value);
                let likeCounterClone = {...likeCounter};
                likeCounterClone[index] += 1
                setLikeCounter(likeCounterClone)

            } else if (json.message === 'deleted') {
                props.updateCurrentUserLikes(postID)
                setLoggedUserLikes(props.loggedUser.likedPosts.map( p => p.id ))
                
                const index = parseInt(e.target.parentElement.attributes[0].value);
                let likeCounterClone = {...likeCounter};
                likeCounterClone[index] -= 1
                setLikeCounter(likeCounterClone)
                
            }
        })
     
        
    
    }

    // renders previews from feed...normally my pattern would be to map out a new component for each index of postsData while passing in postsData through to the props
    // of the new component, you could then have each preview component track its own state for user likes(locally or through redux msp)
    // I wanted to try and use an object for the useState() hook and track the state of multiple elements on the page with 1 hook(normally I do like one useState for some small bit of state)
    // I ended up using the map index to create keys for each post(stored on the dom as code attr) and would use e.target to grab the code and pass it as the key...im not really sure how I feel about this pattern to be honest
    const renderPostPreviews = (postsData) => {

        return postsData.map( (post, i) => (
            <div key={post.id}>
                <Card style= {width75MarginAutoCenterText}  >
                
                    <NavLink to={`/home/post/${post.id}`}>
                        <Segment inverted style= {widthMaxMarginAutoCenterText}>
                            <img src={activeStorageUrlConverter(post.featured_image.url)}  style={feedImage} />
                        </Segment>
                    </NavLink>

                    <Card.Content>
                        <Card.Header>{post.title}</Card.Header>
                        <Card.Meta>{post.body}</Card.Meta>
                        {
                            hasLoggedUserLiked(post.id) ? (
                                <Button as='div' labelPosition='right' onClick={ (e) => likePost(post.id, e)} code={i} style={widthIs100}>
                                    <Button color='black'  style={widthIs100}>
                                        <Icon name='heart' />
                                            Unlike
                                    </Button>
                                    <Label as='a' basic color='red' pointing='left'>
                                        {likeCounter[i]}
                                    </Label>
                                 </Button>
                            ) : (
                                <Button as='div' labelPosition='right'style={widthIs100} onClick={ (e) => likePost(post.id, e)} code={i} >
                                    <Button color='red'  style={widthIs100}>
                                        <Icon name='heart' />
                                            like
                                    </Button>
                                    <Label as='a' basic color='red' pointing='left'>
                                        {likeCounter[i]}
                                    </Label>
                                 </Button>
                            )
                        }
                        
                    
                    </Card.Content>
                    
                    <Card.Content extra>
                        <NavLink to={`/home/user/${post.filteredUser.id}`}>
                            <Header as='h3'>
                                <Image circular src={ activeStorageUrlConverter(post.filteredUser.proPic) } />
                                <br></br>
                                Post By {post.filteredUser.username}
                            </Header>
                        </NavLink>
                    </Card.Content>
                    
                </Card>
                <br></br>
            </div>
        ))
    }

    // gets feed from rails api calls sets feed state
    const fetchFeed = () => {

        const fetchConfig = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${artScopeJWT}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: props.loggedUser.id})
        }

        fetch(feedRoute, fetchConfig)
        .then( response => response.json() )
        .then( feed => {
            setFeed(feed)
            setLikeCounter(feed.map( p => (p.suscribedUsers.length) ) )
        })
 
    }
    // calls fetch on mount
    useEffect(() => {
        fetchFeed()
    }, []);

    return(
        <Segment
            secondary
            inverted
            id='mainStrip'
            style ={mainStrip}
        >

        {
            feed ? (
                renderPostPreviews(feed)
            ) : (
                
                <Segment style={{ height: '30vh'}}>
                  <Dimmer active>
                    <Loader content='Loading' />
                  </Dimmer>
            
                </Segment>

            )
        }
            
        </Segment>
    );
}

const msp = state => ({ loggedUser: state.user.user });

const mdp = dispatch => ({ updateCurrentUserLikes: (newLikeID) => dispatch(updateUserLikes(newLikeID)) });

export default connect(msp, mdp)(UserFeed);