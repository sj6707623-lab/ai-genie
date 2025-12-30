
import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

// Workaround for JSX IntrinsicElements errors for Three.js elements in this environment
const Mesh = 'mesh' as any;
const SphereGeometry = 'sphereGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const Primitive = 'primitive' as any;
const AmbientLight = 'ambientLight' as any;
const SpotLight = 'spotLight' as any;
const PointLight = 'pointLight' as any;

// Updated to the official pixiv sample model path without the 'packages/three-vrm' prefix which was causing 404.
const STABLE_VRM_URL = 'https://pixiv.github.io/three-vrm/examples/models/vrm/three-vrm-girl.vrm';

const VRMModel = ({ url }: { url: string }) => {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [loadError, setLoadError] = useState(false);
  
  // Use GLTF loader with VRM plugin
  const gltf = useGLTF(url, (loader) => {
    loader.register((parser) => new VRMLoaderPlugin(parser));
  });

  useEffect(() => {
    if (gltf) {
      try {
        VRMUtils.removeUnnecessaryJoints(gltf.scene);
        const vrmData = (gltf.scene.userData as any).vrm as VRM;
        if (vrmData) {
          setVrm(vrmData);
          
          // Pose the model slightly more naturally
          if (vrmData.humanoid) {
            const leftUpperArm = vrmData.humanoid.getRawBoneNode('leftUpperArm');
            const rightUpperArm = vrmData.humanoid.getRawBoneNode('rightUpperArm');
            if (leftUpperArm) leftUpperArm.rotation.z = Math.PI / 3.2;
            if (rightUpperArm) rightUpperArm.rotation.z = -Math.PI / 3.2;
          }
        }
      } catch (err) {
        console.error("Failed to process VRM:", err);
        setLoadError(true);
      }
    }
  }, [gltf]);

  useFrame(({ clock }) => {
    if (vrm) {
      const t = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Breathing animation
      const spine = vrm.humanoid?.getRawBoneNode('spine');
      if (spine) {
        spine.rotation.x = Math.sin(t * 1.2) * 0.01;
      }
      
      // Look around animation
      const head = vrm.humanoid?.getRawBoneNode('head');
      if (head) {
        head.rotation.y = Math.sin(t * 0.5) * 0.1;
        head.rotation.z = Math.cos(t * 0.4) * 0.02;
      }

      vrm.update(delta);
    }
  });

  if (loadError) {
    return (
      <Mesh position={[0, 0, 0]}>
        <SphereGeometry args={[0.5, 32, 32]} />
        <MeshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.5} />
      </Mesh>
    );
  }

  return <Primitive object={gltf.scene} position={[0, -1.4, 0]} />;
};

const AvatarCanvas: React.FC = () => {
  return (
    <div className="w-full h-[300px] bg-indigo-950/20 rounded-2xl relative overflow-hidden border border-indigo-100/50 shadow-inner">
      <Suspense fallback={
        <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-600 bg-slate-50/10 backdrop-blur-md">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
            </div>
          </div>
          <span className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900 animate-pulse">
            Manifesting Genie...
          </span>
        </div>
      }>
        <Canvas 
          camera={{ position: [0, 0, 1.3], fov: 35 }} 
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
          shadows
        >
          <AmbientLight intensity={1.2} />
          <SpotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={2.5} castShadow />
          <PointLight position={[-5, -2, -5]} intensity={1.5} color="#818cf8" />
          <VRMModel url={STABLE_VRM_URL} />
          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            minPolarAngle={Math.PI / 2.5} 
            maxPolarAngle={Math.PI / 2} 
            target={[0, -0.2, 0]}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </Suspense>
      
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
        <div className="px-3 py-1 bg-indigo-600 rounded-full text-[9px] font-black text-white uppercase tracking-tighter shadow-lg">
          3D Assistant Active
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/30">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-[8px] font-bold text-white uppercase tracking-widest">Live</span>
        </div>
      </div>
    </div>
  );
};

export default AvatarCanvas;
