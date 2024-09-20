import React, { useState } from 'react';

function Admin() {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    image: '',
  });

  const [updateId, setUpdateId] = useState(null);
  const [updateQuantity, setUpdateQuantity] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const addNewProduct = async () => {
    // Make a POST request to add the new product
    try {
      const response = await fetch('http://localhost:3000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        // Reset the form
        setNewProduct({ name: '', description: '', price: '', quantity: '', image: '' });
        // Optionally, refresh the product list in Home component
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const adjustQuantity = async () => {
    // Make a PUT request to update the quantity
    try {
      const response = await fetch(`http://localhost:3000/api/items/${updateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: updateQuantity }),
      });
      if (response.ok) {
        // Optionally, refresh the product list in Home component
      } else {
        console.error('Failed to adjust quantity');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <h3>Add New Product</h3>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={newProduct.name}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={newProduct.description}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="price"
        placeholder="Price"
        value={newProduct.price}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="quantity"
        placeholder="Quantity"
        value={newProduct.quantity}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="image"
        placeholder="Image URL"
        value={newProduct.image}
        onChange={handleInputChange}
      />
      <button onClick={addNewProduct}>Add Product</button>

      <h3>Adjust Product Quantity</h3>
      <input
        type="number"
        placeholder="Product ID"
        onChange={(e) => setUpdateId(e.target.value)}
      />
      <input
        type="number"
        placeholder="New Quantity"
        value={updateQuantity}
        onChange={(e) => setUpdateQuantity(e.target.value)}
      />
      <button onClick={adjustQuantity}>Update Quantity</button>
    </div>
  );
}

export default Admin;
