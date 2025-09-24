/**
 * Minimal Three.js implementation for the 3D building game
 * This provides the basic classes and functionality needed
 */

// Basic Vector3 class
class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  
  setScalar(scalar) {
    this.x = this.y = this.z = scalar;
    return this;
  }
  
  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }
  
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }
  
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }
  
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }
  
  normalize() {
    const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    if (length !== 0) {
      this.x /= length;
      this.y /= length;
      this.z /= length;
    }
    return this;
  }
  
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
  
  applyAxisAngle(axis, angle) {
    // Rotate vector around axis by angle
    // Simplified implementation using Rodrigues' rotation formula
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const oneMinusCos = 1 - cos;
    
    const dot = this.x * axis.x + this.y * axis.y + this.z * axis.z;
    
    const rx = this.x * cos + (axis.y * this.z - axis.z * this.y) * sin + axis.x * dot * oneMinusCos;
    const ry = this.y * cos + (axis.z * this.x - axis.x * this.z) * sin + axis.y * dot * oneMinusCos;
    const rz = this.z * cos + (axis.x * this.y - axis.y * this.x) * sin + axis.z * dot * oneMinusCos;
    
    this.x = rx;
    this.y = ry;
    this.z = rz;
    
    return this;
  }
}

// Basic Color class
class Color {
  constructor(color) {
    this.r = 1;
    this.g = 1;
    this.b = 1;
    if (typeof color === 'number') {
      this.setHex(color);
    }
  }
  
  setHex(hex) {
    this.r = ((hex >> 16) & 255) / 255;
    this.g = ((hex >> 8) & 255) / 255;
    this.b = (hex & 255) / 255;
    return this;
  }
  
  multiplyScalar(scalar) {
    this.r *= scalar;
    this.g *= scalar;
    this.b *= scalar;
    return this;
  }
}

// Basic Object3D class
class Object3D {
  constructor() {
    this.position = new Vector3();
    this.rotation = new Vector3();
    this.scale = new Vector3(1, 1, 1);
    this.children = [];
    this.parent = null;
    this.castShadow = false;
    this.receiveShadow = false;
  }
  
  add(object) {
    if (object && object !== this) {
      if (object.parent !== null) {
        object.parent.remove(object);
      }
      object.parent = this;
      this.children.push(object);
    }
    return this;
  }
  
  remove(object) {
    const index = this.children.indexOf(object);
    if (index !== -1) {
      object.parent = null;
      this.children.splice(index, 1);
    }
    return this;
  }
  
  traverse(callback) {
    callback(this);
    for (let child of this.children) {
      child.traverse(callback);
    }
  }
  
  setScalar(scalar) {
    this.scale.setScalar(scalar);
    return this;
  }
}

// Basic Geometry classes
class BoxGeometry {
  constructor(width = 1, height = 1, depth = 1) {
    this.width = width;
    this.height = height;
    this.depth = depth;
  }
  
  dispose() {
    // Cleanup method
  }
}

class PlaneGeometry {
  constructor(width = 1, height = 1, widthSegments = 1, heightSegments = 1) {
    this.width = width;
    this.height = height;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;
    
    // Mock attributes for ground noise
    this.attributes = {
      position: {
        count: (widthSegments + 1) * (heightSegments + 1),
        setY: function(i, y) {
          // Mock implementation
        },
        needsUpdate: false
      }
    };
  }
  
  computeVertexNormals() {
    // Mock implementation
  }
  
  dispose() {
    // Cleanup method
  }
}

class SphereGeometry {
  constructor(radius = 1, widthSegments = 32, heightSegments = 16) {
    this.radius = radius;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;
  }
  
  dispose() {
    // Cleanup method
  }
}

class ConeGeometry {
  constructor(radius = 1, height = 1, radialSegments = 8) {
    this.radius = radius;
    this.height = height;
    this.radialSegments = radialSegments;
  }
  
  dispose() {
    // Cleanup method
  }
}

// Basic Material classes
class Material {
  constructor() {
    this.color = new Color(0xffffff);
    this.transparent = false;
    this.opacity = 1.0;
  }
  
  dispose() {
    // Cleanup method
  }
}

class MeshLambertMaterial extends Material {
  constructor(parameters = {}) {
    super();
    if (parameters.color !== undefined) {
      this.color = new Color(parameters.color);
    }
    if (parameters.transparent !== undefined) {
      this.transparent = parameters.transparent;
    }
    if (parameters.opacity !== undefined) {
      this.opacity = parameters.opacity;
    }
  }
}

// Basic ShaderMaterial with minimal implementation
class ShaderMaterial extends Material {
  constructor(parameters = {}) {
    super();
    this.uniforms = parameters.uniforms || {};
    this.vertexShader = parameters.vertexShader || '';
    this.fragmentShader = parameters.fragmentShader || '';
    this.side = parameters.side || 0;
  }
}

// Basic Mesh class
class Mesh extends Object3D {
  constructor(geometry, material) {
    super();
    this.geometry = geometry;
    this.material = material;
    this.isMesh = true;
  }
}

// Basic Group class
class Group extends Object3D {
  constructor() {
    super();
    this.isGroup = true;
  }
}

// Basic Scene class
class Scene extends Object3D {
  constructor() {
    super();
    this.fog = null;
    this.isScene = true;
  }
}

