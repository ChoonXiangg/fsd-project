import { useRef, useState } from 'react';

import Card from '../ui/Card';
import classes from './NewPropertyForm.module.css';

function NewPropertyForm(props) {
  const titleInputRef = useRef();
  const addressInputRef = useRef();
  const priceInputRef = useRef();
  const bedroomsInputRef = useRef();
  const bathroomsInputRef = useRef();
  const descriptionInputRef = useRef();

  // State for image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleChange(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }

  function handleFile(file) {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageUrl(''); // Clear URL input if file is dropped
    };
    reader.readAsDataURL(file);
  }

  function handleUrlChange(e) {
    setImageUrl(e.target.value);
    setImagePreview(null);
    setImageFile(null);
  }

  function submitHandler(event) {
    event.preventDefault();

    const enteredTitle = titleInputRef.current.value;
    const enteredAddress = addressInputRef.current.value;
    const enteredPrice = priceInputRef.current.value;
    const enteredBedrooms = bedroomsInputRef.current.value;
    const enteredBathrooms = bathroomsInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;

    // Use imagePreview (Base64) if file uploaded, otherwise use entered URL
    const finalImage = imagePreview || imageUrl;

    const propertyData = {
      title: enteredTitle,
      image: finalImage,
      address: enteredAddress,
      price: enteredPrice,
      bedrooms: enteredBedrooms,
      bathrooms: enteredBathrooms,
      description: enteredDescription,
    };

    props.onAddProperty(propertyData);
  }

  return (
    <Card>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='title'>Property Title</label>
          <input type='text' required id='title' ref={titleInputRef} />
        </div>

        <div className={classes.control}>
          <label htmlFor='image'>Property Image</label>
          <div
            className={`${classes.dragDropZone} ${dragActive ? classes.dragActive : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="imageUpload" className={classes.uploadLabel}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className={classes.previewImage} />
              ) : (
                <p>Drag and drop an image here, or click to select a file</p>
              )}
            </label>
          </div>
          <p className={classes.orText}>OR</p>
          <input
            type='url'
            id='image'
            placeholder="Enter Image URL"
            value={imageUrl}
            onChange={handleUrlChange}
            required={!imagePreview} // Required only if no file is selected
          />
        </div>

        <div className={classes.control}>
          <label htmlFor='address'>Address</label>
          <input type='text' required id='address' ref={addressInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='price'>Price</label>
          <input type='number' required id='price' ref={priceInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='bedrooms'>Bedrooms</label>
          <input type='number' required id='bedrooms' ref={bedroomsInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='bathrooms'>Bathrooms</label>
          <input type='number' required id='bathrooms' ref={bathroomsInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            required
            rows='5'
            ref={descriptionInputRef}
          ></textarea>
        </div>
        <div className={classes.actions}>
          <button>Add Property</button>
        </div>
      </form>
    </Card>
  );
}

export default NewPropertyForm;
