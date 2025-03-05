import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Suspense, useEffect, useState } from 'react';
import { Loader } from '@react-three/drei';
import NavBar from './components/NavBar';

const sections = ["home", "projects","skills", "contact"];

function App() {

  const [activSession,setActivSess] = useState("home");

  useEffect(()=>{
    const overserOptions = {
      root:null,
      rootMargin: '0px',
      threshold:0.5
    }

    const observer = new IntersectionObserver((entries)=>{
      entries.forEach((ent)=>{
        if(ent.isIntersecting){
          setActivSess(ent.target.id)
        }
      })
    },overserOptions)

    sections.forEach((id)=>{
      const sect = document.getElementById(id);
      if(sect) observer.observe(sect)
    })

    return ()=>observer.disconnect()

  },[])

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