// imports:
import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { connect } from 'react-redux';

import { Segment, Icon, Menu, Search } from 'semantic-ui-react';
import { activeStorageUrlConverter, searchRoute } from '../railsRoutes';

import {
  width75MarginAutoCenterText,

} from '../bigStyle';
// end of imports-----------------------------------------

// Primary Navbar for logged in  views
const PrimaryNav = (props) => {

  //auth token
  const token = localStorage.getItem('artScopeJWT')

  const history = useHistory()
  
  // search bar load state
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);

  // state to avoid spaming fetches while seatching
  const [queryDelay, setQueryDelay] = useState(false);


  // handles onClick for search popup box
  const handleResultSelect = (e, { result }) => {
    
    // different routes depening on query result
    if (result.description === 'user') {
    
      history.push(`/home/user/${result.id}`);
      setSearchInput('');

    } else if (result.description === 'post') {

      history.push(`/home/post/${result.id}`);
      setSearchInput('');
    }

  }

  // fetches search results based on searchParams
  const fetchSearchResults = (searchParams) => {
  
    const fetchConfig = {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ search: searchParams })
    }

    if (!queryDelay) {
      setQueryDelay(true);

      fetch(searchRoute, fetchConfig)
      .then( response => response.json())
      .then(matches => {
      
        setQueryDelay(false);
        setIsLoading(false);
        // we set the key to combo of the username/title and ID + index because while user ID's are unique and Post ID's are unique they are not unique to each other
        // it is still possible for overlap even with these buffers but the duplicate keys on temp search results dont actually break the functinality but do give annoying errors in the console
        const structUserData = matches.users.map( (user, i) => ({ 
          title: user.username, 
          description: 'user', 
          id: user.id, 
          key: user.username + user.id , 
          image: activeStorageUrlConverter(user.proPic.url)
        }));

        const structPostData = matches.posts.map( (post, i) => ({ 
          title: post.title, 
          description: 'post', 
          key: post.id + post.title + i, 
          id: post.id, 
          image: activeStorageUrlConverter(post.featured_image.url)
        }));

        setResults([...structUserData, ...structPostData]);
      })
    }
  
  }

  // fetch search results based on searchInput as it changes
  useEffect(() => {
      fetchSearchResults(searchInput);
  
  }, [searchInput]);

  // controls search input
  const searchHandler = input => {
    setIsLoading(true);
    setSearchInput(input.value);
  }

  // logout -- props.logoutUser() -> sets user to null in redux store, remove authToken from localStorage, redirect to home
  const logoutHandler = () => {
    props.logoutUser();
    localStorage.removeItem('artScopeJWT');
    history.push('/');
  }

  return(
    <div style={width75MarginAutoCenterText} >

      <Segment inverted  style={{ minWidth: '0', margin: 0 }} >

        <Menu inverted color={'black'} icon='labeled'>
          <NavLink to='/home' style={{ width: '15%' }} >
            <Menu.Item name='home' >
              <Icon name='home' />
              Home
            </Menu.Item>
          </NavLink>

          <NavLink to={ `/home/user/${props.user.user.id}` } style ={{ width: '15%' }} >
            <Menu.Item name='My Page'>
              <Icon name='folder open' />
              My Page
            </Menu.Item>
          </NavLink>

          <NavLink to={ `/home/user/${props.user.user.id}/connections` } style ={{ width: '15%' }} >
            <Menu.Item name='My Connections'>
              <Icon name='users' />
              My Connections
            </Menu.Item>
          </NavLink>

          <NavLink to={ `/home/user/${props.user.user.id}/liked` } style ={{ width: '15%' }} >
            <Menu.Item name='Liked Posts'>
              <Icon name='folder open outline' />
              Liked Posts
            </Menu.Item>
          </NavLink>


          <NavLink to='/home/create-post' style={{ width: '15%' }} >
            <Menu.Item name='create-post'>
              <Icon name='file image outline' />
              Create Post
            </Menu.Item>
          </NavLink>
          
          <NavLink to='/home/hiro' style={{minWidth: '0px',  width: '13%' }} >
            <Menu.Item name='Hiro Img'>
              <Icon name='hand peace' />
              Hiro Img
            </Menu.Item>
          </NavLink>

          <Menu.Item name='logOut' onClick={ logoutHandler }  style={{ minWidth: '0px', width: '13%' }}>
            <Icon name='hand peace' />
            Log Out
          </Menu.Item>

        </Menu>
  
      </Segment>

      <Segment inverted color='teal' style={{ margin: 0 }}>
        <Search
          id='mainSearchBar'
          fluid
          placeholder='search for users or posts'
          loading={isLoading}
          onResultSelect={handleResultSelect}
          onSearchChange={({ target }) => searchHandler(target)}
          results={results}
          value={searchInput}
        
        />
      </Segment>
    </div>
  );
    
};

// set user to null in redux on logout
const mdp = dispatch => ({ logoutUser: () => dispatch({ type: 'logoutUser' }) });
const msp = state => ({ user: state.user });
export default connect(msp, mdp)(PrimaryNav);