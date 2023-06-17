import { useEffect, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

function ObjectDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runObjectDetection = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      await tf.ready();
      const model = await cocoSsd.load();

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          video.srcObject = stream;
          video.play();
        });
      }

      const detectObjects = async () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const predictions = await model.detect(canvas);
        // predictions.forEach((prediction) => console.log(prediction));
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw border around objects
        predictions.forEach((prediction) => {
          const [x, y, width, height] = prediction.bbox;

          // Draw rectangle
          context.beginPath();
          context.rect(x, y, width, height);
          context.lineWidth = 2;
          context.strokeStyle = "red";
          context.fillStyle = "red";
          context.font = "20px Arial";
          context.stroke();
          context.fillText(
            `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
            x,
            y > 10 ? y - 5 : 10
          );
          context.closePath();
        });

        requestAnimationFrame(detectObjects);
      };

      detectObjects();
    };

    runObjectDetection();
  }, []);

  return (
    <div>
      <h1>Object Detection with Camera</h1>
      <div style={{ position: "relative" }}>
        <video ref={videoRef} style={{ width: "100%" }} />
        <canvas
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "80vh",
          }}
          ref={canvasRef}
          width="640"
          height="480"
        />
      </div>
    </div>
  );
}

export default ObjectDetection;
