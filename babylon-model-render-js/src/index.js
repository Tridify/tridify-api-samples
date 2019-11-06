import {
    Engine,
    SceneLoader,
  } from '@babylonjs/core';
  import '@babylonjs/core/Cameras/arcRotateCamera';
  import '@babylonjs/core/scene';
  
  
  import * as Utilities from '@tridify/babylonjs-utilities';

  const run = async () => {

    const canvas = document.getElementById('renderCanvas');

    // Create engine
    const engine = new Engine(canvas, true, {
        // Options
    });

    // Minimal hash routing. Use the hash from conversion service to open different models.
    const conversionID = document.location.hash ? window.location.hash.replace("#", "") : null;

    // Events
    window.addEventListener('resize', () => engine.resize());

    // Load Scene
    await SceneLoader.LoadAsync('./scene/', 'scene.babylon', engine).then(async (scene) => {

      // Load model
      await Utilities.loadModel(scene, conversionID);

      // Create environment
      scene.createDefaultEnvironment({
        createGround: false,
        createSkybox: false,
      })

      // Attach camera
      const camera = Utilities.createOrbitCamera(scene);
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
