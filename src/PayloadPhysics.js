// PayloadPhysics.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

class Drawing {
  constructor(scene) {
    this.scene = scene; // ناخد المشهد من برّا
    this.model = null;
  }

  plane() {
    const loader = new GLTFLoader();
    loader.load(
      '/models/c17.glb',
      (gltf) => {
        this.model = gltf.scene;
        this.scene.add(this.model);
        this.model.scale.set(0.1, 0.1, 0.1);
        this.model.position.set(0, 0, 0);
        this.model.rotation.y = Math.PI / 2;

        this.model.traverse((child) => {
          if (child.isMesh) {
            if (!child.material) {
              child.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
            }
          }
        });
      },
      undefined,
      (error) => {
        console.error('في مشكلة بالتحميل:', error);
      }
    );
    return this.model;
  }
  parachut() {
    const loader = new GLTFLoader();
    loader.load(
      '/models/c14.glb',
      (gltf) => {
        this.model = gltf.scene;
        this.scene.add(this.model);
        this.model.scale.set(3, 2, 3);
        this.model.position.set(0, 0, 0);
        this.model.rotation.y = Math.PI / 2;

        this.model.traverse((child) => {
          if (child.isMesh) {
            if (!child.material) {
              child.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
            }
          }
        });
        resolve(this.model);
      },
      undefined,
      (error) => {
        console.error('في مشكلة بالتحميل:', error);
      }
    );
   // return this.model;
  }
  good(x,y,z,openParachte){
    if(openParachte){
const group=new THREE.Group();
group.add(this.setposition(0,-2.5,0,this.good(1,1,1,false)));
group.add(this.parachut());
return group;

    }
    else{
    const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
  '/image/WOOD.jpg',
  () => {
    renderer.render(scene, camera);
  },
  undefined,
  (err) => { console.error('Error loading texture', err); }
);
const geometry = new THREE.BoxGeometry(x, y, z);
const material = new THREE.MeshStandardMaterial({ map: texture });
const cube = new THREE.Mesh(geometry, material);
this.scene.add(cube);
return cube;
    }  
}
setposition(x,y,z,model){
  if(model)
    model.position.set(x,y,z);
return model;

}}


export default Drawing;