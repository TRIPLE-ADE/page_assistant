import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

window.addEventListener('load', function () {
    // Create Scene
    const scene = new THREE.Scene()

    // Create white materials for the axes
    const whiteMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    // Add X, Y, and Z axes with white materials
    const xAxis = new THREE.AxesHelper(5);
    const yAxis = new THREE.AxesHelper(5);
    const zAxis = new THREE.AxesHelper(5);

    xAxis.material = whiteMaterial;
    yAxis.material = whiteMaterial;
    zAxis.material = whiteMaterial;

    scene.add(xAxis);
    scene.add(yAxis);
    scene.add(zAxis);

    // Add a light
    const light = new THREE.PointLight(0xffffff, 1000)
    light.position.set(2.5, 7.5, 15)
    scene.add(light)

    // Add a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.8, 1.1, 3)

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(200, 200);

    var container = document.getElementById('scene');
    container.appendChild(renderer.domElement);

    var mixer;
    var modelReady = false;

    // Load our FBX model from the directory
    var loader = new FBXLoader();
    loader.load("./ToWalking.fbx", function (object) {

        // Scale and position the model
        object.scale.set(0.007, 0.007, 0.007)
        object.position.set(0, 0, 0)

        // Start the default animation
        mixer = new THREE.AnimationMixer(object);
        var action = mixer.clipAction(object.animations[0]);
        action.play();

        // Add it to the scene
        scene.add(object);

        modelReady = true;

    });

    // Add animation routine
    var clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);

        // Call the animate on the object
        if (modelReady) mixer.update(clock.getDelta());

        renderer.render(scene, camera);
    }

    animate();
});


let timeoutId;
const buttonExplanations = {
    'button1': 'Sign Up button was clicked. This button can perform a sign-up action.',
    'button2': 'Login button was clicked. This button can perform a login action.',
    'button3': 'Learn More button was clicked. This button can provide more information.',
    'button4': 'Contact Us button was clicked. This button can open a contact form.',
    'button5': 'Explore button was clicked. This button can navigate to other sections.',
    'button6': 'Get Started button was clicked. This button can initiate the onboarding process.'
};

const videoContainer = document.getElementById('video-container');
const explanationElm = document.getElementById('explanation');


// Function to reset the video container and clear explanation text
function resetVideoContainer() {
    // Return video container to its normal position
    videoContainer.style.top = '70%';
    videoContainer.style.left = '90%';

    // Clear the explanation text
    explanationElm.textContent = '';

    // Remove the "active" class to hide the video container
    videoContainer.classList.remove('active');
}

// Add click event listeners to each button
Object.keys(buttonExplanations).forEach(buttonId => {
    const button = document.getElementById(buttonId);
    button.addEventListener('click', function () {
        const explanation = buttonExplanations[buttonId];

        const rect = event.target.getBoundingClientRect();
        const buttonPosition = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
        };

        // Move the video container close to the clicked button
        videoContainer.style.top = `${buttonPosition.top + buttonPosition.height + 10}px`;
        videoContainer.style.left = `${buttonPosition.left + buttonPosition.width / 2 + 10}px`;



        // Show the video container by adding the "active" class
        videoContainer.classList.add('active');

        if (videoContainer.classList.contains('active')) {
            explanationElm.textContent = explanation;
        }

        clearTimeout(timeoutId);

        // Set a new timer to reset the video container and clear the text after 1 minute
        timeoutId = setTimeout(resetVideoContainer, 5000);

    });
});

