// Using global THREE object from CDN
// import * as THREE from 'three';
import { PlayerController, ThirdPersonCameraController } from './rosieControls.js';
import { World } from './world.js';
import { Player } from './player.js';
import { CodeEditor } from './codeEditor.js';
import { BuildingSystem } from './buildingSystem.js';

class DesertCodeBuilder {
  constructor() {
    this.init();
  }

  async init() {
    // Create scene, camera, renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x8B4513, 1);
    document.body.appendChild(this.renderer.domElement);

    // Initialize world
    this.world = new World(this.scene);
    await this.world.init();

    // Initialize player
    this.player = new Player(this.scene);
    await this.player.init();

    // Initialize controllers
    this.playerController = new PlayerController(this.player.model, {
      moveSpeed: 8,
      jumpForce: 12,
      gravity: 25,
      groundLevel: 0.5
    });

    this.cameraController = new ThirdPersonCameraController(
      this.camera, 
      this.player.model, 
      this.renderer.domElement,
      {
        distance: 6,
        height: 3,
        rotationSpeed: 0.003
      }
    );

    // Initialize systems
    this.buildingSystem = new BuildingSystem(this.scene);
    this.codeEditor = new CodeEditor(this.buildingSystem);

    // Setup input handlers
    this.setupInputHandlers();

    // Start game loop
    this.clock = new THREE.Clock();
    this.animate();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupInputHandlers() {
    document.addEventListener('keydown', (event) => {
      if (event.key.toLowerCase() === 'e') {
        this.codeEditor.toggle();
      }
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const deltaTime = this.clock.getDelta();

    // Update controllers
    const cameraRotation = this.cameraController.update();
    this.playerController.update(deltaTime, cameraRotation);

    // Update player animations
    this.player.update(deltaTime, this.playerController);

    // Update world
    this.world.update(deltaTime);

    // Render
    this.renderer.render(this.scene, this.camera);
  }
}

// Start the game
new DesertCodeBuilder();