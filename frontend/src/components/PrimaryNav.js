// imports:
import React, { useState, useEffect } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

import { Segment, Icon, Menu, Search } from 'semantic-ui-react';
import { activeStorageUrlConverter, searchRoute } from '../railsRoutes';
// end of imports-----------------------------------------

// Primary Navbar for logged in  views
const PrimaryNav = (props) => {
  //auth token
  const token = localStorage.getItem('artScopeJWT')

  // search bar load state
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);

  // state to manip to avoid spam fetches
  const [queryDelay, setQueryDelay] = useState(false)
  const [test, setTest] = useState(false)

  const handleResultSelect = (e, { result }) => {

    if(result.description === 'user') {
      console.log(props)
      props.history.push(`/home/user/${result.id}`)
    } else if (result.description === 'post') {
      props.history.push(`/home/post/${result.id}`)
    }
    //window.location.reload()
  }
  // fetches search results 
  const fetchSearchResults = (searchParams) => {
    console.log('fetchy', searchParams)
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
        console.log(matches)
        setQueryDelay(false)
        setIsLoading(false)

        const structUserData = matches.users.map( user => ({title: user.username, description: 'user', id: user.id, key: user.id}))
        const structPostData = matches.posts.map( post => ({title: post.title, description: 'post', key: post.id, id: post.id, image: activeStorageUrlConverter(post.featured_image.url)}))
        setResults([...structUserData, ...structPostData])
      })
    }
  
  }
  useEffect(() => {
      console.log(searchInput)
    if (searchInput.length > 2) {
      console.log(searchInput)
      fetchSearchResults(searchInput)
    }
  }, [searchInput])

  // controls search input
  const searchHandler = input => {
    setIsLoading(true);
    setSearchInput(input.value)
  }

  // logout -- props.logoutUser() -> sets user to null in redux store, remove authToken from localStorage, redirect to home
  const logoutHandler = () => {
    props.logoutUser()
    localStorage.removeItem('artScopeJWT');
    props.history.push('/')
  }

  return(
    <div style={{ width: '75%', margin: 'auto', textAlign: 'center' }} >

      <Segment raised inverted >

        <Menu raised inverted color={'black'} icon='labeled'>
          <NavLink to='/home' style={{ width: '25%' }} >
            <Menu.Item name='home' >
              <Icon name='home' />
              Home
            </Menu.Item>
          </NavLink>

          <NavLink to={ `/home/user/${props.user.user.id}` } style ={{ width: '25%' }} >
            <Menu.Item name='My Posts'>
              <Icon name='folder open' />
              My Posts
            </Menu.Item>
          </NavLink>

          <NavLink to={ `/home/user/${props.user.user.id}/liked` } style ={{ width: '25%' }} >
            <Menu.Item name='Liked Posts'>
              <Icon name='folder open outline' />
              Liked Posts
            </Menu.Item>
          </NavLink>


          <NavLink to='/home/create-post' style ={{ width: '25%' }} >
            <Menu.Item name='create-post'>
              <Icon name='file image outline' />
              Create Post
            </Menu.Item>
          </NavLink>

          {/* <Menu.Item id='filler' style ={{ width: '50%' }} /> */}
          <Menu.Item >
          <Search
            fluid
            loading={isLoading}
            onResultSelect={handleResultSelect}
            onSearchChange={({ target }) => searchHandler(target)}
            results={results}
           value={searchInput}
          />
          </Menu.Item>
            
          <Menu.Item name='logOut' onClick={ logoutHandler }>
            <Icon name='hand peace' />
            Log Out
          </Menu.Item>

        </Menu>
      
      </Segment>
    </div>
  );
    
};

// set user to null in redux
const mdp = dispatch => ({ logoutUser: () => dispatch({ type: 'logoutUser' }) })
const msp = state => ({ user: state.user })
export default withRouter(connect(msp, mdp)(PrimaryNav));