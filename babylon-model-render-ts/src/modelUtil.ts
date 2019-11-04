import {
  Scene,
  SceneLoader,
  StandardMaterial,
  PBRMaterial,
  AbstractMesh,
  Mesh,
} from '@babylonjs/core';

import "@babylonjs/loaders/glTF"

export async function loadModel(scene: Scene, uid: string) {
  const myUrls = await fetchGltfUrls(uid);
  await myUrls.forEach(async (url: string) => {
    await SceneLoader.ImportMeshAsync("", "", url, scene, null, '.gltf').then((result: Scene) => {
      applyPbrMaterials(scene, result.meshes)
    });

  })
}

async function applyPbrMaterials(scene: Scene, meshes: Array<AbstractMesh>) {
  meshes.forEach((mesh: AbstractMesh) => {
    if (mesh.material) {
      const serialized = mesh.material.serialize();
      const newMat = StandardMaterial.Parse(serialized, scene, '')
      const meshmat = mesh.material as PBRMaterial
      newMat.diffuseColor = meshmat.albedoColor;
      const pbr = PBRMaterial.Parse(serialized, scene, '')
      pbr.twoSidedLighting = true;

      if(mesh.material instanceof PBRMaterial) {
        pbr.albedoColor = mesh.material.albedoColor;
        pbr.useAlphaFromAlbedoTexture = true;
        pbr.metallic = 0;
      }

      if(mesh instanceof Mesh) {
        mesh.material = pbr
      }
    }
  });

  return meshes;
}

async function fetchGltfUrls(tridifyIfcUID: string) {
  const gltfWithoutIfcSpaces = (url: string) => {
    var baseUrl = url.split('?')[0]
    return baseUrl.endsWith('.gltf') && !baseUrl.endsWith('IfcSpace.gltf')
  }

  const response = await fetch(`https://ws.tridify.com/api/shared/conversion/${tridifyIfcUID}`);
  return await response.json().then((data: any) => (
    data.ColladaUrls.filter((x: string) => x.split('?')[0].endsWith('.gltf')).filter(gltfWithoutIfcSpaces)
  ));
}