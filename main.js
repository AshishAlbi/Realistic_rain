import * as THREE from 'three'
let scene, camera, renderer, cloudParticles = [], flash, rain, rainGeo, rainCount = 15000, rainParticles = [];

// Scene 
 scene = new THREE.Scene();
const size ={
  height:window.innerHeight,
  width:window.innerWidth,
}

 camera = new THREE.PerspectiveCamera(60, size.width / size.height,1,1000)
camera.position.z=1;
camera.rotation.x=1.16;
camera.rotation.y=-0.12;
camera.rotation.z=0.27;

const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

// lightning
flash = new THREE.PointLight(0x87CEEB, 30, 500, 1.7);
flash.position.set(200, 300, 100);
scene.add(flash);

let directionalLight = new THREE.DirectionalLight(0xffeedd);
directionalLight.position.set(0, 0, 1);
scene.add(directionalLight);

scene.fog = new THREE.FogExp2(0x11111f, 0.002);

// Rendere
const canvas = document.querySelector('.webgl');
 renderer = new THREE.WebGL1Renderer({ canvas, antialias: true })
renderer.setClearColor(scene.fog.color);
renderer.setSize(size.width, size.height)

// resize scene on screen resize
window.addEventListener("resize", () => {
  size.width = window.innerWidth
  size.height = window.innerHeight
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()
  renderer.setSize(size.width, size.height)
})
let loader = new THREE.TextureLoader();

// Rain
loader.load("./static/raindrop.png", function (texture) {

  rainGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(rainCount * 3);
  const velocities = new Float32Array(rainCount);
  for (let i = 0; i < rainCount; i++) {
      positions[i * 3] = Math.random() * 400 - 200;
      positions[i * 3 + 1] = Math.random() * 500 - 250;
      positions[i * 3 + 2] = Math.random() * 400 - 200;
      velocities[i] = 0;
  }
  rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  rainGeo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));

  let rainMaterial = new THREE.PointsMaterial({
      map:texture,
      size: 0.6,
      transparent: true,
  });
  rain = new THREE.Points(rainGeo, rainMaterial);
  scene.add(rain);
  addClouds()
})

// clouds
function addClouds(){
  loader.load('./static/smoke1.png', function(texture){
    let cloudGeo = new THREE.PlaneGeometry(500,500);
    let cloudMaterial = new THREE.MeshLambertMaterial({
       map: texture,
       transparent: true
     });
   
     for(let p=0; p<25; p++) {
       let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
       cloud.position.set(
         Math.random()*800 -400,
         500,
         Math.random()*500 - 450
       );
       cloud.rotation.x = 1.16;
       cloud.rotation.y = -0.12;
       cloud.rotation.z = Math.random()*360;
       cloud.material.opacity = 0.6;
       cloudParticles.push(cloud)
       scene.add(cloud);
     }
     animate();
   });
}
 
function animate(){
  cloudParticles.forEach(particles=>{
    particles.rotation.z += 0.0005
  })

  // Rain animation
  const positionsAttr = rainGeo.getAttribute('position');
    const velocitiesAttr = rainGeo.getAttribute('velocity');
    for (let i = 0; i < rainCount; i++) {
        velocitiesAttr.array[i] -= 0.01 + Math.random() * 0.01;
        positionsAttr.array[i * 3 + 1] += velocitiesAttr.array[i];
        if (positionsAttr.array[i * 3 + 1] < -200) {
            positionsAttr.array[i * 3 + 1] = 200;
            velocitiesAttr.array[i] = 0;
        }
    }
    positionsAttr.needsUpdate = true;
    velocitiesAttr.needsUpdate = true;

    rain.rotation.y += 0.002;
  
//  lightining flash
  if (Math.random()>0.93||flash.power>100) {
    if(flash.power<100){
      flash.position.set(
        Math.random()*400,
        200+Math.random()*200,
        100
      )
    }
    flash.power=50+Math.random()*500;
  }
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}