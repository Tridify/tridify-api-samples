import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector"; // This is for babylon inspector (optional)
import { Engine, Scene, ArcRotateCamera, TransformNode, Vector3, DirectionalLight } from "@babylonjs/core";
  
import { GltfLoader, ApiClient, DTO } from '@tridify/viewer-core';

  // Get canvas from index.html file
  const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('renderCanvas');

  // Create engine
  const engine: Engine = new Engine(canvas, true, {
      // Options
  });

  // Create new Scene
  const scene: Scene = new Scene(engine);

  const createScene = async function () {

    // Minimal hash routing. Use the hash from conversion service to open different models.
    const conversionID: string = document.location.hash ? window.location.hash.replace("#", "") : "";

    // Attach camera
    const camera = new ArcRotateCamera('ArcRotateCamera', 0, -Math.PI / 2, 0, Vector3.Zero(), scene, true);
    scene.activeCamera = camera;
    scene.activeCamera.attachControl(canvas, true);

    // Create environment
    scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
    })

    // Load Tridify model data by routing hash
    const modelData: DTO.PublishedLinkDTO | null = await ApiClient.getPublishedLink(conversionID).catch(x => x)
    console.log(modelData)

    // Load Models from model data urls
    const modelNode = await GltfLoader.loadGltfFiles(scene, modelData ? modelData.PostProcessedFiles : []);
    console.log(modelNode);

    // Frame scene so that models are properly in view
    //Utilities.frameScene(scene, camera, modelNode.TransformNode.getChildMeshes());
    
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

