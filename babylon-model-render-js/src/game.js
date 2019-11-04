import {
  Engine,
  SceneLoader,
} from '@babylonjs/core';

import * as Utilities from '@tridify/babylonjs-utilities';

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
    this.camera = null;

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
      await Utilities.loadModel(scene, this.conversionID);

      // Create environment
      createEnvironment(scene)

      // Attach camera
      this.camera = Utilities.createOrbitCamera(this.scene);
      this.scene.activeCamera = this.camera;
      this.scene.activeCamera.attachControl(this.canvas, true);

      // Frame scene so that models are properly in view
      Utilities.frameScene(this.scene, this.camera);

      // Run render loop
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
    });
  }
}
