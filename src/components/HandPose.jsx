import { useEffect, useRef } from "react";
import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";

function HandPoseDetectionPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runHandPoseDetection = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      try {
        await tf.setBackend("webgl");
        await tf.ready();
        const model = await handpose.load();

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play().catch((error) => {
              console.error("Error playing video:", error);
            });
          };
        } else {
          console.error("getUserMedia is not supported on this device.");
          return;
        }

        const detectHandPoses = async () => {
          if (video.videoWidth && video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          } else {
            // If video dimensions are not available yet, try again in the next frame
            requestAnimationFrame(detectHandPoses);
            return;
          }

          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const predictions = await model.estimateHands(video);
          console.log(predictions);

          context.clearRect(0, 0, canvas.width, canvas.height);

          if (predictions && predictions.length > 0) {
            predictions.forEach((hand) => {
              const landmarks = hand.landmarks;

              landmarks.forEach((point) => {
                const [x, y] = point;

                // Draw circle at each landmark point
                context.beginPath();
                context.arc(x, y, 5, 0, 2 * Math.PI);
                context.fillStyle = "red";
                context.fill();
                context.closePath();
              });
            });
          }

          requestAnimationFrame(detectHandPoses);
        };

        detectHandPoses();
      } catch (error) {
        console.error("Error occurred during hand pose detection:", error);
      }
    };

    runHandPoseDetection();
  }, []);

  return (
    <div>
      <h1>Hand Pose Detection</h1>
      <div style={{ position: "relative" }}>
        <video
          ref={videoRef}
          style={{ width: "100%", height: "auto" }}
          playsInline
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}

export default HandPoseDetectionPage;
