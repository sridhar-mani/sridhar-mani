import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import { Loader } from "@react-three/drei";
import { Hero } from "./components/Hero";
import LoaderSus from "./components/Loader";

const Scene = React.lazy(() => import("./components/Scene"));
const Projects = React.lazy(() => import("./components/Projects"));
const Skills = React.lazy(() => import("./components/Skills"));
const Contact = React.lazy(() => import("./components/Contact"));
const MyBot = React.lazy(() => import("./components/myBot"));
const NavBar = React.lazy(() => import("./components/NavBar"));

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
          <Suspense fallback={<LoaderSus></LoaderSus>}>
            <NavBar></NavBar>
          </Suspense>
          <Suspense fallback={<LoaderSus></LoaderSus>}>
            <Hero />
          </Suspense>
        </div>
        <div className="relative bg-gray-900/70 backdrop-blur-md">
          <Suspense fallback={<LoaderSus></LoaderSus>}>
            <Projects />
          </Suspense>
          <Suspense fallback={<LoaderSus></LoaderSus>}>
            <Skills />
          </Suspense>
          <Suspense fallback={<LoaderSus></LoaderSus>}>
            <Contact />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default App;
