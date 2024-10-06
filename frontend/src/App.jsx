import {  useRef, useState } from "react";
import Navbar from "./components/Navbar";
import ImageInput from "./components/ImageInput";
import { ImageFunctionality } from "./components/ImageFunctionality";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [textBoxes, setTextBoxes] = useState([]);
  const [isAddingText, setIsAddingText] = useState(false);
  const [selectedTextBox, setSelectedTextBox] = useState(null);
  const [crop, setCrop] = useState();
  const [isCropping, setIsCropping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fileName, setFileName] = useState("my-meme");
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  return (
    <div className="big-container">
      <Navbar image={image} setImage={setImage} />
      <ImageInput setImage={setImage} />
      {image && (
        <ImageFunctionality
          image={image}
          setImage={setImage}
          crop={crop}
          setCrop={setCrop}
          textBoxes={textBoxes}
          setTextBoxes={setTextBoxes}
          setSelectedTextBox={setSelectedTextBox}
          isAddingText={isAddingText}
          setIsAddingText={setIsAddingText}
          selectedTextBox={selectedTextBox}
          isCropping={isCropping}
          setIsCropping={setIsCropping}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          dragStart={dragStart}
          setDragStart={setDragStart}
          fileName={fileName}
          setFileName={setFileName}
          containerRef={containerRef}
          imgRef={imgRef}
          canvasRef={canvasRef}
        />
      )}
    </div>
  );
}

export default App;
