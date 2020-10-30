// imports:
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrimaryNav from '../components/PrimaryNav';
import UserFeed from '../components/UserFeed';
import ShowPost from '../components/ShowPost';
import CreatePost from '../components/CreatePost';
import UserPostContainer from './UserPostContainer';
import UserLikedContainer from './UserLikedContainer'
import leaves from '../images/leaves.png';
// end of imports -----------------------------------------

// primary container/page for logged in users --> has client side routing
const PrimaryHomeContainer = (props) => {

    return(
        
        <Switch>

            {/* edit page for existing posts */}
            <Route path='/home/post/edit/:id'
                render={ routerProps => { 
                    
                const id = parseInt(routerProps.match.params.id) 

                return(

                    <div style={{
                    backgroundImage: `url(${ leaves })`,
                    backgroundRepeat: 'repeat',
                    height: 'fit%',
                    minHeight: '100%',
                    }}
            >
                    <PrimaryNav history={props.history} />
                    <h1>inside edit</h1>
                    </div>
                )
            }}
            />

            {/* page for liked posts of a specific user based on id param */}
            <Route path='/home/user/:id/liked'
                render={ routerProps => { 
                    
                const id = parseInt(routerProps.match.params.id) 

                return(

                    <div style={{
                    backgroundImage: `url(${ leaves })`,
                    backgroundRepeat: 'repeat',
                    height: 'fit%',
                    minHeight: '100%',
                    }}
            >
                    <PrimaryNav history={props.history} />
                    <UserLikedContainer userID={id} />
                
                    </div>
                )
            }}
            />

            {/* user show page */}
            <Route path='/home/user/:id'
                render={ routerProps => { 
                    
                const id = parseInt(routerProps.match.params.id) 

                return(

                    <div style={{
                    backgroundImage: `url(${ leaves })`,
                    backgroundRepeat: 'repeat',
                    height: 'fit%',
                    minHeight: '100%',
                    }}
            >
                    <PrimaryNav history={props.history} />
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
                    <div style={{
                        backgroundImage: `url(${ leaves })`,
                        backgroundRepeat: 'repeat',
                        height: 'fit%',
                        minHeight: '100%',
                        }}
                    >
                        <PrimaryNav history={props.history} />
                        <CreatePost />
                    
                    </div>
                )}
            />
            {/* home page */}
            <Route path='/home'
                render={() => (
                <div style={{
                    backgroundImage: `url(${ leaves })`,
                    backgroundRepeat: 'repeat',
                    height: 'fit%',
                    minHeight: '100%',
                }}
            >
                    <PrimaryNav history={props.history} />
                    <UserFeed />
                
                </div>
                )}
            />

            
        </Switch>
    );
};
export default PrimaryHomeContainer;