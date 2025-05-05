import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

// Scene setup
let mouseY;
let mouseX;

document.addEventListener('mousemove', function(event) {
  mouseY = event.clientY;
  mouseX = event.clientX;
});

const scene = new THREE.Scene();

const fov = 20;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set(0,0,0);
controls.update();

// Objects


let djdesk;
const gltfLoader = new GLTFLoader();
gltfLoader.load('resources/models/dj_mixer_lowpoly/scene.gltf', (gltf) => {
  const root = gltf.scene;
  scene.add(root);
  djdesk = root.getObjectByName('CONTROLADORDJ');
  console.log('success');
})

const cubeSize = 1;
const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
const mesh2 = new THREE.Mesh(cubeGeo, cubeMat);
scene.add(mesh2);



const color = 0xFFFFFF;
const intensity = 8;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0, 10, 0);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);

camera.position.z = 10;
mesh2.position.x = 2;

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return '#${this.object[this.prop].getHexString()}';
;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

const gui = new GUI();
gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
gui.add(light, 'intensity', 0, 5, 0.01);
gui.add(light.target.position, 'x', -10, 10);
gui.add(light.target.position, 'z', -10, 10);
gui.add(light.target.position, 'y', 0, 10);

function animate() {

  mesh2.rotation.y += 0.005;
  mesh2.rotation.x += 0.005;
  if(djdesk){
    for (const dj of djdesk.children) {
      dj.rotation.y = mouseX / 1000;
      dj.rotation.x = mouseY / 1000;
    }
  }
  renderer.render( scene, camera );

}