import { useEffect, useRef } from "react";
import * as toxicity from "@tensorflow-models/toxicity";

function TextToxicityDetectionPage() {
  const textareaRef = useRef(null);

  useEffect(() => {
    const runTextToxicityDetection = async () => {
      const textarea = textareaRef.current;

      try {
        const model = await toxicity.load();

        textarea.addEventListener("input", async () => {
          const text = textarea.value;
          const predictions = await model.classify(text);

          predictions.forEach((prediction) => {
            console.log(prediction);
            // console.log(
            //   `Label: ${prediction.label}\nProbability: ${
            //     prediction.results[0].probabilities[1] * 100
            //   }`
            // );
          });
        });
      } catch (error) {
        console.error("Error occurred during text toxicity detection:", error);
      }
    };

    runTextToxicityDetection();
  }, []);

  return (
    <div>
      <h1>Text Toxicity Detection</h1>
      <textarea
        ref={textareaRef}
        placeholder="Enter text here..."
        rows={4}
        cols={50}
      />
    </div>
  );
}

export default TextToxicityDetectionPage;
