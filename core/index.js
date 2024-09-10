import { Camera } from './constructors/Camera';
import { Renderer } from './constructors/Renderer';
import { Scene } from './constructors/Scene';

// Create and export instances of each
const camera = new Camera().getCamera();
const renderer = new Renderer().getRenderer();
const scene = new Scene().getScene();

export { camera, renderer, scene };
