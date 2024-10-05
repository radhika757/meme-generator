import styles from "./ImageFunctionality.module.css";

import ReactCrop from "react-image-crop";
import {
  Facebook,
  Instagram,
  Download,
  Share2,
  Trash2,
  Type,
  Crop as CropIcon,
  Save,
} from "lucide-react";
import { useEffect } from "react";

export const ImageFunctionality = (
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
  isDragging,
  setIsDragging,
  dragStart,
  setDragStart,
  fileName,
  setFileName,
  containerRef,
  imgRef,
  canvasRef
) => {
  const deleteImage = () => {
    setImage(null);
    setTextBoxes([]);
    setCrop(undefined);
  };

  const handleMouseDown = (e, id) => {
    setIsDragging(true);
    setSelectedTextBox(id);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

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
      <div
        key={tb.id}
        className={`text-box ${selectedTextBox === tb.id ? "selected" : ""}`}
        style={{ left: tb.x, top: tb.y }}
        onMouseDown={(e) => handleMouseDown(e, tb.id)}
      >
        <p style={{ fontSize: `${tb.fontSize}px`, color: tb.color }}>
          {tb.text}
        </p>
      </div>
    ));
  };

  const saveEdits = () => {
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

  const shareMeme = (platform) => {
    if (!canvasRef.current) return;
    const memeUrl = canvasRef.current.toDataURL();
    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          "Check out this meme!"
        )}&image=${encodeURIComponent(memeUrl)}`;
        break;
      case "instagram":
        alert(
          "To share on Instagram, save the image and upload it manually through the Instagram app."
        );
        return;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          memeUrl
        )}`;
        break;
    }

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

    const img = new Image();
    img.src = image;
    img.onload = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height);
        }
      }
    };
  }, [image]);

  
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
          <>
            <canvas ref={canvasRef} className={styles.memeCanvas} />
            {/* <img src={image.image} alt="Selected Image" className={styles.memeCanvas} /> */}
            {renderTextBoxes()}
          </>
        )}
        <button className={styles.deleteImageButton} onClick={deleteImage}>
          <Trash2 className={styles.icon} />
        </button>
      </div>

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
        {isAddingText && (
          <p className={styles.helperText}>Click on the image to add text</p>
        )}
      </div>

      {selectedTextBox !== null && (
        <div className={styles.textEditor}>
          <input
            type="text"
            // value={
            //   textBoxes.find((tb) => tb.id === selectedTextBox)?.text || ""
            // }
            onChange={(e) =>
              updateTextBox(selectedTextBox, { text: e.target.value })
            }
            placeholder="Enter text"
            className={styles.textInput}
          />
          <div className={styles.fontSizeControl}>
            <label className={styles.controlLabel}>
              Font size:{" "}
              {/* {textBoxes.find((tb) => tb.id === selectedTextBox)?.fontSize}px */}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              //   value={
              //     textBoxes.find((tb) => tb.id === selectedTextBox)?.fontSize ||
              //     20
              //   }
              onChange={(e) =>
                updateTextBox(selectedTextBox, {
                  fontSize: parseInt(e.target.value),
                })
              }
              className={styles.slider}
            />
          </div>
          <div className={styles.colorPicker}>
            <label className={styles.controlLabel}>Text Color:</label>
            <input
              type="color"
              //   value={textBoxes.find((tb) => tb.id === selectedTextBox)?.color}
              onChange={(e) =>
                updateTextBox(selectedTextBox, { color: e.target.value })
              }
              className={styles.colorInput}
            />
          </div>
          <button
            className={styles.deleteTextButton}
            onClick={() => deleteTextBox(selectedTextBox)}
          >
            Delete Text
          </button>
        </div>
      )}

      <div className={styles.fileNameInput}>
        <label htmlFor="file-name" className={styles.controlLabel}>
          File Name:
        </label>
        <input
          id="file-name"
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter file name"
          className={styles.textInput}
        />
      </div>

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
          onClick={() => shareMeme("whatsapp")}
          className={`${styles.actionButton} ${styles.whatsapp}`}
        >
          <Share2 className="icon" /> WhatsApp
        </button>
        <button
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
        </button>
      </div>
    </div>
  );
};
