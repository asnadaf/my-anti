import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import styles from './ProductDetailsModal.module.css';

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    // Add product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1); // Reset quantity
    router.push('/buyantivirus/cart');
  };

  const handleBuyNow = () => {
    // Add product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
    router.push('/buyantivirus/cart');
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, value)); // Ensure quantity is at least 1
  };

  // Use a placeholder image if product image is not available
  const defaultImage = '/images/placeholder-antivirus.jpg';

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        
        <div className={styles.productGrid}>
          {/* Left Column - Image */}
          <div className={styles.imageSection}>
            <div className={styles.mainImageContainer}>
              <Image
                src={product.image || defaultImage}
                alt={product.name || 'Antivirus Product'}
                width={384}
                height={384}
                className={styles.mainImage}
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
            </div>
            {product.gallery && (
              <div className={styles.thumbnailGrid}>
                {product.gallery.map((img, idx) => (
                  <div key={idx} className={styles.thumbnailContainer}>
                    <Image
                      src={img || defaultImage}
                      alt={`${product.name || 'Product'} view ${idx + 1}`}
                      width={60}
                      height={60}
                      className={styles.thumbnail}
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className={styles.detailsSection}>
            <h2 className={styles.productTitle}>
              {product.name || 'Product Name'}
            </h2>
            <p className={styles.price}>
              ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
            </p>
            
            <div className={styles.description}>
              <h3>Description</h3>
              <p>{product.description || 'No description available'}</p>
            </div>

            {product.features && Array.isArray(product.features) && (
              <div className={styles.features}>
                <h3>Key Features</h3>
                <ul>
                  {product.features.map((feature, idx) => (
                    <li key={idx}>
                      <span className={styles.checkmark}>✓</span>
                      {String(feature)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.quantitySection}>
              <label htmlFor="quantity" className={styles.quantityLabel}>
                Quantity:
              </label>
              <div className={styles.quantityControls}>
                <button 
                  className={styles.quantityButton}
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className={styles.quantityInput}
                />
                <button 
                  className={styles.quantityButton}
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.actions}>
              <button 
                className={styles.addToCartButton}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button 
                className={styles.buyNowButton}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
