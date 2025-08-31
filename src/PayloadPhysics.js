// PayloadPhysics.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

class Drawing {
  constructor(scene) {
    this.scene = scene; 
    this.model = null;
  }

  
plane() {
  const group = new THREE.Group();
  group.position.set(0, 0, 0);
  this.scene.add(group);

  const loader = new GLTFLoader();
  loader.load(
    '/models/c17.glb',
    (gltf) => {
      this.model = gltf.scene;
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

      // أضف الطائرة للـ group بدل المشهد
      group.add(this.model);
    },
    undefined,
    (error) => {
      console.error('في مشكلة بالتحميل:', error);
    }
  );

  return group;
}good(x, y, z, openParachte) {
  const group = new THREE.Group();
  group.position.set(0, 0, 0);
  this.scene.add(group);

  // 🟫 المكعب (دائمًا موجود)
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('/image/WOOD.jpg');
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, -2.5, 0); // ثابت تحت
  group.add(cube);

  // 🎈 التعامل مع المظلة فقط
  if (openParachte) {
    // مظلة مؤقتة (placeholder)
    const placeholder = new THREE.Mesh(
      new THREE.SphereGeometry(2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    );
    placeholder.name = "parachute"; 
    group.add(placeholder);

    // تحميل المظلة GLTF
    const loader = new GLTFLoader();
    loader.load(
      '/models/c14.glb',
      (gltf) => {
        const parachute = gltf.scene;
        parachute.scale.set(3, 2, 3);
        parachute.position.set(0, 0, 0);
        parachute.rotation.y = Math.PI / 2;
        parachute.name = "parachute";

        // تبديل placeholder بالمظلة الحقيقية
        const oldPara = group.getObjectByName("parachute");
        if (oldPara) group.remove(oldPara);
        group.add(parachute);
      },
      undefined,
      (error) => {
        console.error('في مشكلة بتحميل المظلة:', error);
      }
    );
  } else {
    // إذا false → نحذف المظلة فقط
    const oldParachute = group.getObjectByName("parachute");
    if (oldParachute) {
      group.remove(oldParachute);
    }
  }

  return group;
}}


export default Drawing;