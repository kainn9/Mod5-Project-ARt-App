import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Segment, Image, Form, TextArea, Header, Button,
} from 'semantic-ui-react';
import { commentBox } from '../bigStyle';
import { activeStorageUrlConverter, commentRoute } from '../railsRoutes';

/*
    loads from show post, renders existing comments from props,
    has a form that adds comments to post and manips state to reflect that until next fetch
*/
const CommentZone = (props) => {
  // auth token
  const artScopeJWT = localStorage.getItem('artScopeJWT');
  const [body, setBody] = useState('');

  /*
    clones old state variable/hook(currentPost), pushes the new comment(return from post method)
    into currentPost.comments clone and then sets the update clone as the state calling
    setCurrentPost triggers the rerender in the process
    */
  const updateCommentState = (comment) => {
    props.setCurrentPost((current) => {
      const currentPostClone = { ...current };
      currentPostClone.comments.push(comment);

      return currentPostClone;
    });
  };

  // sends a post request for a new comment passing in the logged user and the current previewed post ids, it then calls updateCommentState on the callback which is a serlialzed post in json format
  const addComment = (e) => {
    e.preventDefault();

    const fetchConfig = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${artScopeJWT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: props.loggedUser.id, post_id: props.postID, body }),
    };

    fetch(commentRoute, fetchConfig)
      .then((response) => response.json())
      .then((comment) => {
        updateCommentState(comment);
        setBody('');
      });
  };
    // maps through props.comments data to make jsx comments, if theyre no comments on post it just renders that instead
  const renderComments = () => {
    if (props.comments.length) {
      return props.comments.map((comment) => (
        <Segment inverted>
          <div>
            <NavLink to={`/home/user/${comment.userID}`}>
              <Image
                src={activeStorageUrlConverter(comment.proPic)}
                avatar
              />
              <span>
                {comment.username}
                {' '}
                commented:
              </span>
            </NavLink>

            <Segment
              inverted
              secondary
            >
              <h3>
                {comment.body}
              </h3>
            </Segment>
          </div>
        </Segment>
      ));
    }
    return (<h2>No Comments Yet</h2>);
  };

  return (
    <>
      <Segment style={commentBox}>
        {renderComments()}
      </Segment>

      <Segment inverted>
        <Header as="h2">
          <Image
            src={activeStorageUrlConverter(props.loggedUser.proPic.url)}
            alt="profile picture"
          />
          {props.loggedUser.username}
          :
        </Header>

        <Form onSubmit={body ? (e) => addComment(e) : null}>
          <TextArea
            placeholder="add a comment"
            style={{ minHeight: 100 }}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button
            primary
            style={{ width: '100%' }}
          >
            Post Comment
          </Button>
        </Form>
      </Segment>
    </>
  );
};

export default CommentZone;
