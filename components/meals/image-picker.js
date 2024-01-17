'use client';

import { useRef, useState } from 'react';
import styles from './image-picker.module.css';
import Image from 'next/image';

export default function ImagePicker({ label, name }) {
  const [pickedImage, setPickedImage] = useState();

  const imageInputRef = useRef();

  function handleImagePick() {
    imageInputRef.current.click();
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      setPickedImage(null);
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    }; //we store a function as a value here in the 'onload' method and this function will be triggered by the file reader once the readAsDataURL method is done.

    fileReader.readAsDataURL(file);
  }

  return (
    <div className={styles.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={styles.controls}>
        <div className={styles.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="The image selected by the user"
              fill
            />
          )}
        </div>
        <input
          type="file"
          name={name}
          id={name}
          accept="image/png, image/jpeg"
          className={styles.input}
          ref={imageInputRef}
          // multiple - to allow the user pick multiple files
          onChange={handleImageChange}
          required
        />
        <button
          type="button"
          className={styles.button}
          onClick={handleImagePick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
}
