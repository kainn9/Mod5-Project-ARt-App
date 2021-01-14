import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import {
  Segment, Header, Icon, Button, Input, Label, TextArea, Form, Message,
} from 'semantic-ui-react';
import { updatePosts } from '../redux/actions';
import { postsRoute } from '../railsRoutes';

import {
  width75MarginAuto,
  textCenterMaxWidth,
  width80,
  textAreaCreatePost,
  height25MaxWidth,
  chooseFile,
  submitButton,
} from '../bigStyle';

function CreatePost(props) {
  CreatePost.propTypes = {
    user: {
      user: {
        id: PropTypes.number,
      },
    },
    updatePosts: PropTypes.func,
  };

  CreatePost.defaultProps = {
    user: null,
    updatePosts: null,
  };
  // auth token
  const artScopeJWT = localStorage.getItem('artScopeJWT');

  // state for error messages
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // state for controlling the inputs and img src
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [img, setImg] = useState(null);

  // for access to history
  const history = useHistory();

  // handles submit action
  const submitHandler = (e) => {
    e.preventDefault();

    // small front end validations

    if (!title) {
      setLoginFailed(true);
      setErrorMessage('Please Enter a post title');
    } else if (!body) {
      setLoginFailed(true);
      setErrorMessage('Please enter a small post description in the body input');
    } else if (!img) {
      setLoginFailed(true);
      setErrorMessage('No image selected to upload!');
    } else {
      // sending as formData so rails api can store img active storage
      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', body);
      formData.append('user_id', props.user.user.id);
      formData.append('featured_image', img);

      fetch(postsRoute, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${artScopeJWT}`,
        },
        body: formData,
      })
        .then((response) => response.json())

      // use new post id for the routing
        .then((post) => {
          props.updatePosts(post.id);
          history.push(`/home/post/${post.id}`);
        });
    }
  };

  return (
    <>
      <Segment
        inverted
        secondary
        placeholder
        style={width75MarginAuto}
      >

        <Header icon>
          <Icon name="image outline" />
          Create a Post!
        </Header>

        <Form
          error={loginFailed}
          onSubmit={submitHandler}
          style={textCenterMaxWidth}
        >

          <Message
            error
            header="Error"
            content={errorMessage}
          />

          <Label
            color="purple"
            horizontal
            style={width80}
          >
            Post Title:
          </Label>

          <br />

          <Input
            value={title}
            placeholder="enter title here..."
            focus
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '80%' }}
          />

          <div
            className="filler"
            style={{ height: '10vh' }}
          />

          <Label
            color="purple"
            horizontal
            style={width80}
          >
            Body:
          </Label>

          <br />

          <TextArea
            value={body}
            focus
            placeholder="Tell people about stuff!"
            onChange={(e) => setBody(e.target.value)}
            style={textAreaCreatePost}
          />

          <div
            className="filler"
            style={{ height: '15vh' }}
          />

          <br />

          <img
            src={img ? URL.createObjectURL(img) : null}
            alt="upload preview"
            hidden={!img}
            style={height25MaxWidth}
          />

          <br />

          <label style={chooseFile}>
            <input
              type="file"
              accept="image/*"
              multiple={false}
              onChange={(e) => setImg(e.target.files[0])}
            />
          </label>

          <br />

          <Button
            primary
            style={submitButton}
          >
            Submit Me!
          </Button>
        </Form>
      </Segment>
    </>
  );
}

// read current user from redux store
const msp = (state) => ({ user: state.user });

const mdp = (dispatch) => ({
  updatePosts: (id) => dispatch(updatePosts(id)),
});

export default connect(msp, mdp)(CreatePost);
