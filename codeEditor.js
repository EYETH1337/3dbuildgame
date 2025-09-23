export class CodeEditor {
  constructor(buildingSystem) {
    this.buildingSystem = buildingSystem;
    this.isVisible = false;
    this.setupUI();
  }

  setupUI() {
    this.editorElement = document.getElementById('code-editor');
    this.codeInput = document.getElementById('code-input');
    this.runButton = document.getElementById('run-code');
    this.clearButton = document.getElementById('clear-builds');
    this.closeButton = document.getElementById('close-editor');

    // Set default code
    this.codeInput.value = `// Welcome to Desert Code Builder!
// Create buildings with code

// Build a simple cube at position (x, y, z) with color
buildCube(0, 0, 0, '#ff6b35');

// Build a tower at position with height
buildTower(5, 0, 5, 3);

// Build a wall from one point to another
buildWall(-3, 0, -3, 3, 0, -3);

// Build a pyramid at position with size
buildPyramid(-5, 0, 5, 2);`;

    this.runButton.addEventListener('click', () => this.executeCode());
    this.clearButton.addEventListener('click', () => this.clearBuildings());
    this.closeButton.addEventListener('click', () => this.hide());

    // Ctrl+Enter to run code
    this.codeInput.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        this.executeCode();
      }
    });
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    this.isVisible = true;
    this.editorElement.classList.add('visible');
    this.codeInput.focus();
  }

  hide() {
    this.isVisible = false;
    this.editorElement.classList.remove('visible');
  }

  executeCode() {
    const code = this.codeInput.value;
    
    try {
      // Create a safe execution context
      const buildingAPI = {
        buildCube: (x, y, z, color = '#ff6b35') => this.buildingSystem.buildCube(x, y, z, color),
        buildTower: (x, y, z, height = 3) => this.buildingSystem.buildTower(x, y, z, height),
        buildWall: (x1, y1, z1, x2, y2, z2) => this.buildingSystem.buildWall(x1, y1, z1, x2, y2, z2),
        buildPyramid: (x, y, z, size = 2) => this.buildingSystem.buildPyramid(x, y, z, size),
        buildHouse: (x, y, z) => this.buildingSystem.buildHouse(x, y, z),
        console: {
          log: (...args) => console.log('[Building System]', ...args)
        }
      };

      // Execute the code in context
      const executeFunction = new Function(...Object.keys(buildingAPI), code);
      executeFunction(...Object.values(buildingAPI));
      
      console.log('Code executed successfully!');
    } catch (error) {
      console.error('Code execution error:', error);
      alert('Error in code: ' + error.message);
    }
  }

  clearBuildings() {
    this.buildingSystem.clearAll();
  }
}