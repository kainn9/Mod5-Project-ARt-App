import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Segment } from 'semantic-ui-react';
import PrimaryNav from '../components/PrimaryNav';
import UserFeed from '../components/UserFeed';
import ShowPost from '../components/ShowPost';
import CreatePost from '../components/CreatePost';
import UserPostContainer from './UserPostContainer';
import UserLikedContainer from './UserLikedContainer';
import UserConnectionsContainer from './UCC';
import EditPost from '../components/EditPost';
import hiro from '../images/hiro.png';
import { homeBG, maxWidthIs100, width75MarginAutoCenterText } from '../bigStyle';

// primary container/page for logged in users --> nested routing for logged in user actions
function PrimaryHomeContainer() {
  return (
    <Switch>

      {/* home page */}
      <Route
        exact
        path="/home"
        render={() => (

          <div style={homeBG}>
            <PrimaryNav />
            <UserFeed />

          </div>

        )}
      />
      {/* hiro marker preview page */}
      <Route
        path="/home/hiro"
        render={() => (

          <div style={homeBG}>
            <PrimaryNav />

            <Segment inverted style={width75MarginAutoCenterText}>
              <h1> Print this image or load it from a second device for AR Photos</h1>
              <img src={hiro} style={maxWidthIs100} alt="hiro symbol" />
            </Segment>
          </div>
        )}
      />

      {/* edit page for existing posts */}
      <Route
        path="/home/post/edit/:id"
        render={(routerProps) => {
          const id = parseInt(routerProps.match.params.id, 10);

          return (

            <div style={homeBG}>
              <PrimaryNav />
              <EditPost postID={id} />
            </div>
          );
        }}
      />
      {/* for followers/following */}
      <Route
        path="/home/user/:id/connections"
        render={(routerProps) => {
          const id = parseInt(routerProps.match.params.id, 10);

          return (

            <div style={homeBG}>

              <PrimaryNav />
              <UserConnectionsContainer userID={id} />

            </div>
          );
        }}
      />

      {/* page for liked posts of a specific user based on id param */}
      <Route
        path="/home/user/:id/liked"
        render={(routerProps) => {
          const id = parseInt(routerProps.match.params.id, 10);

          return (

            <div style={homeBG}>

              <PrimaryNav />
              <UserLikedContainer userID={id} />

            </div>
          );
        }}
      />

      {/* user show page */}
      <Route
        path="/home/user/:id"
        render={(routerProps) => {
          const id = parseInt(routerProps.match.params.id, 10);

          return (

            <div style={homeBG}>
              <PrimaryNav />
              <UserPostContainer userID={id} />

            </div>
          );
        }}
      />

      {/* post show page uses router params */}
      <Route
        path="/home/post/:id"
        render={(routerProps) => {
          const id = parseInt(routerProps.match.params.id, 10);
          return <ShowPost postID={id} />;
        }}
      />

      {/* create page for posts */}
      <Route
        path="/home/create-post"
        render={() => (

          <div style={homeBG}>

            <PrimaryNav />
            <CreatePost />

          </div>
        )}
      />

    </Switch>
  );
}

export default PrimaryHomeContainer;
