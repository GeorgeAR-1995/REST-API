import React, { useState } from 'react';

function ImageUploader({ onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSetFile = () => {
    if (file) {
      onUpload(file); // Call the parent's callback to set the file
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="preview" style={{ maxHeight: '200px' }} />}
      {file && <button onClick={handleSetFile}>Set File</button>}
    </div>
  );
}

export default ImageUploader;
