import styles from "./ImageInput.module.css";
import cat from "../dummyimages/cat.jpeg";
import child from "../dummyimages/child.jpeg";
import duck from "../dummyimages/duck.jpeg";
import exuse from "../dummyimages/excuseme.jpeg";
import oops from "../dummyimages/oops.jpeg";
import sadfrog from "../dummyimages/sadfrog.jpeg";
import what from "../dummyimages/what.jpeg";

import { Button, Input } from "antd";

const ImageInput = (image, setImage) => {
  //temp
  const defaultImages = [
    {
      id: 1,
      src: cat,
      alt: "Default Image 1",
    },
    {
      id: 2,
      src: child,
      alt: "Default Image 2",
    },
    {
      id: 3,
      src: duck,
      alt: "Default Image 3",
    },
    {
      id: 4,
      src: exuse,
      alt: "Default Image 4",
    },
    {
      id: 5,
      src: oops,
      alt: "Default Image 4",
    },
    {
      id: 6,
      src: sadfrog,
      alt: "Default Image 4",
    },
    {
      id: 7,
      src: what,
      alt: "Default Image 4",
    },
  ];

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImage(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleLoadMoreImages = () =>{
    //get more images from server
  }

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
          {defaultImages.map((img) => (
            <Button
              key={img.id}
              className={styles.images}
              onClick={() => setImage(img.src)}
            >
              <img src={img.src} alt={img.alt} />
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
