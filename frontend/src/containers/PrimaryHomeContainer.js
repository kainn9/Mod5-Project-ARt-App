// imports:
import React from 'react';

import CreatePost from '../components/CreatePost';
import { Route, Switch, Redirect } from 'react-router-dom';
import PrimaryNav from '../components/PrimaryNav';
import UserFeed from '../components/UserFeed';
import leaves from '../images/leaves.png';
import ShowPost from '../components/ShowPost';
// end of imports -----------------------------------------

// primary container/page for logged in users --> has client side routing
const PrimaryHomeContainer = () => {

    return(
        
        <Switch>
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
                        <PrimaryNav />
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
                    <PrimaryNav />
                    <UserFeed />
                
                </div>
                )}
            />
        </Switch>
    );
};
export default PrimaryHomeContainer;