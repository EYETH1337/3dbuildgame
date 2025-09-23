import * as THREE from 'three';

export class World {
  constructor(scene) {
    this.scene = scene;
    this.time = 0;
  }

  async init() {
    this.setupLighting();
    this.createDesertEnvironment();
    this.createSkybox();
  }

  setupLighting() {
    // Warm golden ambient light
    const ambientLight = new THREE.AmbientLight(0xffa366, 0.4);
    this.scene.add(ambientLight);

    // Main directional light (sun)
    this.sunLight = new THREE.DirectionalLight(0xffaa66, 1.2);
    this.sunLight.position.set(50, 80, 30);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 200;
    this.sunLight.shadow.camera.left = -50;
    this.sunLight.shadow.camera.right = 50;
    this.sunLight.shadow.camera.top = 50;
    this.sunLight.shadow.camera.bottom = -50;
    this.scene.add(this.sunLight);

    // Fill light for shadows
    const fillLight = new THREE.DirectionalLight(0xff8844, 0.3);
    fillLight.position.set(-30, 20, -20);
    this.scene.add(fillLight);

    // Warm fog
    this.scene.fog = new THREE.Fog(0xcc7744, 30, 120);
  }

  createDesertEnvironment() {
    // Desert floor
    const groundGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xd4a574,
      transparent: true,
      opacity: 0.9
    });
    
    // Add some noise to ground vertices
    const positions = groundGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const y = Math.random() * 0.5;
      positions.setY(i, y);
    }
    positions.needsUpdate = true;
    groundGeometry.computeVertexNormals();

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Create desert rocks and formations
    this.createDesertRocks();
  }

  createDesertRocks() {
    const rockMaterial = new THREE.MeshLambertMaterial({ color: 0xa0633d });
    
    // Large formations in background
    for (let i = 0; i < 8; i++) {
      const width = 8 + Math.random() * 12;
      const height = 15 + Math.random() * 25;
      const depth = 6 + Math.random() * 8;
      
      const rockGeometry = new THREE.BoxGeometry(width, height, depth);
      const rock = new THREE.Mesh(rockGeometry, rockMaterial);
      
      const angle = (i / 8) * Math.PI * 2;
      const distance = 60 + Math.random() * 30;
      rock.position.x = Math.cos(angle) * distance;
      rock.position.z = Math.sin(angle) * distance;
      rock.position.y = height / 2;
      rock.castShadow = true;
      rock.receiveShadow = true;
      
      this.scene.add(rock);
    }

    // Smaller rocks scattered around
    for (let i = 0; i < 15; i++) {
      const size = 1 + Math.random() * 3;
      const rockGeometry = new THREE.BoxGeometry(size, size * 0.8, size);
      const rock = new THREE.Mesh(rockGeometry, rockMaterial);
      
      rock.position.x = (Math.random() - 0.5) * 80;
      rock.position.z = (Math.random() - 0.5) * 80;
      rock.position.y = size * 0.4;
      rock.rotation.y = Math.random() * Math.PI;
      rock.castShadow = true;
      rock.receiveShadow = true;
      
      this.scene.add(rock);
    }
  }

  createSkybox() {
    // Desert sky gradient
    const skyGeometry = new THREE.SphereGeometry(150, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0xff9966) },
        bottomColor: { value: new THREE.Color(0xffcc88) },
        offset: { value: 15 },
        exponent: { value: 0.8 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide
    });

    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(sky);
  }

  update(deltaTime) {
    this.time += deltaTime;
    
    // Subtle sun movement for dynamic shadows
    const sunAngle = this.time * 0.1;
    this.sunLight.position.x = Math.cos(sunAngle) * 50;
    this.sunLight.position.z = Math.sin(sunAngle) * 30;
  }
}