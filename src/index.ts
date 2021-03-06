import { GlContext } from "./core/gl-context";
import { Taganka8Scene } from "./scenes/taganka8/taganka8-scene";

import "./index.scss";
import { Point } from "./types/point";
import { GlCamera } from "./core/gl-camera";
import { ProjectionData } from "./types/projection";

const glContext: GlContext = new GlContext("canvas");

const canvasElement: HTMLCanvasElement =
  document.getElementsByTagName("canvas")[0];
canvasElement.addEventListener("mousedown", canvasMouseDown);
canvasElement.addEventListener("mousemove", canvasMouseMove);
canvasElement.addEventListener("mouseleave", canvasDragEnd);
canvasElement.addEventListener("mouseup", canvasDragEnd);
canvasElement.addEventListener("wheel", canvasZoom);

if (glContext.gl === null) {
  throw new Error("Gl context hasn't been found");
}

const projectionData: ProjectionData = {
  fieldOfView: 45,
  aspect: glContext.gl.canvas.width / glContext.gl.canvas.height,
  zNear: 0.5,
  zFar: 1000.0,
};

const camera = new GlCamera(0, 10, 8, glContext.gl, projectionData);
const scene = new Taganka8Scene(glContext.gl, camera, projectionData);

scene.loadModel().then(() => {
  scene.prepareScene();
  scene.drawScene();
});

let inDrag: boolean = false;
let inRotation: boolean = false;
let dragStart: Point = { x: 0, y: 0 };
function canvasMouseDown(event: MouseEvent) {
  dragStart = {
    x: event.clientX,
    y: event.clientY,
  };

  if (event.ctrlKey) {
    inRotation = true;
  } else {
    inDrag = true;
  }
}

function canvasMouseMove(event: MouseEvent) {
  let dragDelta: Point = { x: 0, y: 0 };
  dragDelta = {
    x: event.clientX - dragStart.x,
    y: event.clientY - dragStart.y,
  };
  if (inDrag) {
    dragDelta.x;
    dragDelta.y;
    if (event.ctrlKey) {
      inRotation = true;
      inDrag = false;
      return;
    }
    camera.move(dragDelta);
  }
  if (inRotation) {
    if (!event.ctrlKey) {
      inRotation = false;
      inDrag = true;
      return;
    }
    camera.rotate(dragDelta);
  }
  dragStart = {
    x: event.clientX,
    y: event.clientY,
  };
  scene.drawScene();
}

function canvasDragEnd() {
  inDrag = false;
  inRotation = false;
}

function canvasZoom(event: WheelEvent) {
  event.preventDefault();
  camera.zoom(event.deltaY * 0.1);
  scene.drawScene();
}
