/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import styles from "./ImageInput.module.css";

import axios from "axios";
import { Button, Input, Spin } from "antd";

const ImageInput = ({ setImage, saveEdit }) => {
  const [suggestedImages, setSuggestedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [noMoreImages, setNoMoreImage] = useState(false);
  const limit = 6;

  const fetchSuggestedImages = async () => {
    try {
      setLoading(true);
      setNoMoreImage(false);
      const result = await axios.get(
        `http://localhost:3000/topSuggestedImages?limit=${limit}&offset=${offset}`
      );
      
      if (result.data.hasmore === false) {
        setNoMoreImage(true);
      }
      setSuggestedImages((prevImages) => [...prevImages, ...result.data.images]);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching suggested images:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestedImages();
  }, [offset]);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImage(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleLoadMoreImages = async () => {
    if (!loading) {
      setLoading(true);
      setTimeout(() => {
        setOffset((prevOffset) => prevOffset + limit); //Incrementing offset by 6
      }, 500); // 500ms delay before updating offset
    }
  };

  return (
    <>
      {!saveEdit ? (
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
                    <img
                      src={`../dummyimages/${img.imgName}`}
                      alt={img.imgName}
                    />
                  </Button>
                ))}
            </div>
            <div className={styles.loadMore}>
              {loading ? (
                <Spin />
              ) : noMoreImages ? (
                <span>No More Suggested Images</span>
              ) : (
                <Button onClick={handleLoadMoreImages}>Load More</Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ImageInput;
