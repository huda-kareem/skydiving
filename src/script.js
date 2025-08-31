import * as THREE from 'three';
import Drawing from './PayloadPhysics';
import Physics from './physics';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// --- المشهد ---
const scene = new THREE.Scene();




let materialArray = [];
let texture_ft = new THREE.TextureLoader().load( '/image/px.jpg');
let texture_bk = new THREE.TextureLoader().load( '/image/nx.jpg');
let texture_up = new THREE.TextureLoader().load( '/image/py.jpg');
let texture_dn = new THREE.TextureLoader().load( '/image/ny.jpg');
let texture_rt = new THREE.TextureLoader().load( '/image/pz.jpg');
let texture_lf = new THREE.TextureLoader().load( '/image/nz.jpg');
  
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

for (let i = 0; i < 6; i++)
  materialArray[i].side = THREE.BackSide;
   
let skyboxGeo = new THREE.BoxGeometry( 3000,5000 , 3000);
let skybox = new THREE.Mesh( skyboxGeo, materialArray );
skybox.position.set(0,0,0);
scene.add( skybox );




// --- الكاميرا ---
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000 // توسيع الرؤية لتغطي Skybox
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

const planeSpeed = new THREE.Vector3(3,0,0);
// --- إعداد الفيزياء ---
const physics = new Physics();
physics.windVx = 5;
physics.windVz = 2;
const SCALE = 2;
// --- إنشاء الحمولة ---
const d = new Drawing(scene);
let payLoadDropped=false;
let payloadGroup = d.good(1, 1, 1, physics.parachuteOpen); // حمولة + مظلة
const airPlane = d.plane();
airPlane.position.set(0,2000,0);
if(airPlane&&payloadGroup){
  payloadGroup.position.copy(airPlane.position);
}
//الأزرار
window.addEventListener('keydown',(event)=>{if(event.code==='ArrowDown'){
  payLoadDropped=true;
}if(event.code==='Enter'){physics.parachuteOpen=true;payloadGroup = d.good(1, 1, 1, physics.parachuteOpen);}});

let payloadDroppedInitialized = false;

// --- أنيميشن ---
function animate() {
    requestAnimationFrame(animate);

    // تحريك الطائرة
    if (airPlane) {
        airPlane.position.add(planeSpeed);
        
    }
    

    // تحديث الحمولة
    if (payLoadDropped) {
    if (!payloadDroppedInitialized) {
        payloadGroup.visible = true;
        // تحديد موقع البداية عند الإسقاط من الطائرة
        physics.x = airPlane.position.x;
        physics.y = airPlane.position.y;
        physics.z = airPlane.position.z;
        
        // السماح للفيزياء بالعمل من هذه اللحظة
        payloadDroppedInitialized = true;
    }
    physics.update();
    payloadGroup.position.set(physics.x, physics.y, physics.z);
} else {
    payloadGroup.position.copy(airPlane.position);
    payloadGroup.visible = false;
}
    // متابعة الكاميرا
    if (payloadGroup) {
        const offset = new THREE.Vector3(4, 3, 6);
        camera.position.copy(payloadGroup.position).add(offset);
        camera.lookAt(payloadGroup.position);
    }

    renderer.render(scene, camera);
}
animate();
// --- ضبط الكاميرا لمتابعة الحمولة ---
    camera.lookAt(payloadGroup.position);

// --- تعديل حجم الشاشة ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
