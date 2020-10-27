import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Segment, Header, Icon, Button, Input, Label, TextArea } from 'semantic-ui-react';

const CreatePost = () => {
    const history = useHistory();
    const artScopeJWT = localStorage.getItem('artScopeJWT');
    const [title, setTitle] = useState('test');
    const [body, setBody] = useState('test2');
    const [img, setImg] = useState(null);

    const submitHandler = e => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('title', title);
        formData.append('body', body);
        formData.append('featured_image', img);

        fetch('http://localhost:4000/api/v1/posts', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${artScopeJWT}`, 
          },
          body: formData
        })
        .then( response => response.json() )
        .then( post => history.push(`/home/post/${post.id}`))
    }

    const imgChangeHandler = e => {
        setImg(e.target.files[0])
    }

    return(
        <>
        <script src="https://aframe.io/releases/0.9.2/aframe.min.js"></script>
        <script src="https://raw.githack.com/jeromeetienne/AR.js/2.0.4/aframe/build/aframe-ar.js"></script>
        <Segment placeholder style={{width: '75%', margin: 'auto'}}>
            <Header icon>
                <Icon name='image outline' />
                Create a Post!
            </Header>
            <form onSubmit={ submitHandler } style={{textAlign: 'center', width: '100%'}}>
                <Label
                    style={{ width: '280px'}} 
                    color='purple' 
                    horizontal
                > 
                    Post Title:
                </Label> <br></br>

                <Input 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    focus 
                    placeholder='enter title here...' 
                    style ={{width: '290px'}} 
                /> 
                <div 
                    className='filler'
                    style ={{ height: '10vh'}}
                />
                <Label
                    style={{ width: '280px'}} 
                    color='purple' 
                    horizontal
                > 
                    Body:
                </Label> <br></br>
                <TextArea 
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    focus 
                    placeholder='Tell people about stuff!' 
                    style ={{ 'max-width': '100%', width: '280px', 'min-height': '20vh'}} 
                    />
                <div 
                    className='filler'
                    style ={{ height: '15vh'}}
                />

                
                <br></br>

                <label
                style ={{
                    border: '1px solid #ccc',
                    display: 'inline-block',
                    padding: '6px 12px',
                    cursor: 'pointer',

                 }}
                >
                    <input 
                        type="file" 
                        accept="image/*" 
                        multiple={false} 
                        onChange={ e => imgChangeHandler(e) }
                        
                    />
                </label>
                <br></br>
                <Button style={{ width: '290px', 'max-width': '100%'}} primary>Submit Me!</Button>
            </form>
    
        </Segment>
            {/* <form onSubmit={ submitHandler }>
            
                <h1> CreatePost </h1>
                <input type="file" accept="image/*" multiple={false} onChange={ e => imgChangeHandler(e) } />
                <button>Submit</button>
            </form> */}
        </>
    );
};

export default CreatePost