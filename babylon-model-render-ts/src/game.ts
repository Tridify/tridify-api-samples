import {
  Engine,
  Scene,
  SceneLoader,
} from 'babylonjs';
import 'babylonjs-loaders';
import 'babylonjs-materials';

import { loadModel } from './modelUtil'

export default class Game {
  // Public members
  public engine: Engine;
  public canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('renderCanvas');
  public scene: Scene = null;

  // Private members
  private _tridifyIfcUID: string;

  createEnvironment(scene: Scene) {
    scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
    })
  }

  /**
   * Constructor
   */
  constructor() {
    // Create engine
    this.engine = new Engine(this.canvas, true, {
      // Options
    });

    // Minimal hash routing. Use the hash from conversion service to open different models.
    const conversionID = document.location.hash ? window.location.hash.replace("#", "") : null;
    this._tridifyIfcUID = conversionID;

    // Events
    window.addEventListener('resize', () => this.engine.resize());
  }

  /**
   * Runs the game
   */
  public async run() {

    // Load Scene
    await SceneLoader.LoadAsync('./scene/', 'scene.babylon', this.engine).then(async (scene: Scene) => {
      this.scene = scene;

      // Load model
      await loadModel(scene, this._tridifyIfcUID)

      // Create environment
      this.createEnvironment(scene)

      // Attach camera
      this.scene.activeCamera.attachControl(this.canvas, true);

      // Run render loop
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
    });
  }
}
