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
import CommentZone from './CommentZone';

import canvasTexture from '../images/canvas.jpg';
import canvasBack from '../images/canvasBack.jpg';
import { likedPostsRoute } from '../railsRoutes';

import {
    width75MarginAuto,
    width40Blue,
    width20Red,
    maxWidthIs100,
    flexJCenter,
    widthIs100,
    cityScapeBG,

} from '../bigStyle';
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

    // creates or destroys liked relationship 
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
            
            if (json.message === 'created') {
                
                props.updateCurrentUserLikes(currentPost.id)
                setLikedPostsCounter(current => current + 1 )

            } else if (json.message === 'deleted') {
                props.updateCurrentUserLikes(currentPost.id)
                setLikedPostsCounter(current => current - 1 )
                
            }
        })

    }
    
    // returns bool if logged user has liked the post being previewed
    const loggedUserLikedPost = () => {
        return props.loggedUser.likedPosts.map(p => p.id).includes(currentPost.id)
    }

    // callback for escape key to leave AR state
    const leaveAR = e => {
        if (e.code === 'Escape') {
            setViewMode('normal')
        }
    }

    // gets Dimensions from img and then uses Set Dimensions hook to save in state
    const getDimensions  = () => {
        // grab image to get scale/dimen
        const img = document.querySelector('#texture');

        // if viewMode != normal the img does not exist , howver, if the image exists we grab natural height and length... view mode always starts as nornal so wecan get the data before switching to ar or 3D
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
        
        // this canvas is created when the state is set to three... the render3D is triggered right after that moment so we can render a 3D canvas in our new canvas
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
        
        // camera controls (declared after camera/canvas) while the variable is not used its presence is required for movement in the 3D viewer
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

    /* when you render a ArJs scene it changes you html tag to full screen,  appends a video element your body, and also turns on your camera
     this helper fn removes the removes the video element and also turns off the camera when leaving AR mode
     its important to have margin-top set to 0  with !important in index.css otherwise arJS will overwrite it with negative effects
     when leaving ar mode.
    */
    const fixArSideEffects = () => {
        const vid = document.querySelector('video')

        if (vid) {

            // remove my appended header
            let appendedHeader = document.querySelector('#appendedHeader');
             if (appendedHeader) appendedHeader.remove()

            if (document.querySelector('video')) {
                 //reset video
            const video = document.querySelector('video');
            const mediaStream = video.srcObject;
            const tracks = mediaStream.getTracks();
            tracks.forEach(track => track.stop());
            video.remove();

                // ar js puts weird styles we need to remove
            let htmlTag = document.querySelector('html')
           
            htmlTag.removeAttribute('class');
            }
        }

    }

    /* ar js in its src code always appends the video tag and spreads it to the body element this cannot be changed w/o editing the src code... you can embedd the video in a Iframe but I opted
        to create a event listner(on component mount) for the esc key to exit... this helper will append a header on the body and place it over the ivdeo so the user knows to press esc to return to normal view
        we have to use setInterval because the video element take a X amount of time to append to the body and will remove the header if it loads first. I dont like set timeout because we dont know how
        long the video will take to mount based on connection speed. The interval clears when the h1 is mounted to the body element.
    */ 
    const appendHeaderForArMode = () => {
        const checkForVideoElement = setInterval(() => {

            let webCamVideo = document.querySelector('video');
            let header = null;
            
            if (webCamVideo) {
                if (!header) {

                    header = document.createElement('h1');
                
                    header.textContent = 'Press Esc to return to normal view';
                    header.style.position = 'fixed';
                    header.style.top = '30px';
                    header.style.left = '100px';
                    header.id = 'appendedHeader';

                    document.querySelector('body').appendChild(header);

                    clearInterval(checkForVideoElement);
                }
                    
            }

        }, 500);

        
    }
          
        
    // useEffect to manage the three viewmodes when they change around
    useEffect(() => { 
        if(viewMode === 'three') render3D(dimensions.width, dimensions.height) 

        if (viewMode !== 'ar') fixArSideEffects()
    
        if (viewMode === 'ar') appendHeaderForArMode()
        
    }, [viewMode])

    // if the prop change(normally when the url changes the previewedPost ID) fetch the post using updated props
    // also adds an event listner on the esc key to exit ar Mode(the callback checks viewmode state === ar before running)
    useEffect(() => {
        document.addEventListener("keydown", e => leaveAR(e), false);
        fetchCurrentPost();
        setViewMode('normal');
    }, [props])


    // normal view:
    if (viewMode === 'normal') return(
        <div style ={cityScapeBG}>
        {
            currentPost ? (
                <>
                    <PrimaryNav />

                    <Segment inverted color='grey' style={width75MarginAuto} >
                        <Segment inverted>
                            <Header as='h2' icon textAlign='center' >
                                <Icon name='image' />
                                <Header.Content>{ currentPost.title }</Header.Content>
                            </Header>
                            

                            <NavLink to={ `/home/user/${currentPost.filteredUser.id}` } >
                                <Header color='violet' size='medium' > Post By: {currentPost.filteredUser.username} </Header>
                            </NavLink>
                        </Segment>
                        <Menu pointing style={flexJCenter} >

                            <Menu.Item name='Standard View' onClick={ () => setViewMode('normal')} style = {width40Blue} />
                        
                            <Menu.Item name='Canvas View' onClick={ () => prep3D()} style = {width40Blue} />
                        
                            <Menu.Item name='Open AR View' onClick={ renderARView } style = {width20Red} />
    
                        </Menu>
                        <Segment inverted>
                            <img id='texture' src={currentImg} style ={widthIs100} />
                        </Segment>
                        <Segment inverted>
                            <h3>
                                {currentPost.body}
                            </h3>
                        </Segment>
                        {
                            loggedUserLikedPost() ? (
                                <Button as='div' labelPosition='right' onClick={ () => likePost() } style={widthIs100}  >
                                    <Button color='black' style={widthIs100}>
                                        <Icon name='heart' />
                                            Unlike
                                    </Button>
                                    <Label as='a' basic color='red' pointing='left'>
                                        {likedPostsCounter}
                                     </Label>
                                </Button>
                            ) : (
                                <Button as='div' labelPosition='right'style={widthIs100}  onClick={ () => likePost() }>
                                    <Button color='red'  style={widthIs100}>
                                        <Icon name='heart' />
                                            Like
                                    </Button>
                                    <Label as='a' basic color='red' pointing='left'>
                                        {likedPostsCounter}
                                     </Label>
                                </Button>
                            )
                        }   
                            <CommentZone loggedUser={props.loggedUser} comments={currentPost.comments} postID={currentPost.id} setCurrentPost={ setCurrentPost } />
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
                <a-box src={ currentImg } position ='0 0 -2' depth = { dimensions.height / 256 } width={dimensions.width / 320} height='0.035'> </a-box>
            </a-marker>
        </a-scene> 
     
    )
    // view mode for three
    if (viewMode === 'three') return (
        
        <div style ={cityScapeBG}>
            
            <PrimaryNav />

            <Segment inverted color='grey' style={width75MarginAuto} >
                <Segment inverted>
                    <Header as='h2' icon textAlign='center' >
                        <Icon name='image' />
                        <Header.Content>{ currentPost.title }</Header.Content>
                    </Header>
                            

                    <NavLink to={ `/home/user/${currentPost.filteredUser.id}` } >
                            <Header color='violet' size='medium' > Post By: {currentPost.filteredUser.username} </Header>
                    </NavLink>
                    </Segment>
                </Segment>
            

            <Segment inverted color='grey' style={width75MarginAuto}>

                <Menu pointing  style={flexJCenter}>
                    <Menu.Item name='Standard View' onClick={ () => setViewMode('normal')} style = {width40Blue} />

                    <Menu.Item name='Canvas View' onClick={ () => prep3D()} style = {width40Blue} />
                    
                    <Menu.Item name='Open AR View' onClick={ renderARView } style = {width20Red} />
    
                </Menu>
                <canvas id="k" style={widthIs100} />
            </Segment>
        </div>
    
    )
}


const msp = state => ({ loggedUser: state.user.user, reduxLikedPosts: state.user.user.likedPosts });
const mdp = dispatch => ({ updateCurrentUserLikes: (newLikeID) => dispatch(updateUserLikes(newLikeID)) });

export default connect(msp, mdp)(ShowPost);