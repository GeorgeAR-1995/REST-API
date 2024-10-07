import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';

function Admin() {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    image: null,
  });

  const [products, setProducts] = useState([]);  // State to store the list of products
  const [updateId, setUpdateId] = useState(null);
  const [updateQuantity, setUpdateQuantity] = useState('');
  const [updatePrice, setUpdatePrice] = useState('');
  const [deleteId, setDeleteId] = useState(''); // State for deleting products

  // Fetch products from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/items');
        const data = await response.json();
        setProducts(data); // Set fetched products to state
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);  // Empty dependency array ensures this runs only once on mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const addNewProduct = async () => {
    const formData = new FormData();
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('quantity', newProduct.quantity);

    try {
      const response = await fetch('http://localhost:3000/api/items', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setNewProduct({ name: '', description: '', price: '', quantity: '', image: null });
        alert('Product added successfully!');
        // Refetch the products to update the table after adding a new product
        const data = await response.json();
        setProducts((prev) => [...prev, data]);  // Add the newly created product to the table
      } else {
        console.error('Failed to add product', await response.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const adjustQuantity = async () => {
    if (!updateId || !updateQuantity) {
      console.error('Update ID and Quantity must be provided.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/items/${updateId}/quantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: updateQuantity }),
      });
      if (response.ok) {
        console.log('Quantity updated successfully');
        setUpdateId(null);
        setUpdateQuantity('');
        // Update the products in the table
        setProducts((prev) =>
          prev.map((product) =>
            product.id === parseInt(updateId)
              ? { ...product, quantity: updateQuantity }
              : product
          )
        );
      } else {
        console.error('Failed to adjust quantity');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const adjustPrice = async () => {
    if (!updateId || !updatePrice) {
      console.error('Update ID and Price must be provided.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/items/${updateId}/price`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: updatePrice }),
      });
      if (response.ok) {
        console.log('Price updated successfully');
        setUpdateId(null);
        setUpdatePrice('');
        // Update the products in the table
        setProducts((prev) =>
          prev.map((product) =>
            product.id === parseInt(updateId) ? { ...product, price: updatePrice } : product
          )
        );
      } else {
        console.error('Failed to adjust price');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteProduct = async () => {
    if (!deleteId) {
      console.error('Delete ID must be provided.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/items/${deleteId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Product deleted successfully');
        setDeleteId('');
        // Remove the deleted product from the table
        setProducts((prev) => prev.filter((product) => product.id !== parseInt(deleteId)));
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ marginLeft: '10px'}}>
      <h2>Admin Panel</h2>

      {/* Table to display products on admin page*/}
      <h3>Product List</h3>
      <table border="2"
      style={{ borderCollapse: 'collapse', width: '50%'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price (£)</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>£{Number(product.price).toFixed(2)}</td>
                <td>{product.quantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No products available</td>
            </tr>
          )}
        </tbody>
      </table>

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
        type="number"
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
      <ImageUploader onUpload={(file) => setNewProduct((prev) => ({ ...prev, image: file }))} />

      <button onClick={addNewProduct} disabled={!newProduct.image}>Add Product</button>

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

      <h3>Adjust Product Price</h3>
      <input
        type="number"
        placeholder="Product ID"
        onChange={(e) => setUpdateId(e.target.value)}
      />
      <input
        type="number"
        placeholder="New Price"
        value={updatePrice}
        onChange={(e) => setUpdatePrice(e.target.value)}
      />
      <button onClick={adjustPrice}>Update Price</button>

      <h3>Delete Product</h3>
      <input
        type="number"
        placeholder="Product ID"
        value={deleteId}
        onChange={(e) => setDeleteId(e.target.value)}
      />
      <button onClick={deleteProduct}>Delete Product</button>
    </div>
  );
}

export default Admin;
