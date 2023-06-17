import { useEffect, useRef } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
import * as tf from "@tensorflow/tfjs";

function FaceDetectionPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runFaceDetection = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      await tf.setBackend("webgl");
      await tf.ready();
      const model = await blazeface.load();

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          video.srcObject = stream;
          video.play();
        });
      }

      const detectFaces = async () => {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvas.width, canvas.height);
        const predictions = await model.estimateFaces(video);

        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (predictions && predictions.length > 0) {
          predictions.forEach((prediction) => {
            const topLeft = prediction.topLeft;
            const bottomRight = prediction.bottomRight;
            const landmarks = prediction.landmarks;

            // Draw bounding box
            context.beginPath();
            context.rect(topLeft[0], topLeft[1], bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]);
            context.lineWidth = 2;
            context.strokeStyle = "red";
            context.stroke();
            context.closePath();

            // Draw facial landmarks
            landmarks.forEach((point) => {
              context.beginPath();
              context.arc(point[0], point[1], 2, 0, 2 * Math.PI);
              context.fillStyle = "red";
              context.fill();
              context.closePath();
            });
          });
        }

        requestAnimationFrame(detectFaces);
      };

      detectFaces();
    };

    runFaceDetection();
  }, []);

  return (
    <div>
      <h1>Face Detection</h1>
      <div style={{ position: "relative" }}>
        <video ref={videoRef} style={{ width: "100%", height: "auto" }} />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
          }}
          width={640}
          height={480}
        />
      </div>
    </div>
  );
}

export default FaceDetectionPage;
