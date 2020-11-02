
// imports
import React, {useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { activeStorageUrlConverter, usersRoute } from '../railsRoutes';
import { Card, Segment, Image, Icon }  from 'semantic-ui-react';
// end of imports --------------------------------------------------

const FollowList = (props) => {

    const artScopeJWT = localStorage.getItem('artScopeJWT');
    const [pageUser, setPageUser] = useState(null);

    const renderCardsFromUserData = (user) => {
        console.log('eek', user.user.id, props.loggedUser.id )

        const listOfIds = user.user.isFollowing.map(user => user.id)
        
        return user.user[props.relationship].map(nestedUser => 
            (  
            
                <NavLink to={ `/home/user/${nestedUser.id}` } >
                    <Segment inverted style={{ height: 'fit', width: 'fit'}}>
                        {/* <Card
                        image={activeStorageUrlConverter(nestedUser.proPic)}
                        header={nestedUser.username}
                        meta={ listOfIds.includes(props.loggedUser.id) ? nestedUser.id === props.loggedUser.id ? 'This is you' : 'Follows You' : nestedUser.id === props.loggedUser.id ? 'This is you' : 'Does Not Follow You' }
                        description='add user bio'
                        extra={extra}
                        style ={{ height: '20vh',  margin: 'auto' }}
                        >
                        <Image src={activeStorageUrlConverter(nestedUser.proPic)} />
                        <Card.Header>
                            {nestedUser.username}
                        </Card.Header>
                        </Card> */}


                        <Card style={{ margin: 'auto' }}>
                            <img src={activeStorageUrlConverter(nestedUser.proPic)} wrapped ui={false}  style={{ height: '20vh', objectFit: 'scale-down' }} />
                            <Card.Content>
                            <Card.Header>{nestedUser.username}</Card.Header>
                            <Card.Meta>
                                {listOfIds.includes(props.loggedUser.id) ? nestedUser.id === props.loggedUser.id ? 'This is you' : 'Follows You' : nestedUser.id === props.loggedUser.id ? 'This is you' : 'Does Not Follow You'}
                                <br></br>
                                {console.log('logged', props.loggedUser)}
                                {props.loggedUser.isFollowing.map(u => u.id).includes(nestedUser.id) ? 'You are Following' : nestedUser.id === props.loggedUser.id ? null : 'You are not Following'}
                            </Card.Meta>
                            <Card.Description>
                                <b>Short Bio:</b>
                                <br></br>
                                { nestedUser.bio }
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
    }, [])

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

export default connect(msp, null)(FollowList);