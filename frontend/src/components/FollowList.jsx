import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, Segment, Button } from 'semantic-ui-react';
import { activeStorageUrlConverter, usersRoute, followersRoute } from '../railsRoutes';
import { updateFollows } from '../redux/actions';

import {
  width75MarginAuto,
  followerCardImg,
} from '../bigStyle';

const FollowList = (props) => {
  // auth token
  const artScopeJWT = localStorage.getItem('artScopeJWT');
  const [previewedUser, setPreviewedUser] = useState(null);

  // state to update logged user following list
  const [loggedUserIsFollowingList, setLoggedUserIsFollowingList] = useState(props.loggedUser.isFollowing);

  // handles following/unfollowing button
  // updates backend then updates front end on callback
  const followHandler = (ID) => {
    const httpVerb = doesLoggedUserFollowPreviewedUser(ID) ? 'DELETE' : 'POST';

    const fetchConfig = {
      method: `${httpVerb}`,
      headers: {
        Authorization: `Bearer ${artScopeJWT}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        following_id: props.loggedUser.id,
        followed_id: ID,
      }),
    };

    fetch(followersRoute, fetchConfig)
      .then((response) => response.json())
      .then((data) => {
        props.updateFollowerState(ID);
        setLoggedUserIsFollowingList(props.loggedUser.isFollowing);
      });
  };

  // helper method returns if previewed user follows logged in user
  const doesPreivewedUserFollowLoggedUser = (previewedUser) => {
    const followedByIds = props.loggedUser.isFollowedBy.map((user) => user.id);
    return followedByIds.includes(previewedUser);
  };

  // helper method returns if previewed user is followed by logged in user
  const doesLoggedUserFollowPreviewedUser = (previewedUser) => {
    const followingIds = loggedUserIsFollowingList.map((user) => user.id);
    return followingIds.includes(previewedUser);
  };

  // renders JSX cards/previews for each follower/following relationship to the user argument
  const renderCardsFromUserData = (user) => user[props.relationship].map((nestedUser) => (
    <NavLink to={`/home/user/${nestedUser.id}`}>
      <Segment inverted>

        <Card style={width75MarginAuto}>
          <img
            src={activeStorageUrlConverter(nestedUser.proPic)}
            wrapped
            ui={false}
            style={followerCardImg}
          />
          <Card.Content>
            <Card.Header>
              {nestedUser.username}
            </Card.Header>
            <Card.Meta>
              {doesPreivewedUserFollowLoggedUser(nestedUser.id) ? (
                nestedUser.id === props.loggedUser.id ? 'This is you' : 'Follows You'
              ) : (
                nestedUser.id === props.loggedUser.id ? (
                  'This is you'
                ) : (
                  'Does Not Follow You'
                )
              )}

              <br />

              {doesLoggedUserFollowPreviewedUser(nestedUser.id) ? (
                'You are Following'
              ) : (
                nestedUser.id === props.loggedUser.id ? (
                  null
                ) : (
                  'You are not Following'
                )
              )}
            </Card.Meta>
            <Card.Description>

              <b>Short Bio:</b>

              <br />

              {nestedUser.bio}

              <br />
              {doesLoggedUserFollowPreviewedUser(nestedUser.id) ? (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    followHandler(nestedUser.id);
                  }}
                >
                  Unfollow
                </Button>

              ) : (
                props.loggedUser.id === nestedUser.id ? (
                  null
                ) : (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      followHandler(nestedUser.id);
                    }}
                  >
                    Follow
                  </Button>
                )
              )}
            </Card.Description>
          </Card.Content>
        </Card>
      </Segment>
    </NavLink>
  ));

  // fetches the previewed user(this can be the logged user) the followList renders the previewedUsers relationships
  const fetchUser = () => {
    const fetchConfig = {
      method: 'GET',
      headers: { Authorization: `Bearer ${artScopeJWT}` },

    };

    fetch(usersRoute + props.userID, fetchConfig)
      .then((response) => response.json())
      .then((user) => {
        setPreviewedUser(user.user);
        props.setPreviewedUserData({
          username: user.user.username, img: user.user.proPic,
        });
      });
  };

  // useEffect keeps our state in sync with the backend so previews/buttons/captions are accurate for the following/follower user relationships
  // refetch when the logged user follower/followed relationships change and also when the previewedUserID changes(from props.userID)
  useEffect(() => {
    fetchUser();
  }, [props.userID, loggedUserIsFollowingList]);

  return (
    <>
      {previewedUser ? (
        renderCardsFromUserData(previewedUser)
      ) : (
        null
      )}
    </>
  );
};

const msp = (state) => ({ loggedUser: state.user.user });

const mdp = (dispatch) => ({
  updateFollowerState: (id) => dispatch(updateFollows(id)),
});

export default connect(msp, mdp)(FollowList);
