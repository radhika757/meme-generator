/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import styles from "./ImageFunctionality.module.css";

import ReactCrop from "react-image-crop";
import {
  // Facebook,
  // Instagram,
  Download,
  Share2,
  Trash2,
  Type,
  Crop as CropIcon,
  Save,
} from "lucide-react";
import Draggable from "react-draggable";


export const ImageFunctionality = ({
  image,
  setImage,
  crop,
  setCrop,
  textBoxes,
  setTextBoxes,
  setSelectedTextBox,
  isAddingText,
  setIsAddingText,
  selectedTextBox,
  isCropping,
  setIsCropping,
  fileName,
  saveEdit,
  setSaveEdit,
  borderWidth,
  setBorderWidth,
  setFileName,
  containerRef,
  imgRef,
}) => {
  const canvasRef = useRef(null);

  const handleDeleteImage = () => {
    setImage(null);
    setTextBoxes([]);
    setCrop(undefined);
    setBorderWidth(0);
    setFileName(null);
  };

  //   const handleMouseDown = (e, id) => {
  //     setIsDragging(true);
  //     setSelectedTextBox(id);
  //     setDragStart({ x: e.clientX, y: e.clientY });
  //   };

  //   const handleMouseMove = (e) => {
  //     if (!isDragging || selectedTextBox === null) return

  //     const deltaX = e.clientX - dragStart.x
  //     const deltaY = e.clientY - dragStart.y

  //     updateTextBox(selectedTextBox, (prev) => ({
  //       x: prev.x + deltaX,
  //       y: prev.y + deltaY
  //     }))

  //     setDragStart({ x: e.clientX, y: e.clientY })
  //   }

  //   const handleMouseUp = () => {
  //     setIsDragging(false)
  //   }

  const handleContainerClick = (e) => {
    if (!isAddingText || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newTextBox = {
      id: Date.now(),
      text: "New Text",
      x,
      y,
      fontSize: 20,
      color: "#ffffff",
    };

    setTextBoxes([...textBoxes, newTextBox]);
    setSelectedTextBox(newTextBox.id);
    setIsAddingText(false);
  };

  const updateTextBox = (id, updates) => {
    setTextBoxes(
      textBoxes.map((tb) => (tb.id === id ? { ...tb, ...updates } : tb))
    );
  };

  const deleteTextBox = (id) => {
    setTextBoxes(textBoxes.filter((tb) => tb.id !== id));
    setSelectedTextBox(null);
  };

  const handleSaveTextBox = () => {
    // what to do after saving a text?
    setSelectedTextBox(null);
  };

  const applyCrop = () => {
    if (!imgRef.current || !crop) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            setImage(reader.result);
            setCrop(undefined);
            setIsCropping(false);
          };
        }
      });
    }
  };

  const renderTextBoxes = () => {
    if (!textBoxes || textBoxes.length === 0) {
      return null;
    }
    return textBoxes.map((tb) => (
      <Draggable key={tb.id}>
        {/* In react-draggable to modify the cursor e cn apply styles o the text container or the element  */}
        <div
          className={`textBox ${selectedTextBox === tb.id ? "selected" : ""}`}
          style={{ left: tb.x, top: tb.y, position: "absolute" }}
          //   onMouseDown={(e) => handleMouseDown(e, tb.id)}
          onMouseEnter={(e) => (e.target.style.cursor = "grab")}
          onMouseDown={(e) => (e.target.style.cursor = "grabbing")}
          onMouseUp={(e) => (e.target.style.cursor = "grab")}
        >
          <p style={{ fontSize: `${tb.fontSize}px`, color: tb.color }}>
            {tb.text}
          </p>
        </div>
      </Draggable>
    ));
  };

  const saveEdits = () => {
    setSaveEdit(true);
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw the image
    const img = new Image();
    img.src = image;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw the text boxes
      textBoxes.forEach((tb) => {
        ctx.font = `${tb.fontSize}px Arial`;
        ctx.fillStyle = tb.color;
        ctx.textAlign = "left";
        ctx.fillText(tb.text, tb.x, tb.y + tb.fontSize); // Add fontSize to y to align text properly
      });

      // Update the image state with the new canvas content
      setImage(canvas.toDataURL());
    };

    // const formData = new FormData();
    // formData.append('file', img);
    // const response = await axios.post('/uploadCustomImage', {
    //   body: formData
    // });

    // const data = await response.json();
    // const imageUrl = data.url;
    // console.log(imageUrl);
    
  };

  const generateMeme = async () => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw the image
    const img = new Image();
    img.src = image;
    img.onload = async () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw the text boxes
      textBoxes.forEach((tb) => {
        ctx.font = `${tb.fontSize}px Arial`;
        ctx.fillStyle = tb.color;
        ctx.textAlign = "left";
        ctx.fillText(tb.text, tb.x, tb.y + tb.fontSize); // Add fontSize to y to align text properly
      });

      const memeDataUrl = canvas.toDataURL("image/png");

      try {
        const response = await fetch("/api/save-meme", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: `${fileName}.png`,
            imageData: memeDataUrl,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          alert(`Meme saved successfully! File name: ${result.fileName}`);
        } else {
          alert("Failed to save meme. Please try again.");
        }
      } catch (error) {
        console.error("Error saving meme:", error);
        alert("An error occurred while saving the meme. Please try again.");
      }
    };
  };

  // const memeDataUrl = canvas.toDataURL("image/png");

  const shareMeme = () => {
    if (!canvasRef.current) return;
    const memeUrl = canvasRef.current.toDataURL();
    console.log(memeUrl);
    
    let shareUrl = "";

    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      "Check out this meme!"
    )}&image=${encodeURIComponent(memeUrl)}`;

    window.open(shareUrl, "_blank");
  };

  const downloadMeme = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  useEffect(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("Canvas is not yet rendered to the DOM");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image(); // Create a new image object
    img.src = `/dummyimages/${image}`; // Ensure the image src is correct
    img.onload = () => {
      // Clear the canvas before drawing the image
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the image when it's loaded
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };
  }, [image, canvasRef]);

  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = img.width + borderWidth * 2;
        canvas.height = img.height + borderWidth * 2;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, borderWidth, borderWidth, img.width, img.height);
        }
      }
    };
  }, [image, borderWidth]);

  // get user selected img's URL

  return (
    <div className={styles.memeEditor}>
      <div
        className={styles.imageContainer}
        ref={containerRef}
        onClick={handleContainerClick}
      >
        {isCropping ? (
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={undefined}
          >
            <img
              ref={imgRef}
              src={image}
              alt="Meme"
              className={styles.memeImage}
            />
          </ReactCrop>
        ) : (
          <div className={styles.imageBlock}>
            <canvas
              ref={canvasRef}
              className={styles.memeCanvas}
              style={{ maxWidth: "100%", height: "auto", borderRadius: "4px" }}
              width={400}
              height={400}
            />
            {renderTextBoxes()}
            {saveEdit ? (
              <span style={{ textAlign: "center",paddingTop:"5px" }}>{fileName}.jpeg</span>
            ) : (
              <></>
            )}
          </div>
        )}
        <button
          className={styles.deleteImageButton}
          onClick={handleDeleteImage}
        >
          <Trash2 className={styles.icon} />
        </button>
      </div>

      {isAddingText && (
        <p className={styles.helperText}>Click on the image to add text</p>
      )}

      {!saveEdit && (
        <div className={styles.editorControls}>
          <button
            className={`${styles.controlButton} ${
              isAddingText ? styles.active : ""
            }`}
            onClick={() => setIsAddingText(!isAddingText)}
          >
            <Type className={styles.icon} />
            {isAddingText ? "Cancel" : "Add Text"}
          </button>
          <button
            className={`${styles.controlButton} ${
              isCropping ? styles.active : ""
            }`}
            onClick={() => setIsCropping(!isCropping)}
          >
            <CropIcon className={styles.icon} />
            {isCropping ? "Cancel Crop" : "Crop Image"}
          </button>
          {isCropping && (
            <button className={styles.controlButton} onClick={applyCrop}>
              Apply Crop
            </button>
          )}
          <button className={styles.controlButton} onClick={saveEdits}>
            <Save className={styles.icon} />
            Save Edits
          </button>
        </div>
      )}

      {selectedTextBox !== null && (
        <div className={styles.textEditorContainer}>
          <div className={styles.textEditor}>
            <div className={styles.textEditorBoxes}>
              {/* <label>Input Text:</label> */}
              <input
                type="text"
                value={
                  textBoxes.find((tb) => tb.id === selectedTextBox)?.text || ""
                }
                onChange={(e) =>
                  updateTextBox(selectedTextBox, { text: e.target.value })
                }
                placeholder="Enter text"
                className={styles.textInput}
              />
              <div className={styles.fontSizeControl}>
                <label className={styles.controlLabel}>
                  Font size: &nbsp;
                  {textBoxes.find((tb) => tb.id === selectedTextBox)?.fontSize}
                  px
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={
                    textBoxes.find((tb) => tb.id === selectedTextBox)
                      ?.fontSize || 20
                  }
                  onChange={(e) =>
                    updateTextBox(selectedTextBox, {
                      fontSize: parseInt(e.target.value),
                    })
                  }
                  className={styles.slider}
                />
              </div>
            </div>

            <div className={styles.colorPicker}>
              <div className={styles.colorPickerBox}>
                <label className={styles.controlLabel}>Text Color:</label>
                <input
                  type="color"
                  value={
                    textBoxes.find((tb) => tb.id === selectedTextBox)?.color
                  }
                  onChange={(e) =>
                    updateTextBox(selectedTextBox, { color: e.target.value })
                  }
                  className={styles.colorInput}
                />
              </div>
              <div className={styles.borderControl}>
                <label htmlFor="border-width" className={styles.controlLabel}>
                  Border Width: &nbsp;
                  <span>{borderWidth}px</span>
                </label>
                <input
                  id="border-width"
                  type="range"
                  min="0"
                  max="50"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                  className={styles.slider}
                />
              </div>
            </div>
            <button
              className={styles.deleteTextButton}
              onClick={() => deleteTextBox(selectedTextBox)}
            >
              Delete Text
            </button>
            <button
              className={styles.saveTextButton}
              //   onClick={() => handleSaveTextBox(selectedTextBox)}
              onClick={handleSaveTextBox}
            >
              Save Text
            </button>
          </div>
        </div>
      )}

      {!saveEdit && (
        <div className={styles.fileNameInput}>
          <label htmlFor="file-name" className={styles.controlLabel}>
            File Name:
          </label>
          <input
            id="file-name"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="What would you like to name your file?"
            className={styles.textInput}
          />
        </div>
      )}

      <div className={styles.actionButtons}>
        <button
          onClick={generateMeme}
          className={`${styles.actionButton} ${styles.generate}`}
        >
          Generate Meme
        </button>
        <button
          onClick={downloadMeme}
          className={`${styles.actionButton} ${styles.download}`}
        >
          <Download className="icon" /> Download
        </button>
        <button
          onClick={() => shareMeme()}
          className={`${styles.actionButton} ${styles.whatsapp}`}
        >
          <Share2 className="icon" /> WhatsApp
        </button>
        {/* <button
          onClick={() => shareMeme("instagram")}
          className={`${styles.actionButton} ${styles.instagram}`}
        >
          <Instagram className="icon" /> Instagram
        </button>
        <button
          onClick={() => shareMeme("facebook")}
          className={`${styles.actionButton} ${styles.facebook}`}
        >
          <Facebook className="icon" /> Facebook
        </button> */}
      </div>
    </div>
  );
};
