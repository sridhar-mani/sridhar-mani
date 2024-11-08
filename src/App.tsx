import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Suspense } from 'react';
import { Loader } from '@react-three/drei';

function App() {
  return (
    <div className="relative w-full">
      
      <div className="fixed inset-0 z-0">
        <Canvas>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
        <Loader />
      </div>

      <div className="relative z-10">
        <div className="min-h-screen">
          <Hero />
        </div>
        <div className="relative bg-gray-900/70 backdrop-blur-md">
          <Projects />
          <Skills />
          <Contact />
        </div>
      </div>
    </div>
  );
}

export default App;