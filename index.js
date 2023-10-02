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
    loader.load("/ToWalking.fbx", function (object) {

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
