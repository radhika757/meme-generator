import { useState, useEffect } from "react";
import styles from "./ImageInput.module.css";

import axios from "axios";
import { Button, Input } from "antd";

const ImageInput = ({ setImage }) => {
  const [suggestedImages, setSuggestedImages] = useState(null);

  useEffect(() => {
    const fetchSuggestedImages = async () => {
      try {
        const result = await axios.get(
          "http://localhost:3000/topSuggestedImages"
        );
        setSuggestedImages(result.data);
      } catch (err) {
        console.error("Error fetching suggested images:", err);
      }
    };

    fetchSuggestedImages();
  }, []);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target);

      const reader = new FileReader();
      reader.addEventListener("load", () => setImage(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleLoadMoreImages = () => {
    //get more images from server
  };

  return (
    <div className={styles.InputContainer}>
      <label htmlFor="image-upload" className={styles.label}>
        Select an Image:
      </label>
      <Input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        className={styles.input}
      />

      <div className={styles.suggestedImages}>
        <div className={styles.allImages}>
          {suggestedImages &&
            Object.values(suggestedImages)?.map((img) => (
              <Button
                key={img.id}
                className={styles.images}
                onClick={() => setImage(img.imgName)}
              >
                <img src={`../dummyimages/${img.imgName}`} alt={img.imgName} />
              </Button>
            ))}
        </div>
        <div className={styles.loadMore}>
          <Button onClick={handleLoadMoreImages}>Load More</Button>
        </div>
      </div>
    </div>
  );
};

export default ImageInput;
