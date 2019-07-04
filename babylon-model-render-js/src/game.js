import {
  Engine,
  SceneLoader,
} from 'babylonjs';
import 'babylonjs-loaders';
import 'babylonjs-materials';

import { loadModel } from './modelUtil'

const createEnvironment = (scene) => {
  scene.createDefaultEnvironment({
    createGround: false,
    createSkybox: false,
  })
}

export default class Game {
  /**
   * Constructor
   */
  constructor() {
    this.canvas = document.getElementById('renderCanvas');
    this.scene = null;

    // Create engine
    this.engine = new Engine(this.canvas, true, {
      // Options
    });

    // Minimal hash routing. Use the hash from conversion service to open different models.
    this.conversionID = document.location.hash ? window.location.hash.replace("#", "") : null;

    // Events
    window.addEventListener('resize', () => this.engine.resize());
  }

  async run() {
    // Load Scene
    await SceneLoader.LoadAsync('./scene/', 'scene.babylon', this.engine).then(async (scene) => {
      this.scene = scene;

      // Load model
      await loadModel(scene, this.conversionID)

      // Create environment
      createEnvironment(scene)

      // Attach camera
      this.scene.activeCamera.attachControl(this.canvas, true);

      // Run render loop
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
    });
  }
}
