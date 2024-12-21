import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  -5, 5, 5, -5, -1, 1
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color(0x110e07);

const updateCamera = () => {
  const aspect = window.innerWidth / window.innerHeight;

  const viewSize = 4;
  if (aspect >= 1) {
    camera.left = -viewSize * aspect;
    camera.right = viewSize * aspect;
    camera.top = viewSize;
    camera.bottom = -viewSize;
  } else {
    camera.left = -viewSize;
    camera.right = viewSize;
    camera.top = viewSize / aspect;
    camera.bottom = -viewSize / aspect;
  }

  camera.updateProjectionMatrix();
};

updateCamera();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateCamera();
});

const e = Math.E;
const pi = Math.PI;
let a = 0;
let forward = true;

const geometry = new THREE.BufferGeometry();
const material = new THREE.LineBasicMaterial({ color: 0xfdcb58 });
const line = new THREE.Line(geometry, material);
scene.add(line);

const updateCurve = () => {
  const points = [];
  const step = 0.008;

  // left anchor
  points.push(new THREE.Vector3(-10, 1.44, 0));

  for (let x = -1.77; x <= 1.77; x += step) {
    try {
      const y =
        Math.pow(Math.abs(x), 2 / 3) +
        (e / 3) * Math.sqrt(Math.max(0, pi - x ** 2)) * Math.sin(a * pi * x);
      points.push(new THREE.Vector3(x, y, 0));
    } catch {
      // math errors
    }
  }

  // right anchor
  points.push(new THREE.Vector3(10, 1.4, 0));

  const vertices = new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]));
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeBoundingBox(); // Recalcula los límites
};


// animation
const animate = () => {
  if (a >= 8 && forward) {
    forward = false;
  }

  if (a <= -8 && !forward) {
    forward = true;
  }

  if (forward) {
    a += 0.04;
  } else {
    a -= 0.04;
  }

  updateCurve();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

// init
updateCurve();
animate();

// force responsive
window.addEventListener('resize', () => {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = -5 * aspect;
  camera.right = 5 * aspect;
  camera.top = 5;
  camera.bottom = -5;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}); 
