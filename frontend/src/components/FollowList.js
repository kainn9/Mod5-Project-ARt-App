
// imports
import React, {useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { usersRoute } from '../railsRoutes';
import { Card, Segment }  from 'semantic-ui-react';
// end of imports --------------------------------------------------

const FollowList = (props) => {

    const artScopeJWT = localStorage.getItem('artScopeJWT');
    const [pageUser, setPageUser] = useState(null);

    const renderCardsFromUserData = (user) => {
        console.log('eek', user.user.id, props.loggedUser.id )
        const listOfIds = user.user[props.relationship].map(user => user.id)
        
        return user.user[props.relationship].map(nestedUser => 
            (  
                <NavLink to={ `/home/user/${nestedUser.id}` } >
                    <Segment inverted>
                        <Card
                        //image='/images/avatar/large/elliot.jpg'
                        header={nestedUser.username}
                        meta={ listOfIds.includes(props.loggedUser.id) ? nestedUser.id === props.loggedUser.id ? 'This is you' : 'Follows You' : nestedUser.id === props.loggedUser.id ? 'This is you' : 'Does Not Follow You' }
                        description='add user bio'
                        //extra={extra}
                        style ={{ width: '100%'}}
                        />
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
        .then(user => setPageUser(user))
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