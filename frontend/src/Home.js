import React, { useEffect, useState } from 'react';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/items');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
        <header className="bg-success text-white text-center" style={{ height: '125px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 className="display-4">Golf Shop</h1>
        </header>
        <div className="container my-5">
        <div className="row">
            {products.length > 0 ? (
            products.map((product) => (
                <div className="col-md-3 mb-5" key={product.id}>
                <div className="card h-100">
                    <img src={product.image} className="card-img-top img-fluid" alt={product.name} />
                    <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text"><strong>Price: </strong>{product.price}</p>
                    <p className="card-text"><strong>Quantity: </strong>{product.quantity}</p>
                    </div>
                </div>
                </div>
            ))
            ) : (
            <p>Loading products...</p>
            )}
        </div>
        </div>
    </div>
  );
}

export default Home;
