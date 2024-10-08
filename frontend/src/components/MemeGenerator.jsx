import { useRef, useState } from "react";
import ImageInput from "./ImageInput";
import { ImageFunctionality } from "./ImageFunctionality";

const MemeGenerator = () => {
  const [image, setImage] = useState(null);
  const [textBoxes, setTextBoxes] = useState([]);
  const [isAddingText, setIsAddingText] = useState(false);
  const [selectedTextBox, setSelectedTextBox] = useState(null);
  const [crop, setCrop] = useState();
  const [isCropping, setIsCropping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fileName, setFileName] = useState(image ?? "my-meme");
  const [borderWidth, setBorderWidth] = useState(0);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  return (
    <div>
      <div
        className="big-container"
        style={{ display: "flex", flexDirection: "column" }}
      >
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
            borderWidth={borderWidth}
            setBorderWidth={setBorderWidth}
            containerRef={containerRef}
            imgRef={imgRef}
            canvasRef={canvasRef}
          />
        )}
      </div>
    </div>
  );
};

export default MemeGenerator;
