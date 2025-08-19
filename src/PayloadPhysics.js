// PayloadPhysics.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

class Drawing {
  constructor(scene) {
    this.scene = scene; 
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

  const group = new THREE.Group();
  group.position.set(0,0,0);
  this.scene.add(group);

  // 2. نضيف الحمولة (مكعب خشب)
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('/image/WOOD.jpg');
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, -2.5, 0); // المكعب تحت المظلة
  group.add(cube);

  // 3. نعمل placeholder للمظلة
  const placeholder = new THREE.Mesh(
    new THREE.SphereGeometry(2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
  );
  placeholder.position.set(0, 0, 0);
  group.add(placeholder);

  // 4. نحمل المظلة GLTF
  const loader = new GLTFLoader();
  loader.load(
    '/models/c14.glb',
    (gltf) => {
      const parachute = gltf.scene;
      parachute.scale.set(3, 2, 3);
      parachute.position.set(0, 0, 0);
      parachute.rotation.y = Math.PI / 2;

      // تبديل placeholder بالمظلة الحقيقية
      group.remove(placeholder);
      group.add(parachute);
    },
    undefined,
    (error) => {
      console.error('في مشكلة بتحميل المظلة:', error);
    }
  );
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