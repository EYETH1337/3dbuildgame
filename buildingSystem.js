import * as THREE from 'three';

export class BuildingSystem {
  constructor(scene) {
    this.scene = scene;
    this.buildings = [];
    this.materials = this.createMaterials();
  }

  createMaterials() {
    return {
      default: new THREE.MeshLambertMaterial({ color: 0xff6b35 }),
      stone: new THREE.MeshLambertMaterial({ color: 0x8b7d6b }),
      wood: new THREE.MeshLambertMaterial({ color: 0xd2b48c }),
      metal: new THREE.MeshLambertMaterial({ color: 0x708090 }),
      glass: new THREE.MeshLambertMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.7 })
    };
  }

  getMaterial(color) {
    if (typeof color === 'string' && color.startsWith('#')) {
      return new THREE.MeshLambertMaterial({ color: parseInt(color.replace('#', '0x')) });
    }
    return this.materials[color] || this.materials.default;
  }

  buildCube(x, y, z, color = '#ff6b35', size = 1) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = this.getMaterial(color);
    const cube = new THREE.Mesh(geometry, material);
    
    cube.position.set(x, y + size/2, z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    
    this.scene.add(cube);
    this.buildings.push(cube);
    
    return cube;
  }

  buildTower(x, y, z, height = 3) {
    const tower = new THREE.Group();
    
    for (let i = 0; i < height; i++) {
      const size = Math.max(0.5, 1.5 - i * 0.2);
      const geometry = new THREE.BoxGeometry(size, 1, size);
      const material = this.materials.stone;
      const block = new THREE.Mesh(geometry, material);
      
      block.position.y = i;
      block.castShadow = true;
      block.receiveShadow = true;
      tower.add(block);
    }
    
    tower.position.set(x, y, z);
    this.scene.add(tower);
    this.buildings.push(tower);
    
    return tower;
  }

  buildWall(x1, y1, z1, x2, y2, z2) {
    const distance = Math.sqrt((x2-x1)**2 + (z2-z1)**2);
    const segments = Math.ceil(distance);
    const wall = new THREE.Group();
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = x1 + (x2 - x1) * t;
      const z = z1 + (z2 - z1) * t;
      
      const geometry = new THREE.BoxGeometry(1, 2, 0.5);
      const material = this.materials.stone;
      const block = new THREE.Mesh(geometry, material);
      
      block.position.set(x, y1 + 1, z);
      block.castShadow = true;
      block.receiveShadow = true;
      wall.add(block);
    }
    
    this.scene.add(wall);
    this.buildings.push(wall);
    
    return wall;
  }

  buildPyramid(x, y, z, size = 2) {
    const pyramid = new THREE.Group();
    const levels = size + 1;
    
    for (let level = 0; level < levels; level++) {
      const levelSize = (levels - level) * 0.8;
      const geometry = new THREE.BoxGeometry(levelSize, 0.8, levelSize);
      const material = this.materials.stone;
      const block = new THREE.Mesh(geometry, material);
      
      block.position.y = level * 0.8;
      block.castShadow = true;
      block.receiveShadow = true;
      pyramid.add(block);
    }
    
    pyramid.position.set(x, y, z);
    this.scene.add(pyramid);
    this.buildings.push(pyramid);
    
    return pyramid;
  }

  buildHouse(x, y, z) {
    const house = new THREE.Group();
    
    // Base
    const baseGeom = new THREE.BoxGeometry(3, 2, 3);
    const baseMesh = new THREE.Mesh(baseGeom, this.materials.wood);
    baseMesh.position.y = 1;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    house.add(baseMesh);
    
    // Roof
    const roofGeom = new THREE.ConeGeometry(2.2, 1.5, 4);
    const roofMesh = new THREE.Mesh(roofGeom, this.materials.stone);
    roofMesh.position.y = 2.75;
    roofMesh.rotation.y = Math.PI / 4;
    roofMesh.castShadow = true;
    house.add(roofMesh);
    
    house.position.set(x, y, z);
    this.scene.add(house);
    this.buildings.push(house);
    
    return house;
  }

  clearAll() {
    this.buildings.forEach(building => {
      this.scene.remove(building);
      if (building.geometry) building.geometry.dispose();
      if (building.material) building.material.dispose();
    });
    this.buildings = [];
  }
}