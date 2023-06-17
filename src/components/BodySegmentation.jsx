import { useEffect, useRef } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import * as tf from "@tensorflow/tfjs";

function BodySegmentationPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runBodySegmentation = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      //   const context = canvas.getContext("2d");

      await tf.setBackend("webgl");
      await tf.ready();
      const model = await bodyPix.load();

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          video.srcObject = stream;
          video.play();
        });
      }

      const segmentBody = async () => {
        const segmentation = await model.segmentPerson(video);
        const personMask = bodyPix.toMask(segmentation);
        console.log(personMask);
        bodyPix.drawMask(canvas, video, personMask, 0.7, 0, false);

        requestAnimationFrame(segmentBody);
      };

      segmentBody();
    };

    runBodySegmentation();
  }, []);

  return (
    <div>
      <h1>Body Segmentation</h1>
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

export default BodySegmentationPage;
