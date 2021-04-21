import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, TransformNode, Vector3, DirectionalLight } from "@babylonjs/core";
  
import * as Utilities from '@tridify/babylonjs-utilities';

  // Get canvas from index.html file
  const canvas = document.getElementById('renderCanvas');

  // Create engine
  const engine = new Engine(canvas, true, {
      // Options
  });

  // Create new Scene
  const scene = new Scene(engine);

  const createScene = async function () {

    // Minimal hash routing. Use the hash from conversion service to open different models.
    const conversionID = document.location.hash ? window.location.hash.replace("#", "") : "";

    // Attach camera
    const camera = Utilities.createOrbitCamera(scene);
    scene.activeCamera = camera;
    scene.activeCamera.attachControl(canvas, true);

    // Create environment
    scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
    })

    // Load Tridify model data by routing hash
    const modelData = await Utilities.fetchSharedConversions(conversionID);

    // Load Models from model data urls
    const modelNode = await Utilities.loadMeshGltf(scene, modelData.PostProcessedFiles);

    // Frame scene so that models are properly in view
    Utilities.frameScene(scene, camera, modelNode.TransformNode.getChildMeshes());
    
    // Set default Lights to scene
    const light = new DirectionalLight("DirectionalLight", new Vector3(0, -1, 0), scene);

    // Start render loop for scene to update
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Events
    window.addEventListener('resize', () => engine.resize());
  }

  // Run scene creating function and loads model
  createScene();
