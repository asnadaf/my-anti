import { useState, useEffect } from 'react';
import dbConnect from '../lib/db';
import Product from '../models/Product';

export default function DirectFetch({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/debug');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.samples.products);
      } else {
        setError(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Direct Product Fetch</h1>
      
      <div className="mb-4">
        <button 
          onClick={refreshData}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Products: {products.length}</h2>
      </div>
      
      {products.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No products found in the database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product._id} className="border rounded p-4 bg-white shadow-sm">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">
                <span className="font-semibold">Brand:</span> {product.brand}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                <span className="font-semibold">Security Feature:</span> {product.securityFeature}
              </p>
              <p className="text-green-600 font-bold">
                ${product.discountPrice} 
                {product.originalPrice > product.discountPrice && (
                  <span className="line-through text-gray-400 text-sm ml-2">${product.originalPrice}</span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    await dbConnect();
    const products = await Product.find().limit(10).lean();
    
    return {
      props: {
        initialProducts: JSON.parse(JSON.stringify(products)),
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        initialProducts: [],
      },
    };
  }
} 