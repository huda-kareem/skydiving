
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Drawing from './PayloadPhysics';
import physics from './physics';
import * as def from 'lil-gui';

// المشهد
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0d8f0);

// الكاميرا
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5); // بعيدة شوي ومرفوعة

// الرندر
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// إضاءة أساسية قوية
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 7.5);
dirLight.castShadow = true;
scene.add(dirLight);

// إضاءة محيطة
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);
const d=new Drawing(scene);
d.good(1,1,1,false)


// الأنيميشن
function animate() {
  requestAnimationFrame(animate);


  renderer.render(scene, camera);
}
animate();

// تعديل الحجم عند تغيير الشاشة
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
