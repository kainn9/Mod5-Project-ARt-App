// imports:
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';

import { postsRoute } from '../railsRoutes';
import { Segment, Header, Icon, Button, Input, Label, TextArea } from 'semantic-ui-react';
// end of imports ------------------------------------------------------------------------

// form for uploading images with title and body
const CreatePost = (props) => {

    // auth token
    const artScopeJWT = localStorage.getItem('artScopeJWT');
    
    // hooks

    // input control hooks
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [img, setImg] = useState(null);
    // for redirect / access to history
    const history = useHistory();

    // handles submit action
    const submitHandler = e => {
        e.preventDefault();

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
          body: formData
        })
        .then( response => response.json() )
        // use new post id for the routing
        .then( post => history.push(`/home/post/${post.id}`))
    }

    // sets img hook/state to selected file/img
    const imgChangeHandler = e => {
        setImg(e.target.files[0])
    }

    return(
        <>
        <Segment placeholder style={{ width: '75%', margin: 'auto' }} >

            <Header icon>
                <Icon name='image outline' />
                Create a Post!
            </Header>

            <form onSubmit={ submitHandler } style={{ textAlign: 'center', width: '100%' }} >
                <Label color='purple' horizontal style={{ width: '280px'}}> 
                    Post Title:
                </Label> 

                <br></br>

                <Input value={ title } placeholder='enter title here...' focus onChange={ e => setTitle(e.target.value) } style ={{ width: '290px' }} /> 
                
                <div className='filler' style ={{ height: '10vh'}}/>
                
                <Label color='purple' horizontal style={{ width: '280px'}} > 
                    Body:
                </Label> 
                
                <br></br>

                <TextArea value={body}
                    focus 
                    placeholder='Tell people about stuff!' 
                    onChange={e => setBody(e.target.value)}
                    style ={{ 'max-width': '100%', width: '280px', 'min-height': '20vh'}} 
                />

                <div className='filler' style ={{ height: '15vh'}} />

                <br></br>

                <img src ={img ? URL.createObjectURL(img) : null} alt='upload preview' style={{ height: '25%', width: '100%' }} />

                <br></br>

                <label style = {{
                    border: '1px solid #ccc',
                    display: 'inline-block',
                    padding: '6px 12px',
                    cursor: 'pointer',

                    }}
                >
                <input type="file" accept="image/*" multiple={false} onChange={ e => imgChangeHandler(e) } />
                </label>

                <br></br>

                <Button primary style={{ width: '290px', 'max-width': '100%'}}>Submit Me!</Button>
            </form>
    
        </Segment>
        </>
    );
};
// read current user from redux store
const msp = state => ({ user: state.user })

export default connect(msp, null)(CreatePost)