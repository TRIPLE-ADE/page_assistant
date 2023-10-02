import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

window.addEventListener("load", function () {
  // Create a scene
  const scene = new THREE.Scene();
  
     // Create white materials for the axes
    const whiteMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

  const xAxis = new THREE.AxesHelper(5);
  const yAxis = new THREE.AxesHelper(5);
  const zAxis = new THREE.AxesHelper(5);

  xAxis.material = whiteMaterial;
  yAxis.material = whiteMaterial;
  zAxis.material = whiteMaterial;

  scene.add(xAxis);
  scene.add(yAxis);
  scene.add(zAxis);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0.8, 1.1, 3);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(200, 200);

  var container = document.getElementById("scene");
  container.appendChild(renderer.domElement);

  // Create an ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Create a directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 3, 3);
  scene.add(directionalLight);

  // Create an OrbitControls instance to control the camera
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Load the GLTF model
  const loader = new GLTFLoader();
  let model;

  loader.load("/scene.gltf", (gltf) => {
    model = gltf.scene;

    // Scale and position the model as needed
    model.scale.set(2, 1, 2); 
    model.position.set(0, 0, 0);

    // Add the model to the scene
    scene.add(model);

    // Play an animation (if your model has animations)
    const mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update the controls
      controls.update();

      // Update the animation mixer
      if (mixer) {
        mixer.update(0.01); // Adjust the time delta as needed
      }

      // Render the scene
      renderer.render(scene, camera);
    };

    animate();
  });
});


let timeoutId;
const buttonExplanations = {
    'button1': 'This is Sign Up button. It can perform a Sign up action.',
    'button2': 'This is the Login button. It can perform a login action.',
    'button3': 'This is the Learn More button. It can provide more information.',
    'button4': 'This is the Contact Us button. It can open a contact form.',
    'button5': 'This is the Explore button. It can navigate to other sections.',
    'button6': 'This is the Get Started button. It can initiate the onboarding process.'
};

const videoContainer = document.getElementById("video-container");
const explanationElm = document.getElementById("explanation");

// Function to reset the video container and clear explanation text
function resetVideoContainer() {
  // Return video container to its normal position
  videoContainer.style.top = "75%";
  videoContainer.style.left = "85%";

  // Clear the explanation text
  explanationElm.textContent = "";

  // Remove the "active" class to hide the video container
  videoContainer.classList.remove("active");
}

// Add click event listeners to each button
Object.keys(buttonExplanations).forEach((buttonId) => {
  const button = document.getElementById(buttonId);
  button.addEventListener("click", function (event) {
    const explanation = buttonExplanations[buttonId];

    const rect = event.target.getBoundingClientRect();
    const buttonPosition = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
    };

    // Move the video container close to the clicked button
    videoContainer.style.top = `${
      buttonPosition.top + buttonPosition.height
    }px`;
    videoContainer.style.left = `${
      buttonPosition.left - 60
    }px`;

    // Show the video container by adding the "active" class
    videoContainer.classList.add("active");

    if (videoContainer.classList.contains("active")) {
      explanationElm.textContent = explanation;

      if ('speechSynthesis' in window) {
        // Add text-to-speech functionality
        const speech = new SpeechSynthesisUtterance(explanation);
        window.speechSynthesis.speak(speech);
    }
    }

    clearTimeout(timeoutId);

    // Set a new timer to reset the video container and clear the text after 1 minute
    timeoutId = setTimeout(resetVideoContainer, 7000);
  });
});
