import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePath, setImagePath] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      alert('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {

      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

     
      setImagePath(response.data.imagePath); 
      alert('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          accept="image/*"
        />
        <button type="submit">Upload</button>
      </form>

      {imagePath && <div>Image uploaded: {imagePath}</div>}
    </div>
  );
};

export default ImageUpload;
