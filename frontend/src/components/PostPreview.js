//imports
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { likedPostsRoute } from '../railsRoutes';


import { activeStorageUrlConverter } from '../railsRoutes';
import canvasTexture from '../images/canvas.jpg'

import { Card, Icon } from 'semantic-ui-react';
// end of imports -------------------------------------------------------

// renders a card with a img preview, handles liking/unlking and navlinks to post show page onclick
const PostPreview = (props) => {

    // auth token
    const artScopeJWT = localStorage.getItem('artScopeJWT');

    // these in state so we can update render pessimistically without a full refresh after fetches
    const [likedPosts, setLikedPosts] = useState(props.user.user.likedPosts)
    const [likedPostsCounter, setLikedPostsCounter] = useState(props.data.subs.length)

    
    // checks if we have liked this post or not
    const hasUserLikedPost = () => {
        let liked = false;

        likedPosts.forEach( post => {
            if (post.id === props.data.id) liked = true;
        })

        return liked;
    }

    // creates or destroys liked relationship in backend components should update
    const likePost = e => {
        // disables the outer NavLink
        e.preventDefault();

        const httpVerb = hasUserLikedPost() ? 'DELETE' : 'POST'
        const fetchConfig = {
            method: `${httpVerb}`, 
            headers: { 
                Authorization: `Bearer ${artScopeJWT}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: props.user.user.id, post_id: props.data.id })
        }

        fetch(likedPostsRoute, fetchConfig)
        .then( response => response.json() )
        .then(json => {
            
            //updating render by manipulating hooks.state based on callback of like/unlike fetch
            if (json.message === 'created') {
                
                setLikedPosts(current => [...current, {id: props.data.id} ])
                setLikedPostsCounter(current => current + 1 )

            } else if (json.message === 'deleted') {

                setLikedPostsCounter(current => current - 1 )
                setLikedPosts(current => {
                    let newLikes = [...current.filter(like => like.id !== props.data.id)]
                    return newLikes;
                })
            }
        })

    }

    return(
        <div>
            {console.log('msp', props.data)}
            <NavLink to={`/home/post/${props.data.id}`}>
                <Card style={{ height: '25vh', marginTop: 0 }} onClick={ () => null } >
                    <img src={activeStorageUrlConverter(props.data.img)} wrapped ui={false} style={{ height: '50%', objectFit: 'scale-down', backgroundImage: `url(${canvasTexture})`}}/>
                    <Card.Content>
                        <Card.Header>{props.data.title}</Card.Header>
                    </Card.Content>
                    <Card.Content extra onClick ={ e => likePost(e) } >

                        { !hasUserLikedPost() ? <Icon name='heart' /> : <Icon color='red' name='heart' /> }

                        {`Likes ${likedPostsCounter}`}
                    </Card.Content>
                </Card>
            </NavLink>
       
        </div>
    )
}

const msp = state => ({ user: state.user })
export default connect(msp, null)(PostPreview);