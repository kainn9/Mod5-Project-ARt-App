// imports 

    // React:
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
    // three related:
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

    // Semantic UI
import { Segment, Menu, Button, Header, Icon, Label, IconGroup } from 'semantic-ui-react';

// My relative imports:
import { activeStorageUrlConverter, postsRoute } from '../railsRoutes';
import { updateUserLikes } from '../redux/actions'
import PrimaryNav from './PrimaryNav';
import cityScape from '../images/cityScape.jpg';
import canvasTexture from '../images/canvas.jpg';
import canvasBack from '../images/canvasBack.jpg';
import { likedPostsRoute } from '../railsRoutes';
import Iframe from 'react-iframe'
// end of imports ----------------------------------

// Primary Show Component for Posts... Has 3 view modes set from state/hooks: 'normal, 'ar', 'three'
const ShowPost = (props) => {

    // auth token
    const artScopeJWT = localStorage.getItem('artScopeJWT');
    // state/hook for post being viewed
    const [currentPost, setCurrentPost] = useState(null);
    // state/hook for img url
    const [currentImg, setCurrentImg] = useState(null);
    // state/hook for picture dimensions --> used to render 3D and AR versions
    const [dimensions, setDimensions] = useState(0);
    // state/hook to track current view mode
    const [viewMode, setViewMode] = useState('normal');
    // state for like counter
    const [likedPostsCounter, setLikedPostsCounter] = useState(null)
    //
    const [videoHook, setVideoHook] = useState(null);


    // creates or destroys liked relationship in backend components should update
    const likePost = () => {

        const httpVerb = loggedUserLikedPost() ? 'DELETE' : 'POST'
        const fetchConfig = {
            method: `${httpVerb}`, 
            headers: { 
                Authorization: `Bearer ${artScopeJWT}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: props.loggedUser.id, post_id: currentPost.id })
        }

        fetch(likedPostsRoute, fetchConfig)
        .then( response => response.json() )
        .then(json => {
            
            //updating render, props.upateCurrentUserLikes is a redux action and maintains that state in store likeCounter is local state
            if (json.message === 'created') {
                
                props.updateCurrentUserLikes(currentPost.id)
                setLikedPostsCounter(current => current + 1 )

            } else if (json.message === 'deleted') {
                props.updateCurrentUserLikes(currentPost.id)
                setLikedPostsCounter(current => current - 1 )
                
            }
        })

    }
    
    // returns bool if logged user has liked the post in view
    const loggedUserLikedPost = () => {
        return props.loggedUser.likedPosts.map(p => p.id).includes(currentPost.id)
    }

    // callback for escape key to leave AR state
    const leaveAR = e => {
        if (e.code === 'Escape') {
            setViewMode('normal')
        }
    }

    // gets Dimesions from img and then uses Set Dimensions hook to save in state
    const getDimensions  = () => {
        // grab image
        const img = document.querySelector('#texture');

        // if viewMode !== normal the img does not exist,  grab natural height and length otherwise, view mode always starts as nornal
        if (viewMode === 'normal') setDimensions({height: img.naturalHeight, width: img.naturalWidth});
    }

    // sets view state to ar and grabs pic dimensions for render(if need be)
    const renderARView =() => {
        
        setViewMode('ar');
        getDimensions();
       
        
    }

    // sets view state to three and grabs pic dimensions for render(if need be)
    const prep3D = () => {
        setViewMode('three');
        getDimensions();
    }

    // renders 3D 'canvas' of img --> takes in image dimensions as args
    const render3D = (sWidth, sHeight) => {
        
        // where we render renderer(canvas must exist as JSX)
        const canvas = document.querySelector('#k');

        // create 3D renderer using canvas
        const renderer = new THREE.WebGLRenderer({canvas});
        // camera settings:
        const fov = 70; // field of view
        const aspect = 2;  // canvas default 
        const near = 0.1; // zoom
        const far = 3000; // clipping zone

        // make camera using settings
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        
        // small positioning change
        camera.position.z = 2;
        
        // camera controls (declared after camera/canvas)
        const controls = new OrbitControls(camera, canvas);

        // scene to render
        const scene = new THREE.Scene();
        
        // 'canvas' geometry settings(scaled from image dimensions):
        const boxWidth = sWidth / 128;
        const boxHeight = sHeight / 128;
        const boxDepth = 1;

        // declaring 'canvas' geomtry var
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
          
        // texture loader to turn img into three material
        const loader = new THREE.TextureLoader();

        
  
        // canvas textures
        const materials = [
            new THREE.MeshBasicMaterial({map: loader.load(canvasTexture)}),
            new THREE.MeshBasicMaterial({map: loader.load(canvasTexture)}),
            new THREE.MeshBasicMaterial({map: loader.load(canvasTexture)}),
            new THREE.MeshBasicMaterial({map: loader.load(canvasTexture)}), // depth faces
            new THREE.MeshBasicMaterial({map: loader.load(currentImg)}), //front
            new THREE.MeshBasicMaterial({map: loader.load(canvasBack)}), //back
        ];

        // make mesh out of 'canvas' geometry and material
        const canvas3D = new THREE.Mesh(geometry, materials);
        // add the mesh to scene
        scene.add(canvas3D);
            
 
        
        // fits renderer usings canvas properties --> takes renderer as arg
        function resizeRendererToDisplaySize(renderer) {
            // grabs dimensions from canvas element attached to renderer
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            // grabs boolean if canvas h/w doesnt match the values currently grabbed
            const needResize = canvas.width !== width || canvas.height !== height;
            
            // resizes renderer if bool is true
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            
            return needResize;
        }
          
        function render(time) {
            time *= 0.001;
            // checks if render was resized
            if (resizeRendererToDisplaySize(renderer)) {

                const canvas = renderer.domElement;
                // adjusts camera accordingly
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            // render scene
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }
          
            requestAnimationFrame(render);
    
    }

    // gets current post from rails api
    const fetchCurrentPost = () => {
        const fetchConfig = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${artScopeJWT}`
            }
        }

        fetch(`${postsRoute}/${props.postID}`, fetchConfig)
        .then( response => response.json())
        .then(data => {
            setCurrentPost(data)
            setCurrentImg(activeStorageUrlConverter(data.featured_image.url))
            setLikedPostsCounter(data.suscribedUsers.length)
        })
    }
          
        
    // if user leaves normal view store the img dimensions for rendering later
    useEffect(() => { 
        if(viewMode === 'three') return render3D(dimensions.width, dimensions.height) 

        if (viewMode !== 'ar' && document.querySelector('video')) {
            //reset video
            const video = document.querySelector('video');
            const mediaStream = video.srcObject;
            const tracks = mediaStream.getTracks();
            tracks.forEach(track => track.stop());
            video.remove();


          // ar js puts weird styles we need to remove
            const htmlTag = document.querySelector('html')
            htmlTag.classList.remove('a-fullscreen')
            document.querySelector('body').removeAttribute('style');
         
        }
    }, [viewMode])

    // on component load/mount
    useEffect(() => {
        document.addEventListener("keydown", e => leaveAR(e), false);
        fetchCurrentPost();
    }, [props])


    // normal view:
    if (viewMode === 'normal') return(
        <div style ={{ backgroundImage: `url(${cityScape})`, backgroundRepeat: 'repeat', minHeight: '100%', height: 'fit', width: '100%', textAlign: 'center'}}>
        {
            currentPost ? (
                <>
                {console.log(currentPost)}
                    <PrimaryNav />

                    <Segment inverted color='grey' style={{ maxWidth: '75%', margin: 'auto' }} >
                        <Segment inverted>
                            <Header as='h2' icon textAlign='center' >
                                <Icon name='image' />
                                <Header.Content>{ currentPost.title }</Header.Content>
                            </Header>
                            

                            <NavLink to={ `/home/user/${currentPost.filteredUser.id}` } >
                                <Header color='violet' size='medium' > Post By: {currentPost.filteredUser.username} </Header>
                            </NavLink>
                        </Segment>
                        <Menu pointing style={{ display: 'flex', justifyContent: 'center' }} >

                            <Menu.Item name='Standard View' onClick={ () => setViewMode('normal')} style = {{ width: '40%', color: 'blue' }} />
                        
                            <Menu.Item name='Canvas View' onClick={ () => prep3D()} style = {{ width: '40%', color: 'blue' }} />
                        
                            <Menu.Item name='Open AR View' onClick={ renderARView } style = {{ width: '20%', color: 'red' }} />
    
                        </Menu>
                        <Segment inverted>
                            <img id='texture' src={currentImg} style ={{ maxWidth: '100%' }} />
                        </Segment>
                        <Segment inverted>
                            <h3>
                                {currentPost.body}
                            </h3>
                        </Segment>
                        {
                            loggedUserLikedPost() ? (
                                <Button as='div' labelPosition='right'style={{ width: '100%'}}  onClick={ () => likePost() } >
                                    <Button color='black'  style={{ width: '100%'}}>
                                        <Icon name='heart' />
                                            Unlike
                                    </Button>
                                    <Label as='a' basic color='red' pointing='left'>
                                        {likedPostsCounter}
                                     </Label>
                                </Button>
                            ) : (
                                <Button as='div' labelPosition='right'style={{ width: '100%'}}  onClick={ () => likePost() }>
                                    <Button color='red'  style={{ width: '100%'}}>
                                        <Icon name='heart' />
                                            Like
                                    </Button>
                                    <Label as='a' basic color='red' pointing='left'>
                                        {likedPostsCounter}
                                     </Label>
                                </Button>
                            )
                        }
                        
                    </Segment >
                    
                </>
                
            ) : (
                null
            )
        }
        </div>
    )

    // view mode for AR
    if (viewMode === 'ar') return (
        <a-scene arjs='sourceType: webcam; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960; debugUIEnabled: false;'>
            <a-marker preset="hiro">
                <a-box src={ currentImg } position ='0 0 -2' depth = { dimensions.height / 512 } width={dimensions.width / 640} height='0.035'> </a-box>
            </a-marker>
        </a-scene> 
     
    )
    // view mode for three
    if (viewMode === 'three') return (
        
        <div style ={{ backgroundImage: `url(${ cityScape })`, backgroundRepeat: 'repeat', minHeight: '100%', height: 'fit', width: '100%'}}>
            
            <PrimaryNav />

            <Segment inverted color='grey' style={{ maxWidth: '75%', margin: 'auto'}}>

                <Menu pointing  style={{ display: 'flex', justifyContent: 'center' }}>
                    <Menu.Item name='Standard View' onClick={ () => setViewMode('normal')} style = {{ width: '40%', color: 'blue' }} />

                    <Menu.Item name='Canvas View' onClick={ () => prep3D()} style = {{ width: '40%', color: 'blue' }} />
                    
                    <Menu.Item name='Open AR View' onClick={ renderARView } style = {{ width: '20%', color: 'red'}} />
    
                </Menu>
                <canvas id="k" style={{ width: '100%', position: 'bottom' }} />
            </Segment>
        </div>
    
    )
}

const msp = state => ({ loggedUser: state.user.user, reduxLikedPosts: state.user.user.likedPosts });
const mdp = dispatch => ({ updateCurrentUserLikes: (newLikeID) => dispatch(updateUserLikes(newLikeID)) });

export default connect(msp, mdp)(ShowPost);