import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { Hero } from './components/Hero';
import { Projects, useIsMobile } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Suspense, useEffect, useState } from 'react';
import { Loader } from '@react-three/drei';
import NavBar from './components/NavBar';
import MyBot from './components/myBot'
import { Bot, BotMessageSquare, SendHorizontal } from 'lucide-react';
import {motion,AnimatePresence} from 'framer-motion'
import { getReply } from './utils/main';

const sections = ["home", "projects","skills", "contact"];

function App() {





  return (
    <div className="relative transition-all duration-300 w-full">
      <MyBot></MyBot>
   
      <div className="fixed inset-0 z-0">
        <Canvas>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
        <Loader />
        
      </div>
      <div className="relative z-10">
        <div className="min-h-screen w-full">
          <NavBar></NavBar>
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