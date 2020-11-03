// imports:
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';

import { activeStorageUrlConverter, postsRoute } from '../railsRoutes';
import { Segment, Header, Icon, Button, Input, Label, TextArea, Form, Message } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
// end of imports ------------------------------------------------------------------------

// form for uploading images with title and body
const EditPost = (props) => {

    // auth token
    const artScopeJWT = localStorage.getItem('artScopeJWT');

    // state for error messages
    const [loginFailed, setLoginFailed] =  useState(false);
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

    // fetches post and updates hooks/state
    const fetchPost = () => {

        const fetchConfig = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${artScopeJWT}`
            }
        }

        fetch(`${postsRoute}/${props.postID}`, fetchConfig)
        .then( response => response.json())
        .then(data => { 
            console.log(activeStorageUrlConverter( data.featured_image.url ));
            setFoundPost(data)
            setOldImg(activeStorageUrlConverter( data.featured_image.url ));
            setTitle(data.title);
            setBody(data.body)
        })
    }

    //reutrns bool if loggedUser owns post
    const authEdit = () => {
        return true
    }

    // handles submit action
    const submitHandler = e => {
        e.preventDefault();
        
        // front end validations

        if (!title) {
            setLoginFailed(true);
            setErrorMessage('Please Enter a post title')
        } else if (!body) {
            setLoginFailed(true);
            setErrorMessage('Please enter a small post description in the body input')
        } else if(!img) {
            setLoginFailed(true);
            setErrorMessage('No image selected to upload!')
        } else {

            // sending as formData so rails api can store img active storage
            const formData = new FormData();
            formData.append('post_id', props.postID);
            formData.append('title', title);
            formData.append('body', body);
            formData.append('user_id', props.loggedUser.id);
            formData.append('featured_image', img);

            fetch(postsRoute + '/' + props.postID, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${artScopeJWT}`, 
            },
            body: formData
            })
            .then( response => response.json() )
            // use new post id for the routing
            .then( post => history.push(`/home/post/${post.id}`))
        }


        
    }

    // sets img hook/state to selected file/img
    const imgChangeHandler = e => {
        setImg(e.target.files[0])
    }

    //on mount
    useEffect(() => {
        fetchPost()
    }, []) 

    return(
        <>
        {
            foundPost ? (
                <>
                {
                    authEdit() ? (
                        <Segment inverted secondary placeholder style={{ width: '75%', margin: 'auto' }} >
                            {console.log('img', img)}
                            <Header icon>
                                <Icon name='image outline' />
                                Create a Post!
                            </Header>
        
                            <Form error={loginFailed} onSubmit={ submitHandler } style={{ textAlign: 'center', width: '100%' }} >
        
                                <Message
                                    error
                                    header='Error'
                                    content={ errorMessage }
                                />
        
                                <Label color='purple' horizontal style={{ width: '80%'}}> 
                                    Post Title:
                                 </Label> 
        
                                <br></br>
        
                                <Input value={ title } placeholder='enter title here...' focus onChange={ e => setTitle(e.target.value) } style ={{ width: '80%' }} /> 
                        
                                <div className='filler' style ={{ height: '10vh'}}/>
                        
                                <Label color='purple' horizontal style={{ width: '80%'}} > 
                                    Body:
                                </Label> 
                        
                                <br></br>
        
                                <TextArea value={body}
                                    focus 
                                    placeholder='Tell people about stuff!' 
                                    onChange={e => setBody(e.target.value)}
                                    style ={{ 'max-width': '100%', width: '80%', 'min-height': '20vh'}} 
                                />
        
                                <div className='filler' style ={{ height: '15vh'}} />
        
                                <br></br>
                                <h2> Image preview: </h2>
                                <img src ={img ? URL.createObjectURL(img) : oldImg} alt='upload preview' style={{ height: '25%', width: '100%' }} />
        
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
                            </Form>

                            <NavLink to={`/home/user/${props.loggedUser.id}`}>
                                <Button color='red' style={{ width: '290px', 'max-width': '100%'}}> Cancel</Button>
                             </NavLink>
            
                </Segment>
                    ) : (
                        null
                    )
                }
                
                </>
            ) : (
                null
            )
        }
        </>
       
    );
};
// read current user from redux store
const msp = state => ({ loggedUser: state.user.user })

export default connect(msp, null)(EditPost)