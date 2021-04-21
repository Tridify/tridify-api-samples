import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, TransformNode, Vector3, DirectionalLight } from "@babylonjs/core";
  
import * as Utilities from '@tridify/babylonjs-utilities';

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
    const camera: ArcRotateCamera = Utilities.createOrbitCamera(scene);
    scene.activeCamera = camera;
    scene.activeCamera.attachControl(canvas, true);

    // Create environment
    scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
    })

    // Load Tridify model data by routing hash
    const modelData: SharedConversionsDTO = await Utilities.fetchSharedConversions(conversionID);

    // Load Models from model data urls
    const modelNode: GltfModel = await Utilities.loadMeshGltf(scene, modelData.PostProcessedFiles);

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


  //Model data interfaces
  interface SharedConversionsDTO {
    Conversions: SharedConversionDTO[];
    Configuration: SharedConfigurationDTO;
    LinkEnabled: boolean;
    PostProcessState: string; // TODO: Change to enum
    PostProcessedFiles: string[];
  }
  
  interface SharedConversionDTO {
    Hash: string;
    Files: SharedConversionFileDTO[];
    FileName: string;
  }

  interface SharedConfigurationDTO {
    Tools: ToolsDTO;
    PropertySetNames: string[];
    QuantityNames: string[];
  }

  interface GltfModel {
    TransformNode: TransformNode; // Node for all the merged meshes
    ModelOffset: Vector3; //Model offset
  }

  interface ToolsDTO {
    VRHeadsetMode: boolean;
    ShareViewer: boolean;
    MeasureTool: boolean;
    BimTool: boolean;
    CuttingPlanesTool: boolean;
    WaypointTool: boolean;
    CombinationVisibilityTool: boolean;
    CommentingTool: boolean;
  }
  
  interface SharedConversionFileDTO {
    Url: string;
    Type: string;   // It is ifc group
    Format: string;
    Storey: string;
    overLay: boolean;
    GUID: string;
    FileName: string | undefined;  // undefined for old conversions
  }