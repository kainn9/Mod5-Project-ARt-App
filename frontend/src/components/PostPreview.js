import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, Icon, Button } from 'semantic-ui-react';
import { activeStorageUrlConverter } from '../railsRoutes';
import canvasTexture from '../images/canvas.jpg'


const PostPreview = (props) => {
    
    const doesViewerOwnPost = () => {
        return props.user.user.id === props.userID ? true : false;
    }
    

    return(
        <div>
            {
                doesViewerOwnPost() ? (
                    <div>
                        <NavLink to={`/home/post/edit/${props.data.id}`} >
                            <Button content='Edit/Remove' icon='edit outline' labelPosition='left' style={{ width: '100%' }} onClick={ () => console.log('btn')} />
                        </NavLink>
                    </div>
                ) : null
            }
            {console.log('msp', props.data)}
            <NavLink to={`/home/post/${props.data.id}`}>
                <Card style={{ height: '25vh', marginTop: 0 }} onClick={ () => null } >
                    <img src={activeStorageUrlConverter(props.data.img)} wrapped ui={false} style={{ height: '50%', objectFit: 'scale-down', backgroundImage: `url(${canvasTexture})`}}/>
                    <Card.Content>
                        <Card.Header>{props.data.title}</Card.Header>
                    </Card.Content>
                    <Card.Content extra>
                        <Icon name='heart' />
                        Likes go here
                    </Card.Content>
                </Card>
            </NavLink>
       
        </div>
    )
}

const msp = state => ({ user: state.user })
export default connect(msp, null)(PostPreview);