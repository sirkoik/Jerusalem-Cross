const GROUND = -15;
const DEFAULT_CAMERA_X = 5, DEFAULT_CAMERA_Y = 5, DEFAULT_CAMERA_Z = 5;


var camera, renderer;
var emitter;

var animSpin = true;
var lookAtFace = false;

// scene and camera.
var scene = new THREE.Scene();
//camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//camera = new THREE.OrthographicCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var aspect = window.innerWidth / window.innerHeight;
var width = 25;
var height = width / aspect;



var camera = new THREE.OrthographicCamera( width / -2, width / 2, height / 2, height / -2, 0, 100 );
//camera.position.z = 0;
//camera.position = new THREE.Vector3(0,1,0);
camera.position.set( DEFAULT_CAMERA_X, DEFAULT_CAMERA_Y, DEFAULT_CAMERA_Z );


//console.log(camera.position);

// orbit controls

var controls = new THREE.OrbitControls(camera);
controls.enableDamping = true;
controls.enableKeys = true;
controls.enableDamping = true;
controls.dampingFactor = 1;
controls.minDistance = 10;
controls.maxDistance = 100;


//controls.minZoom = 10;
//controls.maxZoom = 100;

//console.log(camera.position);

//controls.maxPolarAngle = Math.PI / 2; // can't pivot below the floor plane.

//controls.autoRotate = true;

// renderer with better shadow map
renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color( 0x7851A9 );


// add distance fog
scene.fog = new THREE.Fog(0x000000, 10, 80);


// add ambient light
var light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);    


// add ground plane, receiving shadow from object that cast(s)Shadow
var geometry = new THREE.PlaneGeometry(300, 300, 100, 100);
var material = new THREE.MeshStandardMaterial({color: 0xC0C0C0, side: THREE.DoubleSide});

var plane = new THREE.Mesh(geometry, material);
//scene.add(plane);
plane.position.y = GROUND;
plane.rotation.x = Math.PI / 2;
plane.receiveShadow = true;    


// add spotlight that casts shadow onto objects that recieve it
var spotLight = new THREE.SpotLight(0xffffff);

//spotLight.position.set(5, 30, 3);
spotLight.position.set(5, 0, 30);
spotLight.castShadow = true;
spotLight.shadow.radius = 3; // makes the edge blurrier at the expense of making it look like copies
spotLight.penumbra = 0.5;
spotLight.intensity = 1;

// make higher res
// = 1024 is faster, but edges are more jagged looking
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;

scene.add(spotLight);

// add spotlight helper
//var spotLightHelper = new THREE.SpotLightHelper(spotLight);
//scene.add(spotLightHelper);


// cube light
var cubeLight = new THREE.PointLight(0xffffff, 1, 100);
scene.add(cubeLight);


// add axis helper
//        var axesHelper = new THREE.AxesHelper(15);
//        scene.add(axesHelper);    


// load CISSP crossCube model
var crossCube;

var loader = new THREE.GLTFLoader();
loader.load('models/jerusalem-cube-from-cross-2.glb',
function(gltf) {
    // loader callback

    // add gltf scene and make crossCube cast shadow from light
    
    scene.add(gltf.scene);
    crossCube = scene.getObjectByName('Cube777');
    //crossCube.castShadow = true;
    crossCube.receiveShadow = true;
    crossCube.material.fog = false; // Makes it so the crossCube isn't affected by distance fog.

    crossCube.material = new THREE.MeshPhysicalMaterial({color: 0xffd700});
    
    crossCube.scale.set(0.3, 0.3, 0.3);
    crossCube.position.set(0, 0, 0);
    //crossCube.
    
    //loadCandle();
    animate();


}, undefined, function(error) {
        console.error(error);
});

var ctr= 0;
var flameCtr = 0;

var rotateDeg = 0.0;

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    // spin / rotate only if unpaused
    if (animSpin) {
        rotateDeg += 0.2; 
        crossCube.rotation.y = 2 * Math.PI * rotateDeg / 360;
        
        //if (Math.floor(rotateDeg) % 90 == 0) 
        //console.log(rotateDeg);
        
        //crossCube.rotation.y = Math.PI / 4;
        //crossCube.rotation.y += Math.PI / 1000;
        //console.log(crossCube.rotation.y % (Math.PI / 2))
        //if ( crossCube.rotation.y % (Math.PI / 2) == 0 ) alert('at 0');
        //crossCube.rotation.z += 0.01;
        //crossCube.rotation.x = 1 * Math.sin(ctr * .2);
        //crossCube.rotation.y += 0.01;

        // vertical bobber function
        //crossCube.position.y = 4 * Math.sin(ctr);
        //crossCube.position.z = 4 * Math.sin(ctr);
        
        ctr = ctr + 0.02;
    } 

    //flameOuter.material.opacity = 1.4 + Math.sin(ctr * 10);
    //flameOuter.material.opacity = 0.8;
    //flameOuter.rotation.x = 0.1 * Math.sin(flameCtr*5);
    //flameOuter.rotation.y = 0.1 * Math.sin(flameCtr*5);
    
    //flameCtr = flameCtr + 0.02;
    
    renderer.render(scene, camera);
}

// Interactive
document.querySelector('#look-at-face').onclick = function(e) {
    if (!lookAtFace) {
        crossCube.rotation.y = 0;
        animSpin = false;
        camera.position.set( 0, 0, 5 );
        
        this.textContent = 'Rotating view';
        
    } else {
        animSpin = true;
        camera.position.set( DEFAULT_CAMERA_X, DEFAULT_CAMERA_Y, DEFAULT_CAMERA_Z );
        
        this.textContent = 'Face-on view';
    }
    
    lookAtFace = !lookAtFace;
}

document.querySelector('#pause').onclick = function(e) {
    animSpin = !animSpin;
}

document.querySelector('#credits-link').onclick = function(e) {
    e.preventDefault();
    document.querySelector('.credits-container').style.display = 'flex';
}

document.querySelector('.credits-container').onclick = function() {
    this.style.display = 'none';
}

// prevent credits screen from closing when clicking a link within.
document.querySelector('.credits-container a').onclick = function(e) {
    e.stopPropagation();
}    


// update on resize
window.onresize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// disable iOS Safari scrolling / bouncing effects when trying to pan.
// https://stackoverflow.com/questions/7768269/ipad-safari-disable-scrolling-and-bounce-effect
function preventDefault(e) { e.preventDefault(); }
document.body.addEventListener('touchmove', preventDefault, { passive: false });