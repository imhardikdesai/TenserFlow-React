import { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";

function PortraitDepthEstimationPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runPortraitDepthEstimation = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      try {
        await tf.setBackend("webgl");
        await tf.ready();

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          video.srcObject = stream;
          video.play();
        } else {
          console.error("getUserMedia is not supported on this device.");
          return;
        }

        const estimateDepth = async () => {
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            // Video dimensions are not available yet, try again
            requestAnimationFrame(estimateDepth);
            return;
          }

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          const segmentationConfig = {
            internalResolution: "medium",
            segmentationThreshold: 0.7,
          };
          const model = await bodyPix.load(segmentationConfig);
          const segmentation = await model.segmentPerson(video);

          context.clearRect(0, 0, canvas.width, canvas.height);

          // Draw the video frame on the canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Draw the segmentation mask on the canvas
          const maskData = bodyPix.toMaskImageData(segmentation);
          context.putImageData(maskData, 0, 0);

          requestAnimationFrame(estimateDepth);
        };

        estimateDepth();
      } catch (error) {
        console.error(
          "Error occurred during portrait depth estimation:",
          error
        );
      }
    };

    runPortraitDepthEstimation();
  }, []);

  return (
    <div>
      <h1>Portrait Depth Estimation</h1>
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
        />
      </div>
    </div>
  );
}

export default PortraitDepthEstimationPage;
