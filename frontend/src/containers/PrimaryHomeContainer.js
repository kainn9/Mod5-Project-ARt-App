// imports:
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import PrimaryNav from '../components/PrimaryNav';
import UserFeed from '../components/UserFeed';
import ShowPost from '../components/ShowPost';
import CreatePost from '../components/CreatePost';
import UserPostContainer from './UserPostContainer';
import UserLikedContainer from './UserLikedContainer'
import leaves from '../images/leaves.png';
import UserConnectionsContainer from './UCC';
import EditPost from '../components/EditPost';
import { homeBG } from '../bigStyle';
// end of imports -----------------------------------------

// primary container/page for logged in users --> has client side routing
const PrimaryHomeContainer = (props) => {

    return(
        
        <Switch>

          {/* home page */}
          <Route  exact path='/home'
                render={() => (
                <div style={homeBG} >
                    <PrimaryNav />
                    <UserFeed />
                
                </div>
                )}
            />

            {/* edit page for existing posts */}
            <Route path='/home/post/edit/:id'
                render={ routerProps => { 
                    
                const id = parseInt(routerProps.match.params.id) 

                return(

                    <div style={homeBG}>
                        <PrimaryNav/>
                        <EditPost postID={id} />

                    
                    </div>
                )
            }}
            />
            {/* for followers/following */}
            <Route path='/home/user/:id/connections'
                render={ routerProps => { 
                    
                const id = parseInt(routerProps.match.params.id) 

                return(

                    <div style={homeBG}>
                    <PrimaryNav />
                    <UserConnectionsContainer userID={id} />
                
                    </div>
                )
            }}
            />

            {/* page for liked posts of a specific user based on id param */}
            <Route path='/home/user/:id/liked'
                render={ routerProps => { 
                    
                const id = parseInt(routerProps.match.params.id) 

                return(

                    <div style={homeBG}>
                    <PrimaryNav/>
                    <UserLikedContainer userID={id} />
                
                    </div>
                )
            }}
            />

            {/* user show page */}
            <Route 
                path='/home/user/:id'
                render={ routerProps => { 
                    
                const id = parseInt(routerProps.match.params.id) 

                return(

                    <div style={homeBG}>
                    <PrimaryNav />
                    <UserPostContainer userID={id} />
                
                    </div>
                )
            }}
            />
            {/* post show page uses router params */}
            <Route 
                path='/home/post/:id'
                render={routerProps => {
                    let id = parseInt(routerProps.match.params.id)

                    return <ShowPost postID={ id } />
                }}
            />
            {/* create page for posts */}
            <Route 
                path='/home/create-post'
                render={ () => (
                    <div style={homeBG}>
                        <PrimaryNav />
                        <CreatePost />
                    
                    </div>
                )}
            />
          
        </Switch>
    );
};
export default withRouter(PrimaryHomeContainer);