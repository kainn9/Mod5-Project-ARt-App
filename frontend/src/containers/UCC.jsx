import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Segment, Menu, Button, Header, Image,
} from 'semantic-ui-react';
import FollowList from '../components/FollowList';
import { activeStorageUrlConverter } from '../railsRoutes';
import { followerButtons, followerGrid, width75MarginAuto } from '../bigStyle';

function UserConnectionsContainer(props) {
  UserConnectionsContainer.propTypes = {
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

    userID: PropTypes.number,
  };
  UserConnectionsContainer.defaultProps = {
    loggedUser: null,
    userID: null,
  };

  const {
    userID,
    loggedUser: {
      id,
    },
  } = props;

  const [activeTab, setActiveTab] = useState('following');
  const [previewedUserData, setPreviewedUserData] = useState('');

  return (
    <>
      <div
        id="wrapper"
        style={{ textAlign: 'center' }}
      >

        <NavLink to={`/home/user/${id}/connections`}>

          <Button
            color="pink"
            style={followerButtons}
          >
            My Followers/Following
          </Button>

        </NavLink>

        <NavLink to={`/home/user/${userID}`}>

          <Button
            color="orange"
            style={followerButtons}
          >
            Back to Collection
          </Button>

        </NavLink>

      </div>
      <Segment inverted secondary style={width75MarginAuto}>

        <Menu
          attached="top"
          tabular
          inverted
        >

          <Menu.Item
            name="following"
            active={activeTab === 'following'}
            onClick={(e, { name }) => setActiveTab(name)}
            style={{ width: '50%' }}
          />

          <Menu.Item
            name="followers"
            active={activeTab === 'followers'}
            onClick={(e, { name }) => setActiveTab(name)}
            style={{ width: '50%' }}
          />

        </Menu>

        {activeTab === 'following' ? (
          <Segment inverted style={{ textAlign: 'center' }}>
            {previewedUserData ? (

              <Header as="h2">

                <Image circular src={activeStorageUrlConverter(previewedUserData.img.url)} />

                <br />

                {`Viewing: ${previewedUserData.username}`}

              </Header>

            ) : (
              null
            )}

            <div style={followerGrid}>
              <FollowList
                setPreviewedUserData={setPreviewedUserData}
                relationship="isFollowing"
                userID={userID}
              />
            </div>

          </Segment>
        ) : (

          <Segment
            inverted
            style={{ textAlign: 'center' }}
          >
            {previewedUserData ? (

              <Header as="h2">

                <Image circular src={activeStorageUrlConverter(previewedUserData.img.url)} />

                <br />

                {`Viewing: ${previewedUserData.username}`}

              </Header>

            ) : (
              null
            )}

            <div style={followerGrid}>
              <FollowList
                setPreviewedUserData={setPreviewedUserData}
                relationship="isFollowedBy"
                userID={userID}
              />
            </div>

          </Segment>
        )}

      </Segment>
    </>
  );
}

const msp = (state) => ({ loggedUser: state.user.user });
export default connect(msp, null)(UserConnectionsContainer);
