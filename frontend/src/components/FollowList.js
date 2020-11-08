
// imports
import React, {useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { activeStorageUrlConverter, usersRoute, followersRoute } from '../railsRoutes';
import { Card, Segment, Image, Icon, Button }  from 'semantic-ui-react';
import { updateFollows } from '../redux/actions';

import { 
    width75MarginAuto, 
    followerCardImg 
} from '../bigStyle';
// end of imports --------------------------------------------------

const FollowList = (props) => {

    const artScopeJWT = localStorage.getItem('artScopeJWT');
    const [pageUser, setPageUser] = useState(null);
    const [loggedUserFollowingArray, setLoggedUserFollowingArray] = useState(props.loggedUser.isFollowing);
    const [loggedUserFollowedArray, setLoggedUserFollowedArray] = useState(props.loggedUser.isFollowedBy);

    const followHandler = (ID) => {
        const httpVerb = doesLoggedUserFollowPreviewedUser(ID) ? 'DELETE' : 'POST';
        const fetchConfig = {
            method: `${httpVerb}`,
            headers: {
                Authorization: `Bearer ${artScopeJWT}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                following_id: props.loggedUser.id,
                followed_id: ID
            })
        }

        fetch(followersRoute, fetchConfig)
        .then( response => response.json())
        .then(data => {
            props.updateFollowerState(ID)
            setLoggedUserFollowingArray(props.loggedUser.isFollowing)
        })
        
    }

    const doesPreivewedUserFollowLoggedUser = (previewedUser) => {
        const followedByIds = loggedUserFollowedArray.map(user => user.id)

        return followedByIds.includes(previewedUser)
    }

    const doesLoggedUserFollowPreviewedUser = (previewedUser) => {
        const followingIds = loggedUserFollowingArray.map(user => user.id)

        return followingIds.includes(previewedUser)
    }

    const renderCardsFromUserData = (user) => {

        
        return user.user[props.relationship].map(nestedUser => 
            (  
            
                <NavLink to={ `/home/user/${nestedUser.id}` } >
                    <Segment inverted>
                        
                        <Card style={width75MarginAuto}>
                            <img src={activeStorageUrlConverter(nestedUser.proPic)} wrapped ui={false}  style={followerCardImg} />
                            <Card.Content>
                            <Card.Header>{nestedUser.username}</Card.Header>
                            <Card.Meta>
                                {doesPreivewedUserFollowLoggedUser(nestedUser.id) ? nestedUser.id === props.loggedUser.id ? 'This is you' : 'Follows You' : nestedUser.id === props.loggedUser.id ? 'This is you' : 'Does Not Follow You'}
                                <br></br>
                                {console.log('logged', props.loggedUser)}
                                {doesLoggedUserFollowPreviewedUser(nestedUser.id) ? 'You are Following' : nestedUser.id === props.loggedUser.id ? null : 'You are not Following'}
                            </Card.Meta>
                            <Card.Description>
                                <b>Short Bio:</b>
                                <br></br>
                                { nestedUser.bio }
                                <br></br>
                                {
                                    doesLoggedUserFollowPreviewedUser(nestedUser.id) ? (
                                        <Button 
                                            onClick={ e => {
                                                e.preventDefault()
                                                followHandler(nestedUser.id)
                                            }}
                                        >
                                            Unfollow
                                        </Button>   

                                    ) : props.loggedUser.id === nestedUser.id ? null : (
                                        <Button
                                        onClick={ e => {
                                            e.preventDefault()
                                            followHandler(nestedUser.id)
                                            }}
                                        >
                                            Follow
                                        </Button>
                                    )
                                } 
                            </Card.Description>
                            </Card.Content>
                        </Card>
                    </Segment>
                </NavLink>
        
        
            )
        )
    }

    const fetchUser = () => {

        const fetchConfig = {
            method: 'GET',
            headers: { Authorization:`Bearer ${artScopeJWT}` }

        }

        fetch(usersRoute + props.userID, fetchConfig)
        .then( response => response.json())
        .then(user => {
            setPageUser(user)
            props.setPageUserData({username: user.user.username, img: user.user.proPic})
        })
    }  

    useEffect(() => {
        fetchUser()
    }, [loggedUserFollowingArray, props.userID])

    return (
        <>
            {
                pageUser ? (
                    renderCardsFromUserData(pageUser)
                ) : null
            }
        </>
    )
}

const msp = state =>  ({ loggedUser: state.user.user })

const mdp = dispatch => ({updateFollowerState: (id) => dispatch(updateFollows(id)) });

export default connect(msp, mdp)(FollowList);