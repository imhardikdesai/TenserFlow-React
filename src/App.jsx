import { Route, Routes } from "react-router-dom";
import BodySegmentationPage from "./components/BodySegmentation";
import FaceDetectionPage from "./components/FaceDectection";
import HandPoseDetectionPage from "./components/HandPose";
import Home from "./components/Home";
import ObjectDetection from "./components/ObjectDetection";
import PortraitDepthEstimationPage from "./components/PortraitDepthEstimation";
import TextToxicityDetectionPage from "./components/TextToxicity";
import Welcome from "./components/Welcome";

function App() {
  return (
    <>
      <div>
        <Home />
        <Routes>
          <Route path="/" exact element={<Welcome />} />
          <Route path="/object" exact element={<ObjectDetection />} />
          <Route path="/face" exact element={<FaceDetectionPage />} />
          <Route path="/body" exact element={<BodySegmentationPage />} />
          <Route path="/hand" exact element={<HandPoseDetectionPage />} />
          <Route path="/text" exact element={<TextToxicityDetectionPage />} />
          <Route
            path="/portrait"
            exact
            element={<PortraitDepthEstimationPage />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
