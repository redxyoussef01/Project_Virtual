import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';

const Shelf = ({ position, letter }) => {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1, 10, 13]} />
        <meshStandardMaterial color={0x8B4513} />
      </mesh>
      <Text 
        position={[-0.5, -5.5, 6.5]}
        fontSize={1}
        color="white"
      >
        {letter}
      </Text>
    </group>
  );
};

const Product = ({ position, details }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={0xC1C1C1} />
      </mesh>
      {hovered && (
        <Html>
          <div style={{ background: 'white', padding: '10px', borderRadius: '5px' }}>
            <p>Place: {details.name}</p>
            <p>Name: {details.product.name}</p>
            <p>Quantity: {details.qte}</p>
            <p>Frequence: {details.product.classe}</p>
          </div>
        </Html>
      )}
    </group>
  );
};

const Scene = ({ products }) => {
  const letters = 'ABCDEFGHIJ'.split('');

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[1, 1, 1]} intensity={0.5} />
      {letters.map((letter, index) => (
        <Shelf 
          key={letter} 
          position={[index * 4 - 10, 2.5, 0]} 
          letter={letter} 
        />
      ))}
      {products.map((product, index) => (
        <Product
          key={index}
          position={[product.x, product.y, product.z]}
          details={product}
        />
      ))}
    </>
  );
};

const BookshelfScene = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/emplacements0');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleToggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);

    // Perform filtering logic here
    const filtered = allProducts.filter(product =>
      product.product.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 5, 20], fov: 100 }}
      >
        <Scene products={filteredProducts} />
        <OrbitControls />
      </Canvas>
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
        <button onClick={handleToggleFilter} style={{ padding: '5px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path fill="#000000" d="M14 0c-3.31 0-6 2.69-6 6s2.69 6 6 6c1.58 0 3.03-.62 4.14-1.72l5.66 5.66 1.41-1.41-5.66-5.66A7.963 7.963 0 0 0 14 16c-4.42 0-8-3.58-8-8s3.58-8 8-8zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
          </svg>
        </button>
        {showFilter && (
          <input
            type="text"
            value={filterValue}
            onChange={handleFilterChange}
            placeholder="Filter by name..."
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        )}
      </div>
    </div>
  );
};

export default BookshelfScene;
