import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Segment, Header, Icon, Button, Input, Label, TextArea, Form, Message,
} from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { activeStorageUrlConverter, postsRoute } from '../railsRoutes';

import {
  width75MarginAuto,
  textCenterMaxWidth,
  width80,
  textAreaCreatePost,
  height25MaxWidth,
  chooseFile,
  submitButton,
} from '../bigStyle';

function EditPost(props) {
  EditPost.propTypes = {
    loggedUser: PropTypes.shape({
      bio: PropTypes.string,
      id: PropTypes.number,
      isFollowedBy: PropTypes.array,
      isFollowing: PropTypes.array,
      likedPosts: PropTypes.array,
      posts: PropTypes.array,
      proPic: PropTypes.object,
      username: PropTypes.string,
      postID: PropTypes.number,
    }),

    postID: PropTypes.number,
  };

  EditPost.defaultProps = {
    loggedUser: null,
    postID: null,
  };

  const {
    postID,
    loggedUser: { id },
  } = props;

  // auth token
  const artScopeJWT = localStorage.getItem('artScopeJWT');

  // state for error messages
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // hooks

  // input control hooks
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [img, setImg] = useState(null);
  const [oldImg, setOldImg] = useState(null);

  // state for post
  const [foundPost, setFoundPost] = useState(null);

  // for redirect / access to history
  const history = useHistory();

  // fetches post and displays it in form so user can edit
  const fetchPost = () => {
    const fetchConfig = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${artScopeJWT}`,
      },
    };

    fetch(`${postsRoute}/${props.postID}`, fetchConfig)
      .then((response) => response.json())
      .then((data) => {
        setFoundPost(data);
        setOldImg(activeStorageUrlConverter(data.featured_image.url));
        setTitle(data.title);
        setBody(data.body);
      });
  };

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
      formData.append('post_id', props.postID);
      formData.append('title', title);
      formData.append('body', body);
      formData.append('user_id', props.loggedUser.id);
      formData.append('featured_image', img);

      fetch(`${postsRoute}/${props.postID}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${artScopeJWT}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((post) => history.push(`/home/post/${post.id}`));
    }
  };
    // checks if user owns the post being previewed
  const authEdit = () => {
    for (const post of props.loggedUser.posts) {
      if (post.id === props.postID) return true;
    }

    return false;
  };

  // sets img hook/state to selected file/img
  const imgChangeHandler = (e) => {
    setImg(e.target.files[0]);
  };

  // on mount fetch the post to edit
  useEffect(() => {
    fetchPost();
  }, [postID]);

  return (
    <>
      {foundPost && authEdit ? (
        <>
          {authEdit() ? (
            <Segment inverted secondary placeholder style={width75MarginAuto}>

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

                <h2>Image preview:</h2>
                <img
                  src={img ? URL.createObjectURL(img) : oldImg}
                  alt="upload preview"
                  style={height25MaxWidth}
                />

                <br />

                <label style={chooseFile}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple={false}
                    onChange={(e) => imgChangeHandler(e)}
                  />
                </label>

                <br />

                <Button primary style={submitButton}>
                  Submit Me!
                </Button>
              </Form>

              <NavLink to={`/home/user/${id}`}>
                <Button
                  color="red"
                  style={submitButton}
                >
                  Cancel
                </Button>

              </NavLink>

            </Segment>
          ) : (
            null
          )}
        </>
      ) : (
        null
      )}
    </>
  );
}
// read current user from redux store
const msp = (state) => ({ loggedUser: state.user.user });

export default connect(msp, null)(EditPost);
