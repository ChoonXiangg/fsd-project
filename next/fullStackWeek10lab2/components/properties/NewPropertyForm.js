import { useRef, useState, useContext } from 'react';
import GlobalContext from '../../pages/store/globalContext';

import Card from '../ui/Card';
import classes from './NewPropertyForm.module.css';
import { counties, cities, propertyTypes, bedroomOptions, citiesByCounty } from '../../data/irelandLocations';

function NewPropertyForm(props) {
  const globalCtx = useContext(GlobalContext);
  const nameInputRef = useRef();
  const addressInputRef = useRef();
  const priceInputRef = useRef();
  const floorSizeInputRef = useRef();

  // State for form fields
  const [listingType, setListingType] = useState('Buy');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [propertyType, setPropertyType] = useState('Residential');
  const [propertySubtype, setPropertySubtype] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  // ... existing handlers ...
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
      setImageUrl('');
    };
    reader.readAsDataURL(file);
  }

  function handleUrlChange(e) {
    setImageUrl(e.target.value);
    setImagePreview(null);
    setImageFile(null);
  }

  function handlePropertyTypeChange(e) {
    setPropertyType(e.target.value);
    setPropertySubtype('');
    if (e.target.value === 'Commercial') {
      setBedrooms('');
    }
  }

  function submitHandler(event) {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredAddress = addressInputRef.current.value;
    const enteredPrice = priceInputRef.current.value;
    const enteredFloorSize = floorSizeInputRef.current.value;

    const finalImage = imagePreview || imageUrl;

    const user = globalCtx.theGlobalObject.user;

    const propertyData = {
      listingType: listingType, // Add listingType to data
      name: enteredName,
      image: finalImage,
      address: enteredAddress,
      city: city,
      county: county,
      price: enteredPrice,
      propertyType: propertyType,
      propertySubtype: propertySubtype,
      bedrooms: propertyType === 'Residential' ? bedrooms : '',
      verifiedAgent: user?.verifiedAgent || false,
      floorSize: enteredFloorSize,
      creatorId: user?.id || null,
      creatorUsername: user?.username || 'Unknown',
      creatorEmail: user?.email || '',
      creatorPhoneNumber: user?.phoneNumber || ''
    };

    props.onAddProperty(propertyData);
  }

  return (
    <Card>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='listingType'>Listing Type</label>
          <select id='listingType' value={listingType} onChange={(e) => setListingType(e.target.value)}>
            <option value="Buy">For Sale</option>
            <option value="Rent">For Rent</option>
          </select>
        </div>

        <div className={classes.control}>
          <label htmlFor='name'>Property Name</label>
          <input type='text' required id='name' ref={nameInputRef} />
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
            required={!imagePreview}
          />
        </div>

        <div className={classes.control}>
          <label htmlFor='address'>Street Address</label>
          <input type='text' required id='address' ref={addressInputRef} />
        </div>

        <div className={classes.control}>
          <label htmlFor='county'>County</label>
          <select id='county' required value={county} onChange={(e) => {
            setCounty(e.target.value);
            setCity('');
          }}>
            <option value="">Select County</option>
            {counties.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className={classes.control}>
          <label htmlFor='city'>City</label>
          <select id='city' required value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Select City</option>
            {(county ? (citiesByCounty[county] || []) : cities).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className={classes.control}>
          <label htmlFor='price'>Price (€)</label>
          <input type='number' required id='price' ref={priceInputRef} />
        </div>

        <div className={classes.control}>
          <label htmlFor='propertyType'>Property Type</label>
          <select
            id='propertyType'
            required
            value={propertyType}
            onChange={handlePropertyTypeChange}
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        <div className={classes.control}>
          <label htmlFor='propertySubtype'>Property Subtype</label>
          <select
            id='propertySubtype'
            required
            value={propertySubtype}
            onChange={(e) => setPropertySubtype(e.target.value)}
          >
            <option value="">Select Subtype</option>
            {propertyTypes[propertyType].map((subtype) => (
              <option key={subtype} value={subtype}>{subtype}</option>
            ))}
          </select>
        </div>

        {propertyType === 'Residential' && (
          <div className={classes.control}>
            <label htmlFor='bedrooms'>Bedrooms</label>
            <select
              id='bedrooms'
              required
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            >
              <option value="">Select Bedrooms</option>
              {bedroomOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}

        <div className={classes.control}>
          <label htmlFor='floorSize'>Floor Size (m²)</label>
          <input type='number' required id='floorSize' ref={floorSizeInputRef} />
        </div>

        <div className={classes.actions}>
          <button>Add Property</button>
        </div>
      </form>
    </Card>
  );
}

export default NewPropertyForm;
