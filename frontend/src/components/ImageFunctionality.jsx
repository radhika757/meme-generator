import { Button, Input, Popover, Slider } from "antd";
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
    return textBoxes.map((tb) => (
      <div
        key={tb.id}
        className={`absolute cursor-move ${
          selectedTextBox === tb.id ? "ring-2 ring-blue-500" : ""
        }`}
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
    ctx.drawImage(canvas, 0, 0);

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

//   const generateMeme = async () => {
//     if (!canvasRef.current || !containerRef.current) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     // Draw the image
//     ctx.drawImage(canvas, 0, 0);

//     // Draw the text boxes
//     textBoxes.forEach((tb) => {
//       ctx.font = `${tb.fontSize}px Arial`;
//       ctx.fillStyle = tb.color;
//       ctx.textAlign = "left";
//       ctx.fillText(tb.text, tb.x, tb.y + tb.fontSize); // Add fontSize to y to align text properly
//     });

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

    return (
      <div>
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div
            className="relative"
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
                  className="max-w-full h-auto"
                />
              </ReactCrop>
            ) : (
              <>
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto cursor-crosshair rounded-md"
                />
                {renderTextBoxes()}
              </>
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
              onClick={deleteImage}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setIsAddingText(!isAddingText)}
              variant={isAddingText ? "secondary" : "default"}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Type className="mr-2 h-4 w-4" />
              {isAddingText ? "Cancel" : "Add Text"}
            </Button>
            <Button
              onClick={() => setIsCropping(!isCropping)}
              variant={isCropping ? "secondary" : "default"}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              <CropIcon className="mr-2 h-4 w-4" />
              {isCropping ? "Cancel Crop" : "Crop Image"}
            </Button>
            {isCropping && (
              <Button
                onClick={applyCrop}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Apply Crop
              </Button>
            )}
            <Button
              onClick={saveEdits}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Edits
            </Button>
            {isAddingText && (
              <p className="text-sm text-purple-600 font-medium">
                Click on the image to add text
              </p>
            )}
          </div>

          {selectedTextBox !== null && (
            <div className="space-y-4 bg-gray-100 p-4 rounded-md">
              <Input
                type="text"
                value={
                  textBoxes.find((tb) => tb.id === selectedTextBox)?.text || ""
                }
                onChange={(e) =>
                  updateTextBox(selectedTextBox, { text: e.target.value })
                }
                placeholder="Enter text"
                className="border-2 border-purple-300"
              />
              <div className="space-y-2">
                <label className="text-gray-700">
                  Font size:{" "}
                  {textBoxes.find((tb) => tb.id === selectedTextBox)?.fontSize}
                  px
                </label>
                <Slider
                  min={10}
                  max={100}
                  step={1}
                  value={[
                    textBoxes.find((tb) => tb.id === selectedTextBox)
                      ?.fontSize || 20,
                  ]}
                  onValueChange={([value]) =>
                    updateTextBox(selectedTextBox, { fontSize: value })
                  }
                  className="bg-purple-200"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-gray-700">Text Color:</label>
                <Popover>
                  {/* <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[80px] h-[30px] p-0 border-2 border-purple-300"
                    style={{
                      backgroundColor: textBoxes.find(
                        (tb) => tb.id === selectedTextBox
                      )?.color,
                    }}
                  />
                </PopoverTrigger> */}
                  {/* <PopoverContent className="w-[280px]">
                  <input
                    type="color"
                    value={
                      textBoxes.find((tb) => tb.id === selectedTextBox)?.color
                    }
                    onChange={(e) =>
                      updateTextBox(selectedTextBox, { color: e.target.value })
                    }
                    className="w-full h-[180px]"
                  />
                </PopoverContent> */}
                </Popover>
              </div>
              <Button
                variant="destructive"
                onClick={() => deleteTextBox(selectedTextBox)}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete Text
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="file-name" className="text-gray-700">
              File Name:
            </label>
            <Input
              id="file-name"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
              className="border-2 border-purple-300"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
            //   onClick={generateMeme}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Generate Meme
            </Button>
            <Button
              onClick={downloadMeme}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button
              onClick={() => shareMeme("whatsapp")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Share2 className="mr-2 h-4 w-4" /> WhatsApp
            </Button>
            <Button
              onClick={() => shareMeme("instagram")}
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              <Instagram className="mr-2 h-4 w-4" /> Instagram
            </Button>
            <Button
              onClick={() => shareMeme("facebook")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Facebook className="mr-2 h-4 w-4" /> Facebook
            </Button>
          </div>
        </div>
      </div>
    );
  };

