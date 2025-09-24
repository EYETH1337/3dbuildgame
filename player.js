// Using global THREE object from CDN
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Player {
  constructor(scene) {
    this.scene = scene;
    this.model = null;
    this.mixer = null;
    this.actions = {};
    this.currentAction = null;
    this.isMoving = false;
    this.isJumping = false;
  }

  async init() {
    const loader = new THREE.GLTFLoader();
    
    try {
      const gltf = await loader.loadAsync('https://play.rosebud.ai/assets/Cube Guy Character.glb?2r8Z');
      this.model = gltf.scene;
      
      // Scale and position the model
      this.model.scale.setScalar(0.8);
      this.model.position.set(0, 0.5, 0);
      
      // Enable shadows
      this.model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Enhance material colors for desert theme
          if (child.material) {
            child.material.color.multiplyScalar(1.1);
          }
        }
      });

      // Setup animations
      if (gltf.animations && gltf.animations.length) {
        this.mixer = new THREE.AnimationMixer(this.model);
        
        gltf.animations.forEach((clip) => {
          const action = this.mixer.clipAction(clip);
          this.actions[clip.name] = action;
        });

        // Set default idle animation
        this.playAnimation('CharacterArmature|CharacterArmature|CharacterArmature|Idle', true);
      }

      this.scene.add(this.model);
    } catch (error) {
      console.error('Error loading player model:', error);
      // Create fallback cube player
      this.createFallbackPlayer();
    }
  }

  createFallbackPlayer() {
    const geometry = new THREE.BoxGeometry(1, 1.6, 0.6);
    const material = new THREE.MeshLambertMaterial({ color: 0x4a90e2 });
    this.model = new THREE.Mesh(geometry, material);
    this.model.position.set(0, 0.8, 0);
    this.model.castShadow = true;
    this.model.receiveShadow = true;
    this.scene.add(this.model);
  }

  playAnimation(name, loop = false) {
    if (!this.mixer || !this.actions[name]) return;

    // Stop current animation
    if (this.currentAction) {
      this.currentAction.fadeOut(0.2);
    }

    // Play new animation
    const action = this.actions[name];
    action.reset();
    action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce);
    action.fadeIn(0.2);
    action.play();
    
    this.currentAction = action;
  }

  update(deltaTime, playerController) {
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }

    // Animation state management
    const wasMoving = this.isMoving;
    const wasJumping = this.isJumping;
    
    this.isMoving = playerController.velocity.x !== 0 || playerController.velocity.z !== 0;
    this.isJumping = !playerController.isOnGround;

    // Choose appropriate animation
    if (this.isJumping && !wasJumping) {
      this.playAnimation('CharacterArmature|CharacterArmature|CharacterArmature|Jump');
    } else if (!this.isJumping && wasJumping) {
      this.playAnimation('CharacterArmature|CharacterArmature|CharacterArmature|Jump_Land');
      setTimeout(() => {
        if (!this.isJumping) {
          if (this.isMoving) {
            this.playAnimation('CharacterArmature|CharacterArmature|CharacterArmature|Run', true);
          } else {
            this.playAnimation('CharacterArmature|CharacterArmature|CharacterArmature|Idle', true);
          }
        }
      }, 300);
    } else if (!this.isJumping) {
      if (this.isMoving && !wasMoving) {
        this.playAnimation('CharacterArmature|CharacterArmature|CharacterArmature|Run', true);
      } else if (!this.isMoving && wasMoving) {
        this.playAnimation('CharacterArmature|CharacterArmature|CharacterArmature|Idle', true);
      }
    }
  }
}