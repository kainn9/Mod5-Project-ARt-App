import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Segment, Card, Image, Header, Button, Icon, Label } from 'semantic-ui-react';
import { activeStorageUrlConverter, feedRoute, likedPostsRoute } from '../railsRoutes';
import { updateUserLikes } from '../redux/actions';


const UserFeed = (props) => {

    // auth token
    const artScopeJWT = localStorage.getItem('artScopeJWT');

    // state for feed
    const [feed, setFeed] = useState(null);

    // state for likes
    const [loggedUserLikes, setLoggedUserLikes] = useState( props.loggedUser.likedPosts.map( p => p.id ) );

    // state for like count -> array maps to posts...got lazy could of also made components out of the previews that held their own state
    const [likeCounter, setLikeCounter] = useState([]);

    // returns bool if logged user has liked post
    const hasLoggedUserLiked = (postID) => {
        return loggedUserLikes.includes(postID);
    }

    // handles updating server/state upon clicking a like/unlike button
    // note: Im using this function/ similair modified a lot in different components would be nice to make a single verions for all at somepoint
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
                let likeCounterClone = [...likeCounter];
                likeCounterClone[index] += 1
                setLikeCounter(likeCounterClone)

            } else if (json.message === 'deleted') {
                props.updateCurrentUserLikes(postID)
                setLoggedUserLikes(props.loggedUser.likedPosts.map( p => p.id ))
                
                const index = parseInt(e.target.parentElement.attributes[0].value);
                let likeCounterClone = [...likeCounter];
                likeCounterClone[index] -= 1
                setLikeCounter(likeCounterClone)
                
            }
        })
     
        
    
    }

    // renders previews from feed
    const renderPostPreviews = (postsData) => {

        return postsData.map( (post, i) => (
            <>
                <Card style= {{ margin: 'auto', width: '70%', textAlign: 'center' }} >
                
                    <NavLink to={`/home/post/${post.id}`}>
                        <Segment inverted style= {{ margin: 'auto', textAlign: 'center', width: '100%' }}>
                            <img src={activeStorageUrlConverter(post.featured_image.url)}  style={{ width: '100%', height: '35vh', objectFit: 'scale-down'}} />
                        </Segment>
                    </NavLink>

                    <Card.Content>
                        <Card.Header>{post.title}</Card.Header>
                        <Card.Meta>{post.body}</Card.Meta>
                        {
                            hasLoggedUserLiked(post.id) ? (
                                <Button as='div' labelPosition='right'style={{ width: '100%'}}  onClick={ (e) => likePost(post.id, e)} code={i} >
                                    <Button color='black'  style={{ width: '100%'}}>
                                        <Icon name='heart' />
                                            Unlike
                                    </Button>
                                    <Label as='a' basic color='red' pointing='left'>
                                        {likeCounter[i]}
                                    </Label>
                                 </Button>
                            ) : (
                                <Button as='div' labelPosition='right'style={{ width: '100%'}} onClick={ (e) => likePost(post.id, e)} code={i} >
                                    <Button color='red'  style={{ width: '100%'}}>
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
            </>
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
            style ={{
                display: 'block',
                width: '75%',
                margin: 'auto',
                minHeight: '100vh',
                height: 'fit',
                
            }}
        >

        {
            feed ? (
                renderPostPreviews(feed)
            ) : (
                null
            )
        }
            
        </Segment>
    );
}

const msp = state => ({ loggedUser: state.user.user });

const mdp = dispatch => ({ updateCurrentUserLikes: (newLikeID) => dispatch(updateUserLikes(newLikeID)) });

export default connect(msp, mdp)(UserFeed);