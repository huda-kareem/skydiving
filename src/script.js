import * as THREE from 'three';
import Drawing from './PayloadPhysics';
import Physics from './physics';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GUI from 'lil-gui';

// --- المشهد ---
const scene = new THREE.Scene();

let materialArray = [];
let texture_ft = new THREE.TextureLoader().load('/image/px.jpg');
let texture_bk = new THREE.TextureLoader().load('/image/nx.jpg');
let texture_up = new THREE.TextureLoader().load('/image/py.jpg');
let texture_dn = new THREE.TextureLoader().load('/image/ny.jpg');
let texture_rt = new THREE.TextureLoader().load('/image/pz.jpg');
let texture_lf = new THREE.TextureLoader().load('/image/nz.jpg');

materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

for (let i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide;

let skyboxGeo = new THREE.BoxGeometry(3000, 5000, 3000);
let skybox = new THREE.Mesh(skyboxGeo, materialArray);
skybox.position.set(0, 0, 0);
scene.add(skybox);

// --- الكاميرا ---
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);

// --- الرندر ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- الإضاءة ---
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 7.5);
dirLight.castShadow = true;
scene.add(dirLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

// --- الفيزياء ---
const physics = new Physics();
physics.windVx = 5;
physics.windVz = 2;

// --- الطائرة والحمولة ---
const d = new Drawing(scene);
let payLoadDropped = false;
let payloadGroup = d.good(1, 1, 1, physics.parachuteOpen); // حمولة + مظلة
const airPlane = d.plane();
airPlane.position.set(0, 2000, 0);

if (airPlane && payloadGroup) {
  payloadGroup.position.copy(airPlane.position);
}

let payloadDroppedInitialized = false;

// --- UI (لوحة تحكم) ---
const gui = new GUI();
const controls = {
  gravity: physics.g,
  mass: physics.mass,
  windStrength: 5,
  height:1,
  width:1,
  windDirection: 0, // زاوية بالدرجات
  dropPayload: () => dropPayload(),
  openParachute: () => openParachute(),
  restart: () => resetSimulation(),
};
gui.add(controls, 'height').onChange(() => {

});
gui.add(controls, 'width').onChange(() => {
  
});
gui.add(controls, 'gravity').onChange((val) => {
  physics.g = val;
});
gui.add(controls, 'mass', 1, 100).onChange((val) => {
  physics.mass = val;
});
gui.add(controls, 'windStrength', 0, 50).onChange((val) => {
  physics.windVx = val * Math.cos((controls.windDirection * Math.PI) / 180);
  physics.windVz = val * Math.sin((controls.windDirection * Math.PI) / 180);
});
gui.add(controls, 'windDirection', 0, 360).onChange((val) => {
  physics.windVx = controls.windStrength * Math.cos((val * Math.PI) / 180);
  physics.windVz = controls.windStrength * Math.sin((val * Math.PI) / 180);
});
gui.add(controls, 'dropPayload');
gui.add(controls, 'openParachute');
gui.add(controls, 'restart');

// --- دوال التحكم ---
function dropPayload() {
  if (!payLoadDropped) {
    payLoadDropped = true;
    payloadDroppedInitialized = false;
    payloadGroup.visible = true;
  }
}
function openParachute() {
  if (!physics.parachuteOpen) {
    physics.parachuteOpen = true;

    // تحقق إذا المظلة موجودة بالفعل
    let parachute = payloadGroup.getObjectByName("parachute");
    if (!parachute) {
      // Placeholder مؤقت
      const placeholder = new THREE.Mesh(
        new THREE.SphereGeometry(2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
      );
      placeholder.name = "parachute";
      payloadGroup.add(placeholder);

      // تحميل المظلة GLTF
      const loader = new GLTFLoader();
      loader.load(
        '/models/c14.glb',
        (gltf) => {
          const parachuteMesh = gltf.scene;
          parachuteMesh.scale.set(3, 2, 3);
          parachuteMesh.position.set(0, 0, 0);
          parachuteMesh.rotation.y = Math.PI / 2;
          parachuteMesh.name = "parachute";

          // استبدال placeholder بالمظلة الحقيقية
          const oldPara = payloadGroup.getObjectByName("parachute");
          if (oldPara) payloadGroup.remove(oldPara);
          payloadGroup.add(parachuteMesh);
        },
        undefined,
        (error) => console.error('في مشكلة بتحميل المظلة:', error)
      );
    }
  }
}
  


function resetSimulation() {
    payLoadDropped = false;
    payloadDroppedInitialized = false;

    // إعادة موضع الفيزياء
    physics.x = 0;
    physics.y = 2000;
    physics.z = 0;
    physics.vx = 0;
    physics.vy = 0;
    physics.vz = 0;
    physics.parachuteOpen = false;

    // إعادة موضع الطائرة
    airPlane.position.set(0, 2000, 0);

    // إزالة المظلة القديمة
    if (payloadGroup) {
        const parachute = payloadGroup.getObjectByName("parachute");
        if (parachute) payloadGroup.remove(parachute);
    }

    // إعادة إنشاء الحمولة بدون مظلة
    payloadGroup = d.good(1, 1, 1, physics.parachuteOpen);
    payloadGroup.position.copy(airPlane.position);
    payloadGroup.visible = false;
}

// --- أنيميشن ---
function animate() {
  requestAnimationFrame(animate);

  // تحريك الطائرة
  if (airPlane) {
    airPlane.position.add(new THREE.Vector3(3, 0, 0));
  }

  // تحديث الحمولة
  if (payLoadDropped) {
    if (!payloadDroppedInitialized) {
      payloadGroup.visible = true;
      physics.x = airPlane.position.x;
      physics.y = airPlane.position.y;
      physics.z = airPlane.position.z;
      payloadDroppedInitialized = true;
    }

    physics.update();
    payloadGroup.position.set(physics.x, physics.y, physics.z);

    if (physics.y <= 0) {
      const parachute = payloadGroup.getObjectByName('parachute');
      if (parachute) {
        payloadGroup.remove(parachute);
      }
    }
  } else {
    payloadGroup.position.copy(airPlane.position);
    payloadGroup.visible = false;
  }

  // الكاميرا
  if (payloadGroup) {
    const offset = new THREE.Vector3(4, 3, 6);
    camera.position.copy(payloadGroup.position).add(offset);
    camera.lookAt(payloadGroup.position);
  }

  renderer.render(scene, camera);
}
animate();

// --- تعديل حجم الشاشة ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

