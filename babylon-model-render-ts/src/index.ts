import {
    Engine,
    Scene,
    SceneLoader,
    ArcRotateCamera,
  } from '@babylonjs/core';
  
  import * as Utilities from '@tridify/babylonjs-utilities';

  const run = async () => {
    

    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('renderCanvas');

    // Create engine
    const engine: Engine = new Engine(canvas, true, {
        // Options
    });

    // Minimal hash routing. Use the hash from conversion service to open different models.
    const conversionID: string = document.location.hash ? window.location.hash.replace("#", "") : null;

    // This load Ifc data of the model, you can also use it to get parts you like. loadIfc(conversionID, "decomposition")
    const ifcData = await Utilities.loadIfc(conversionID);

    // Events
    window.addEventListener('resize', () => engine.resize());

    // Load Scene
    await SceneLoader.LoadAsync('./scene/', 'scene.babylon', engine).then(async (scene: Scene) => {

      // Load model
      await Utilities.loadModel(scene, conversionID);

      // Create environment
      scene.createDefaultEnvironment({
        createGround: false,
        createSkybox: false,
      })

      // Attach camera
      const camera: ArcRotateCamera = Utilities.createOrbitCamera(scene);
      scene.activeCamera = camera;
      scene.activeCamera.attachControl(canvas, true);

      // Frame scene so that models are properly in view
      Utilities.frameScene(scene, camera);

      // Run render loop
      engine.runRenderLoop(() => {
        scene.render();
      });
    });
  }

  run();
