import * as THREE from 'three';
import Drawing from './PayloadPhysics';
import Physics from './physics';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GUI from 'lil-gui';

// --- المشهد ---
const scene = new THREE.Scene();
// --- الكاميرا ---
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  30000 // توسيع الرؤية لتغطي Skybox
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
airPlane.position.set(0, 4000, 0);

if (airPlane && payloadGroup) {
  payloadGroup.position.copy(airPlane.position);
}

let materialArray = [];
let texture_ft = new THREE.TextureLoader().load( '/image/px.png');
let texture_bk = new THREE.TextureLoader().load( '/image/nx.png');
let texture_up = new THREE.TextureLoader().load( '/image/py.png');
let texture_dn = new THREE.TextureLoader().load( '/image/ny.png');
let texture_rt = new THREE.TextureLoader().load( '/image/pz.png');
let texture_lf = new THREE.TextureLoader().load( '/image/nz.png');
  
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

for (let i = 0; i < 6; i++)
  materialArray[i].side = THREE.BackSide;
   
let skyboxGeo = new THREE.BoxGeometry( 20000,5000 , 20000);
let skybox = new THREE.Mesh( skyboxGeo, materialArray );
skybox.position.y = 2495;
scene.add( skybox );

let payloadDroppedInitialized = false;

// --- UI (لوحة تحكم) ---
const gui = new GUI();
const controls = {
  plane_velocity: physics.vx,
  plane_hieght: physics.y,
  gravity: physics.g,
  mass: physics.mass,
  windStrength: 5,
  height:physics.goodhieght,
  width:physics.goodwidth,
  windDirection: 0, // زاوية بالدرجات
  dropPayload: () => dropPayload(),
  openParachute: () => openParachute(),
  restart: () => resetSimulation(),
};
gui.add(controls, 'plane_velocity').onChange((val) => {
physics.vx = val;
});
gui.add(controls, 'plane_hieght',0,10000).onChange((val) => {
physics.y = val;
});
gui.add(controls, 'height').onChange((val) => {
physics.goodhieght = val;
});
gui.add(controls, 'width').onChange((val) => {
  physics.goodwidth = val;
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
    physics.startTime = Date.now();
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
  physics.startTime = Date.now();
    payLoadDropped = false;
    payloadDroppedInitialized = false;

    // إعادة موضع الفيزياء
    physics.x = 0;
    physics.y = 600;
    physics.z = 0;
    physics.vx = 0;
    physics.vy = 0;
    physics.vz = 0;
    physics.parachuteOpen = false;

    // إعادة موضع الطائرة
    airPlane.position.set(0, 8000, 0);

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

//واجهة العرض
const hud = document.getElementById('hud');
const hudpositionx = document.getElementById('hudpositionx');
const hudpositiony = document.getElementById('hudpositiony');
const hudpositionz = document.getElementById('hudpositionz');
const hudairdentisy = document.getElementById('hudairdentisy');
const hudacceleration = document.getElementById('hudacceleration');


const cursor = {
  x : 0 , 
  y: 0
}
window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / window.innerWidth - 0.5
    cursor.y = - (event.clientY / window.innerHeight - 0.5)
}) ; 

// --- أنيميشن ---
function animate() {
  requestAnimationFrame(animate);

  // تحريك الطائرة
  if (airPlane) {
    airPlane.position.x += 3;
  }

  // تحديث الحمولة
  if (payLoadDropped) {
    if (!payloadDroppedInitialized) {
      payloadGroup.visible = true;
      physics.x = airPlane.position.x;
      physics.z = airPlane.position.z;
      payloadDroppedInitialized = true;
    }
    payloadGroup.position.set(physics.x, physics.y, physics.z);
    physics.update();
            if(physics.y <= physics.hieghtopen){
          openParachute();
        }
    physics.velocity
    hud.textContent = `velocity : ${physics.velocity}`
    hudacceleration.textContent = `Acceleration : ${physics.acceleration}`
    hudpositionx.textContent = `position on x : ${physics.x}`
    hudpositiony.textContent = `position on y : ${physics.y}`
    hudpositionz.textContent = `position on z : ${physics.z}`
    hudairdentisy.textContent = `Air dentisy : ${physics.airDensity(physics.y)}`;

    if (physics.y <= 0) {
      const parachute = payloadGroup.getObjectByName('parachute');
      if (parachute) {
        payloadGroup.remove(parachute);
      }
    }
  } else {
    hud.textContent = `velocity : ${physics.velocity}`
        hudacceleration.textContent = `Acceleration : ${physics.acceleration}`
   hudpositionx.textContent = `position on x : ${airPlane.position.x}`
    hudpositiony.textContent = `position on y : ${physics.y}`
    hudpositionz.textContent = `position on z : ${airPlane.position.z}`
        hudairdentisy.textContent = `Air dentisy : ${physics.airDensity(physics.y)}`


    payloadGroup.position.copy(airPlane.position);
    payloadGroup.visible = false;
  }

  // الكاميرا
  if(payloadGroup)
    { 
      camera.position.x = payloadGroup.position.x +  Math.sin(cursor.x * Math.PI * 2) *130; 
      camera.position.z= payloadGroup.position.z + Math.cos(cursor.x * Math.PI * 2) *130*4 ; 
      camera.position.y = payloadGroup.position.y ; 
      camera.lookAt(new THREE.Vector3(payloadGroup.position.x, payloadGroup.position.y, payloadGroup.position.z)); ; 
    }
    else
    {
      camera.position.x = airplane.position.x   ; 
      camera.position.z= airplane.position.z -3  ; 
      camera.position.y = airplane.position.y +1.8 ; 
      camera.lookAt(new THREE.Vector3(airplane.position.x, airplane.position.y, airplane.position.z)); ; 
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

