// Copyright 2021 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Loader } from '@googlemaps/js-api-loader';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const apiOptions = {
  "apiKey": "Coloque aqui a apiKey",  // Insira sua apiKey
  "version": "beta"
};

const mapOptions = {
  "tilt": 0,
  "heading": 0,
  "zoom": 18,  // Zoom do map
  "center": { lat: -23.469915, lng: -47.429800 },  // Coordenadas do Local
  "mapId": "Coloque aqui a mapId"  // Insira a mapId
}

async function initMap() {    
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load()      
  return new google.maps.Map(mapDiv, mapOptions);
}

function initWebGLOverlayView (map) {
  let scene, renderer, camera, loader;

  const webGLOverlayView = new google.maps.WebGLOverlayView();
  
  // onAdd é usado para adicionar sobreposição ao mapa
  webGLOverlayView.onAdd = () => {
    // Configuração da Cena
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 ); // Luz Branca Suave
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0.5, -1, 0.5);
    scene.add(directionalLight);

    // Carregamento do modelo
    loader = new GLTFLoader();
    const source = "pin.gltf";
    loader.load(
      source,
      gltf => {
        gltf.scene.scale.set(15,15,15);
        gltf.scene.rotation.x = 180 * Math.PI/180; // As rotações estão em Radianos
        scene.add(gltf.scene);
      }
    );
  }
  
  // onContextRestored é usado para inicializar objetos, vincular o estado por blinding e WebGL
  webGLOverlayView.onContextRestored = ({gl}) => {
    renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });
    renderer.autoClear = false;

    loader.manager.onLoad = () => {
      renderer.setAnimationLoop(() => {
         map.moveCamera({
          "tilt": mapOptions.tilt,
          "heading": mapOptions.heading,
          "zoom": mapOptions.zoom
        });

        if (mapOptions.tilt < 67.5) {
          mapOptions.tilt += 0.5
        } else if (mapOptions.heading <= 360) {
          mapOptions.heading += 0.2;
        } else {
          renderer.setAnimationLoop(null)
        }
      });
    }
  }
  
  // onDraw é usado pelo WebGL para começar a renderizar o mapa
  webGLOverlayView.onDraw = ({gl, transformer}) => {
    const latLngAltitudeLiteral = {
      lat: mapOptions.center.lat,
      lng: mapOptions.center.lng,
      altitude: 100
    }

    const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

    webGLOverlayView.requestRedraw();
    renderer.render(scene, camera);

    renderer.resetState();
  }
  
  webGLOverlayView.setMap(map); // Inicia a sobre posição
}

(async () => {        
  const map = await initMap();
  initWebGLOverlayView(map); // Chama a função para instanciar a sobre posição
})();