import React, { useState, useEffect, useRef } from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Segment, Menu, Input, Header, Icon } from 'semantic-ui-react';
import PrimaryNav from './PrimaryNav';
import cityScape from '../images/cityScape.jpg';

const ShowPost = (props) => {
    const AFRAME = window.AFRAME;
    const artScopeJWT = localStorage.getItem('artScopeJWT');
    const [currentPost, setCurrentPost] = useState(null);
    const [currentImg, setCurrentImg] = useState(null);
    const [dimensions, setDimensions] = useState(0);
    const [viewMode, setViewMode] = useState('normal');

    
    

    // const testfn = () => {
    //     AFRAME.registerComponent('canvas', {
    //         schema: {
    //           color: {
    //             default: '#000'
    //           },
    //         },
          
    //         update: function() {
    //           var material = new AFRAME.THREE.MeshBasicMaterial({
    //             color: this.data.color,
    //             wireframe: true
    //           });
          
    //           var geometry = new AFRAME.THREE.BoxGeometry(1, 1, 1);
          
    //           this.el.setObject3D('mesh', new AFRAME.THREE.Mesh(geometry, material));
    //         },
          
    //         remove: function() {
    //           this.el.removeObject3D('mesh');
    //         }
    //       });
    // }
    const renderARView =() => {
        setViewMode('ar')
        const img = document.querySelector('#texture')
        setDimensions({height: img.clientHeight, width: img.clientWidth})
    }
    const prep3D = () => {
        const img = document.querySelector('#texture')
        const height = img.clientHeight;
        const width = img.clientWidth;
        render3D(width, height)
    }

    const render3D = (sWidth, sHeight) => {
        //testfn()
        function main() {
            const canvas = document.querySelector('#c');
            const renderer = new THREE.WebGLRenderer({canvas});
          
            const fov = 70;
            const aspect = 2;  // the canvas default
            const near = 0.1;
            const far = 3000;
            const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            camera.position.z = 2;
          
            const controls = new OrbitControls(camera, canvas);

            const scene = new THREE.Scene();
          
            const boxWidth = sWidth / 100;
            const boxHeight = sHeight / 100;
            const boxDepth = 1;
            const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
          
            //const cubes = [];  // just an array we can use to rotate the cubes
            const loader = new THREE.TextureLoader();
            loader.load(currentImg, (texture) => {
              const material = new THREE.MeshBasicMaterial({
                map: texture,
              });
              const cube = new AFRAME.THREE.Mesh(geometry, material);
              scene.add(cube);
              

              AFRAME.registerComponent('canvas', {
                schema: {
                  color: {
                    default: '#000'
                  },
                },
              
                update: function() {
                
                    
                    
                  var amaterial = new AFRAME.THREE.MeshBasicMaterial({
                    map: texture,
                    wireframe: true
                  });
              
                  var ageometry = new AFRAME.THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
              
                  this.el.setObject3D('mesh', new AFRAME.THREE.Mesh(ageometry));
                },
              
                remove: function() {
                  this.el.removeObject3D('mesh');
                }
              });
              //cubes.push(cube);  // add to our list of cubes to rotate
            });
          
            function resizeRendererToDisplaySize(renderer) {
              const canvas = renderer.domElement;
              const width = canvas.clientWidth;
              const height = canvas.clientHeight;
              const needResize = canvas.width !== width || canvas.height !== height;
              if (needResize) {
                renderer.setSize(width, height, false);
              }
              return needResize;
            }
          
            function render(time) {
              time *= 0.001;
          
              if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
              }
          
            //   cubes.forEach((cube, ndx) => {
            //     const speed = .2 + ndx * .1;
            //     const rot = time * speed;
            //     cube.rotation.x = rot;
            //     cube.rotation.y = rot;
            //   });
          
              renderer.render(scene, camera);
          
              requestAnimationFrame(render);
            }
          
            requestAnimationFrame(render);
          }
          
          main();
    }

    useEffect(() => {

        const fetchConfig = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${artScopeJWT}`
            }
        }

        fetch(`http://localhost:4000/api/v1/posts/${props.postID}`, fetchConfig)
        .then( response => response.json())
        .then(data => {
            setCurrentPost(data)
            setCurrentImg(`http://localhost:4000/rails${data.featured_image.url.split('rails')[1]}`)
        })

        
    }, [])

    if (viewMode === 'normal') return(
        <div style ={{ backgroundImage: `url(${cityScape})`, backgroundRepeat: 'repeat', height: '100%', width: '100%'}}>
        {
            currentPost ? (
                <>
                {/* <button onClick ={ prep3D }>3d</button> */}
                    
                    {/* <h1>{currentPost.title}</h1>
                    <h1>{currentPost.body}</h1> */}
                    

                    <PrimaryNav />
                    <Segment inverted color='grey' style={{ maxWidth: '75%', margin: 'auto'}}>
                    <Header as='h2' icon textAlign='center'>
                        <Icon name='image' />
                        <Header.Content>{currentPost.title}</Header.Content>
                    </Header>
                    <Menu pointing  style={{ display: 'flex', justifyContent: 'center' }}>
                        <Menu.Item
                            style = {{ width: '40%', color: 'blue' }}
                            name='Standard View'
                            
                        />
                        <Menu.Item
                            style = {{ width: '40%', color: 'blue' }}
                            name='Canvas View'
                        />
                        <Menu.Item
                            name='Open AR View'
                            style = {{ width: '20%', color: 'red'}}
                            onClick={ renderARView }
                            
                        />
    
                    </Menu>
                    <img 
                        style ={{maxWidth: '100%'}}
                        id='texture'
                        src={currentImg} 
                        
                    />
                    </Segment >
                    <button onClick ={ () => {
                        setViewMode('ar')
                        const test = document.querySelector('#texture')
                        setDimensions({height: test.clientHeight, width: test.clientWidth})
            
                        
                        }}>AR</button>
                </>
                
            ) : (
                null
            )
        }
   
        </div>
    )

    if (viewMode === 'ar') return (
        <>
        

                
                <a-scene>
                    <a-marker preset="hiro">
                        <a-box src={currentImg} position ='0 0 -2' scale = {`${ dimensions.width / 300 }, 0.2, ${ dimensions.height / 300}` } > </a-box>
                    </a-marker>
                </a-scene>
                <h1>LOL</h1>
               
            
        </>
    )

    if (viewMode === 'three') return (
        <>
            <PrimaryNav />
            <Segment>
            <canvas 
                    id="c"
                    style={{width: '100%', position: 'bottom'}}
                     ></canvas>
            </Segment>
        </>
    )
}
//scale = '4 0.5 4'
export default ShowPost;