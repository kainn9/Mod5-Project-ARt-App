import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  Segment, Card, Image, Header, Button, Icon, Label, Dimmer, Loader,
} from 'semantic-ui-react';
import { activeStorageUrlConverter, feedRoute, likedPostsRoute } from '../railsRoutes';
import { updateUserLikes } from '../redux/actions';

import {
  width75MarginAutoCenterText,
  widthMaxMarginAutoCenterText,
  feedImage,
  widthIs100,
  mainStrip,
} from '../bigStyle';

function UserFeed(props) {
  UserFeed.propTypes = {
    updateCurrentUserLikes: PropTypes.func,
    loggedUser: {
      id: PropTypes.number,
      likedPosts: PropTypes.array,
    },
  };

  UserFeed.defaultProps = {
    updateCurrentUserLikes: null,
    loggedUser: null,
  };

  const {
    loggedUser: {
      likedPosts,
    },
  } = props;

  // auth token
  const artScopeJWT = localStorage.getItem('artScopeJWT');

  // state for feed
  const [feed, setFeed] = useState(null);

  // state for likes
  const [loggedUserLikes, setLoggedUserLikes] = useState(likedPosts.map((p) => p.id));

  // state map for number of likes on the posts in the feed
  const [likeCounter, setLikeCounter] = useState({});

  // returns bool if logged user has liked post
  const hasLoggedUserLiked = (postID) => loggedUserLikes.includes(postID);

  // handles updating server/state upon clicking a like/unlike button
  const likePost = (postID, e) => {
    const httpVerb = hasLoggedUserLiked(postID) ? 'DELETE' : 'POST';

    const fetchConfig = {
      method: `${httpVerb}`,
      headers: {
        Authorization: `Bearer ${artScopeJWT}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: props.loggedUser.id, post_id: postID }),
    };

    fetch(likedPostsRoute, fetchConfig)
      .then((response) => response.json())
      .then((json) => {
        // props.upateCurrentUserLikes is a redux action and maintains that state in store
        if (json.message === 'created') {
          props.updateCurrentUserLikes(postID);
          setLoggedUserLikes(props.loggedUser.likedPosts.map((p) => p.id));

          const index = parseInt(e.target.parentElement.attributes[0].value, 10);
          const likeCounterClone = { ...likeCounter };
          likeCounterClone[index] += 1;
          setLikeCounter(likeCounterClone);
        } else if (json.message === 'deleted') {
          props.updateCurrentUserLikes(postID);
          setLoggedUserLikes(props.loggedUser.likedPosts.map((p) => p.id));

          const index = parseInt(e.target.parentElement.attributes[0].value, 10);
          const likeCounterClone = { ...likeCounter };
          likeCounterClone[index] -= 1;
          setLikeCounter(likeCounterClone);
        }
      });
  };

  const renderPostPreviews = (postsData) => postsData.map((post, i) => (
    <div key={post.id}>
      <Card style={width75MarginAutoCenterText}>

        <NavLink to={`/home/post/${post.id}`}>
          <Segment inverted style={widthMaxMarginAutoCenterText}>
            <img
              src={activeStorageUrlConverter(post.featured_image.url)}
              style={feedImage}
              alt={post.title}
            />
          </Segment>
        </NavLink>

        <Card.Content>
          <Card.Header>{post.title}</Card.Header>
          <Card.Meta>{post.body}</Card.Meta>
          {hasLoggedUserLiked(post.id) ? (
            <Button
              as="div"
              labelPosition="right"
              onClick={(e) => likePost(post.id, e)}
              code={i}
              style={widthIs100}
            >
              <Button
                color="black"
                style={widthIs100}
              >
                <Icon name="heart" />
                Unlike
              </Button>

              <Label
                as="a"
                basic
                color="red"
                pointing="left"
              >
                {likeCounter[i]}
              </Label>
            </Button>
          ) : (
            <Button
              as="div"
              labelPosition="right"
              style={widthIs100}
              onClick={(e) => likePost(post.id, e)}
              code={i}
            >
              <Button
                color="red"
                style={widthIs100}
              >
                <Icon name="heart" />
                like
              </Button>

              <Label
                as="a"
                basic
                color="red"
                pointing="left"
              >
                {likeCounter[i]}
              </Label>
            </Button>
          )}

        </Card.Content>

        <Card.Content extra>
          <NavLink to={`/home/user/${post.filteredUser.id}`}>
            <Header as="h3">
              <Image circular src={activeStorageUrlConverter(post.filteredUser.proPic)} />
              <br />
              Post By
              {' '}
              {post.filteredUser.username}
            </Header>
          </NavLink>
        </Card.Content>
      </Card>
      <br />
    </div>
  ));

  // gets feed from rails api calls setFeed to alter state
  const fetchFeed = () => {
    const fetchConfig = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${artScopeJWT}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: props.loggedUser.id }),
    };

    fetch(feedRoute, fetchConfig)
      .then((response) => response.json())
      .then((respFeed) => {
        setFeed(respFeed);
        setLikeCounter(respFeed.map((p) => (p.suscribedUsers.length)));
      });
  };
    // calls fetch on mount
  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <Segment
      secondary
      inverted
      id="mainStrip"
      style={mainStrip}
    >

      {feed ? (
        renderPostPreviews(feed)
      ) : (

        <Segment style={{ height: '30vh' }}>
          <Dimmer active>
            <Loader content="Loading" />
          </Dimmer>
        </Segment>
      )}

    </Segment>
  );
}

const msp = (state) => ({ loggedUser: state.user.user });

const mdp = (dispatch) => ({
  updateCurrentUserLikes: (newLikeID) => dispatch(updateUserLikes(newLikeID)),
});

export default connect(msp, mdp)(UserFeed);
