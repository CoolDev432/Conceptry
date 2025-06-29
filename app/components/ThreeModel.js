'use client';
import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  useGLTF,
} from '@react-three/drei';

const RotatingModel = () => {
  const { scene } = useGLTF('/books.glb');
  console.log(scene)
  const ref = useRef();
  const mouse = useRef([0, 0]);

  useFrame(({ mouse: { x, y } }) => {
    mouse.current = [x, y];
    if (ref.current) {
      ref.current.rotation.y = x * 0.5; 
      ref.current.rotation.x = -y * 0.3; 
    }
  });

  return <primitive ref={ref} object={scene} scale={1.5} />;
};

const ThreeModel = () => {
  const [height, setHeight] = useState(400);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setHeight(300);
      else if (window.innerWidth < 1024) setHeight(400);
      else setHeight(500);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="w-full rounded-[2rem] overflow-hidden"
      style={{ height }}
    >
      <Canvas shadows camera={{ position: [0, 1, 4], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight
          castShadow
          position={[2, 5, 5]}
          intensity={1.2}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Suspense fallback={null}>
          <RotatingModel />
          <ContactShadows
            position={[0, -0.8, 0]}
            opacity={0.5}
            blur={2.5}
            scale={10}
            far={1.5}
          />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
};

export default ThreeModel;
