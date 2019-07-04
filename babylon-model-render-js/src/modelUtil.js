import {
  SceneLoader,
  StandardMaterial,
  PBRMaterial,
  Mesh,
} from 'babylonjs';

import 'babylonjs-loaders';

export async function loadModel(scene, uid) {
  const myUrls = await fetchGltfUrls(uid);

  await myUrls.forEach(async (url) => {
    await SceneLoader.ImportMeshAsync("", "", url, scene, null, '.gltf').then((result) => {
      applyPbrMaterials(scene, result.meshes)
    });

  })
}

// Nicer materials
async function applyPbrMaterials(scene, meshes) {
  meshes.forEach((mesh) => {
    if (mesh.material) {
      const serialized = mesh.material.serialize();
      const newMat = StandardMaterial.Parse(serialized, scene, '')
      const meshmat = mesh.material
      newMat.diffuseColor = meshmat.albedoColor;
      const pbr = PBRMaterial.Parse(serialized, scene, '')
      pbr.twoSidedLighting = true;

      if(mesh.material instanceof PBRMaterial) {
        pbr.albedoColor = mesh.material.albedoColor;
        pbr.useAlphaFromAlbedoTexture = true;
        pbr.metallic = 0.5;
      }

      if(mesh instanceof Mesh) {
        mesh.material = pbr
      }
    }
  });

  return meshes;
}

async function fetchGltfUrls(tridifyIfcUID) {
  const gltfWithoutIfcSpaces = (url) => {
    var baseUrl = url.split('?')[0]
    return baseUrl.endsWith('.gltf') && !baseUrl.endsWith('IfcSpace.gltf')
  }

  const response = await fetch(`https://ws.tridify.com/api/shared/conversion/${tridifyIfcUID}`);
  return await response.json().then(data => (
    data.ColladaUrls.filter((x) => x.split('?')[0].endsWith('.gltf')).filter(gltfWithoutIfcSpaces)
  ));
}