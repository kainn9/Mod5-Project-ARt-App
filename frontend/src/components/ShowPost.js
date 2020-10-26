import React, { useState, useEffect, useRef } from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ShowPost = (props) => {
    const artScopeJWT = localStorage.getItem('artScopeJWT');
    const [currentPost, setCurrentPost] = useState(null);
    const [currentImg, setCurrentImg] = useState(null);
    // const [imgWidth, setCurrentWidth] = useState(100);
    // const [imgHeight, setCurrentHeight] = useState(100);   
    const tex = 'https://threejsfundamentals.org/threejs/resources/images/wall.jpg';
    
    const prep3D = () => {
        const img = document.querySelector('#texture')
        const height = img.clientHeight;
        const width = img.clientWidth;
        render3D(width, height)

    }

    const render3D = (sWidth, sHeight) => {

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
              const cube = new THREE.Mesh(geometry, material);
              scene.add(cube);
              
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

    return(
        <>
        <canvas 
            id="c"
            style={{width: '100%'}}
        >


        </canvas>
        {
            currentPost ? (
                <>
                    
                    <h1>{currentPost.title}</h1>
                    <h1>{currentPost.body}</h1>
                    
                    
                    {console.log(`http://localhost:4000/rails${currentPost.featured_image.url.split('rails')[1]}`)}
                    <img 
                        id='texture'
                        src={currentImg} 
                        
                    />
                    <button onClick ={ prep3D }>3d</button>
                </>
                
            ) : (
                <h1>LOADING BRAH</h1>
            )
        }
   
        </>
    )
}

export default ShowPost;