// Basic Camera classes
class Camera extends Object3D {
  constructor() {
    super();
    this.isCamera = true;
  }
  
  updateProjectionMatrix() {
    // Mock implementation
  }
  
  lookAt(x, y, z) {
    if (typeof x === 'object') {
      // Vector3 passed
      return this.lookAt(x.x, x.y, x.z);
    }
    // Simple look-at implementation (mock)
    // In a real implementation, this would set the rotation to look at the target
    console.debug('Camera looking at:', x, y, z);
  }
}

class PerspectiveCamera extends Camera {
  constructor(fov = 50, aspect = 1, near = 0.1, far = 2000) {
    super();
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
  }
}

// Basic Light classes
class Light extends Object3D {
  constructor(color = 0xffffff, intensity = 1) {
    super();
    this.color = new Color(color);
    this.intensity = intensity;
    this.isLight = true;
  }
}

class AmbientLight extends Light {
  constructor(color, intensity) {
    super(color, intensity);
    this.isAmbientLight = true;
  }
}

class DirectionalLight extends Light {
  constructor(color, intensity) {
    super(color, intensity);
    this.shadow = {
      mapSize: { width: 512, height: 512 },
      camera: {
        near: 0.5,
        far: 500,
        left: -10,
        right: 10,
        top: 10,
        bottom: -10
      }
    };
    this.isDirectionalLight = true;
  }
}

// Basic Fog class
class Fog {
  constructor(color = 0xffffff, near = 1, far = 1000) {
    this.color = new Color(color);
    this.near = near;
    this.far = far;
  }
}

// Basic WebGLRenderer class (simplified)
class WebGLRenderer {
  constructor(parameters = {}) {
    this.domElement = document.createElement('canvas');
    this.domElement.width = 800;
    this.domElement.height = 600;
    
    this.shadowMap = {
      enabled: false,
      type: 0
    };
    
    // Get WebGL context
    this.gl = this.domElement.getContext('webgl') || this.domElement.getContext('experimental-webgl');
    if (!this.gl) {
      console.warn('WebGL not supported, using fallback');
      return;
    }
    
    this.gl.clearColor(0.5, 0.3, 0.1, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
  }
  
  setSize(width, height) {
    this.domElement.width = width;
    this.domElement.height = height;
    this.domElement.style.width = width + 'px';
    this.domElement.style.height = height + 'px';
    
    if (this.gl) {
      this.gl.viewport(0, 0, width, height);
    }
  }
  
  setClearColor(color, alpha = 1) {
    if (this.gl) {
      const c = new Color(color);
      this.gl.clearColor(c.r, c.g, c.b, alpha);
    }
  }
  
  render(scene, camera) {
    if (this.gl) {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      // Simplified render - just clear the screen with background color
    }
  }
}

// Basic Clock class
class Clock {
  constructor() {
    this.startTime = Date.now();
    this.oldTime = this.startTime;
    this.elapsedTime = 0;
  }
  
  getDelta() {
    const newTime = Date.now();
    const delta = (newTime - this.oldTime) / 1000;
    this.oldTime = newTime;
    this.elapsedTime += delta;
    return delta;
  }
}

// Animation system
class AnimationMixer {
  constructor(root) {
    this.root = root;
    this.actions = [];
  }
  
  clipAction(clip) {
    return new AnimationAction(clip);
  }
  
  update(deltaTime) {
    // Update animations
  }
}

class AnimationAction {
  constructor(clip) {
    this.clip = clip;
    this.enabled = true;
  }
  
  play() {
    return this;
  }
  
  reset() {
    return this;
  }
  
  setLoop(loop) {
    this.loop = loop;
    return this;
  }
  
  fadeIn(duration) {
    return this;
  }
  
  fadeOut(duration) {
    return this;
  }
}

// GLTF Loader mock
class GLTFLoader {
  constructor() {}
  
  async loadAsync(url) {
    console.log('Loading GLTF model:', url);
    
    // Create a fallback cube model
    const scene = new Group();
    const geometry = new BoxGeometry(1, 1.6, 0.6);
    const material = new MeshLambertMaterial({ color: 0x4a90e2 });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(0, 0.8, 0);
    scene.add(mesh);
    
    return {
      scene: scene,
      animations: []
    };
  }
}

// Constants
const LoopRepeat = 2200;
const LoopOnce = 2201;
const PCFSoftShadowMap = 1;
const BackSide = 1;

// Export as global THREE object
window.THREE = {
  // Core classes
  Vector3,
  Color,
  Object3D,
  Scene,
  Group,
  Mesh,
  
  // Geometries
  BoxGeometry,
  PlaneGeometry,
  SphereGeometry,
  ConeGeometry,
  
  // Materials
  MeshLambertMaterial,
  ShaderMaterial,
  
  // Cameras
  PerspectiveCamera,
  
  // Lights
  AmbientLight,
  DirectionalLight,
  
  // Other
  WebGLRenderer,
  Clock,
  Fog,
  AnimationMixer,
  GLTFLoader,
  
  // Constants
  LoopRepeat,
  LoopOnce,
  PCFSoftShadowMap,
  BackSide
};

console.log('Minimal THREE.js implementation loaded');