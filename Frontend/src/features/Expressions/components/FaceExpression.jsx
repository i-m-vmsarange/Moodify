import { useRef, useEffect, useState } from "react";
import "../App.css";
import * as faceapi from "face-api.js";
import Player from "../../home/components/Player";
import { useSong } from "../../home/hooks/useSong";

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [expression, setExpression] = useState("Detecting...");
  const [faceDetecting, setFaceDetecting] = useState(true);
  const { getSongHandler, song } = useSong();
  // LOAD FROM USEEFFECT
  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  async function handleGetSong({ mood }) {
    const result = await getSongHandler({ mood });
    console.log(result);
  }

  // OPEN YOU FACE WEBCAM
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // LOAD MODELS FROM FACE API
  const loadModels = () => {
    Promise.all([
      // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(() => {
      console.log("Models loaded...");
    });
  };

  const detectExpression = async () => {
    const video = videoRef.current;

    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (detections.length === 0) {
      setExpression("No face detected");
      return;
    }
    if (faceDetecting) {
      setExpression("Detecting...");
    }
    const expressions = detections[0].expressions;

    const currentExpression = Object.keys(expressions).reduce((a, b) => {
      return expressions[a] > expressions[b] ? a : b;
    });

    setExpression(currentExpression);

    const canvas = canvasRef.current;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    faceapi.matchDimensions(canvas, {
      width: videoWidth,
      height: videoHeight,
    });

    const resized = faceapi.resizeResults(detections, {
      width: videoWidth,
      height: videoHeight,
    });

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, videoWidth, videoHeight);

    faceapi.draw.drawDetections(canvas, resized);
    faceapi.draw.drawFaceLandmarks(canvas, resized);
    faceapi.draw.drawFaceExpressions(canvas, resized);

    return currentExpression;
  };

  // const faceMyDetect = () => {
  //   videoRef.current.addEventListener("playing", () => {
  //     const canvas = faceapi.createCanvasFromMedia(videoRef.current);
  //     canvasRef.current.replaceWith(canvas);
  //     canvasRef.current = canvas;

  //     const videoWidth = videoRef.current.videoWidth;
  //     const videoHeight = videoRef.current.videoHeight;

  //     faceapi.matchDimensions(canvasRef.current, {
  //       width: videoWidth,
  //       height: videoHeight,
  //     });

  //     setInterval(async () => {
  //       const detections = await faceapi
  //         .detectAllFaces(
  //           videoRef.current,
  //           new faceapi.TinyFaceDetectorOptions(),
  //         )
  //         .withFaceLandmarks()
  //         .withFaceExpressions();
  //       const expressions = detections[0].expressions;

  //       const currentExpression = Object.keys(expressions).reduce((a, b) => {
  //         return expressions[a] > expressions[b] ? a : b;
  //       });

  //       setExpression(currentExpression);
  //       const resized = faceapi.resizeResults(detections, {
  //         width: videoWidth,
  //         height: videoHeight,
  //       });

  //       canvasRef.current
  //         .getContext("2d")
  //         .clearRect(0, 0, videoWidth, videoHeight);

  //       faceapi.draw.drawDetections(canvasRef.current, resized);
  //       faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
  //       faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
  //     }, 100);
  //   });
  // };

  return (
    <div className="myapp">
      <div className="video-container">
        <div className="appvide">
          <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
        </div>
        <canvas ref={canvasRef} className="appcanvas" />
      </div>
      <h2 style={{ marginTop: "1rem" }}>Face Detection: {expression}</h2>
      <button
        onClick={() => {
          setExpression("Detecting...");
          setFaceDetecting(true);
          setTimeout(async () => {
            const currentExpression = await detectExpression();
            await handleGetSong({ mood: currentExpression });
            setFaceDetecting(false);
          }, 1500);
        }}
        className="px-4 py-3 bg-pink-700 rounded-md cursor-pointer font-semibold active:scale-95"
      >
        Detect Expression
      </button>
      {song && <Player />}
    </div>
  );
}

export default App;
