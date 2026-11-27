import React, { Component, ErrorInfo, ReactNode, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { RotateCw, Eye, Compass, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { BodyType } from '../types/car';
import { SafeImage } from './BrandMark';

interface CarViewer3DProps {
  bodyType: BodyType;
  paintHex: string;
  model3d?: string;
  fallbackImage: string;
  carName: string;
}

const isSoftwareWebGL = (() => {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
})();

class ViewerErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }
  componentDidCatch(_err: Error, _info: ErrorInfo) {
    // Handled gracefully via fallback
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _targetColor = new THREE.Color();

interface CameraRigProps {
  viewMode: 'exterior' | 'interior';
  autoRotate: boolean;
  resetSignal: number;
}

const CameraRig: React.FC<CameraRigProps> = ({ viewMode, autoRotate, resetSignal }) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera } = useThree();
  const isTransitioning = useRef(true);

  useEffect(() => {
    isTransitioning.current = true;
  }, [viewMode, resetSignal]);

  useFrame((_state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (isTransitioning.current) {
      if (viewMode === 'exterior') {
        _targetPos.set(4.1, 1.55, 4.4);
        _targetLook.set(0, 0.58, 0);
      } else {
        // Inside the driver/cabin perspective looking over steering wheel & dash
        _targetPos.set(-0.34, 1.04, 0.28);
        _targetLook.set(1.2, 0.88, 0.08);
      }

      const lambda = 5.5;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetPos.x, lambda, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetPos.y, lambda, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetPos.z, lambda, delta);

      controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetLook.x, lambda, delta);
      controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetLook.y, lambda, delta);
      controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetLook.z, lambda, delta);

      if (camera.position.distanceTo(_targetPos) < 0.02) {
        isTransitioning.current = false;
      }
    }

    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping={!isSoftwareWebGL}
      dampingFactor={0.06}
      autoRotate={autoRotate && !isSoftwareWebGL && viewMode === 'exterior'}
      autoRotateSpeed={1.1}
      minDistance={viewMode === 'interior' ? 0.1 : 2.6}
      maxDistance={viewMode === 'interior' ? 1.8 : 9.5}
      maxPolarAngle={viewMode === 'interior' ? Math.PI * 0.65 : Math.PI / 2 - 0.04}
      minPolarAngle={viewMode === 'interior' ? Math.PI * 0.25 : 0.15}
      onStart={() => {
        isTransitioning.current = false;
      }}
    />
  );
};

interface ProceduralVehicleProps {
  bodyType: BodyType;
  paintHex: string;
}

const ProceduralVehicle: React.FC<ProceduralVehicleProps> = ({ bodyType, paintHex }) => {
  const paintMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const isSUV = bodyType === 'SUV' || bodyType === 'Pickup' || bodyType === 'Luxury';
  const isCoupe = bodyType === 'Coupe';

  const bodyGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const roofH = isSUV ? 1.56 : isCoupe ? 1.24 : 1.32;
    const hoodH = isSUV ? 0.96 : 0.8;
    const beltH = isSUV ? 1.02 : 0.86;

    // Side profile (X = front(+2.25) to rear(-2.25), Y = height)
    shape.moveTo(-2.15, 0.34);
    shape.lineTo(2.15, 0.34);
    shape.lineTo(2.26, 0.56);
    shape.lineTo(2.2, hoodH);
    shape.lineTo(1.12, beltH);
    shape.lineTo(0.42, roofH);
    if (isSUV) {
      shape.lineTo(-1.75, roofH);
      shape.lineTo(-2.16, beltH + 0.08);
    } else if (isCoupe) {
      shape.lineTo(-0.48, roofH);
      shape.lineTo(-1.82, beltH + 0.06);
      shape.lineTo(-2.18, 0.72);
    } else {
      shape.lineTo(-0.68, roofH);
      shape.lineTo(-1.55, beltH + 0.04);
      shape.lineTo(-2.16, 0.76);
    }
    shape.lineTo(-2.22, 0.45);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 1.72,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.07,
      bevelSegments: 4,
    });
    geo.translate(0, 0, -0.86);
    geo.computeVertexNormals();
    return geo;
  }, [isSUV, isCoupe]);

  const greenhouseGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const roofH = isSUV ? 1.52 : isCoupe ? 1.2 : 1.28;
    const beltH = isSUV ? 1.03 : 0.87;
    shape.moveTo(-1.62, beltH);
    shape.lineTo(1.02, beltH);
    shape.lineTo(0.4, roofH);
    shape.lineTo(isSUV ? -1.68 : -0.64, roofH);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 1.56,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 2,
    });
    geo.translate(0, 0, -0.78);
    return geo;
  }, [isSUV, isCoupe]);

  useEffect(() => {
    return () => {
      bodyGeometry.dispose();
      greenhouseGeometry.dispose();
    };
  }, [bodyGeometry, greenhouseGeometry]);

  useFrame((_state, delta) => {
    if (paintMaterialRef.current) {
      _targetColor.set(paintHex);
      paintMaterialRef.current.color.lerp(_targetColor, Math.min(1, delta * 8));
    }
  });

  const wheelPositions: [number, number, number][] = [
    [1.38, 0.36, 0.88],
    [1.38, 0.36, -0.88],
    [-1.38, 0.36, 0.88],
    [-1.38, 0.36, -0.88],
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Main Sculpted Chassis */}
      <mesh geometry={bodyGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          ref={paintMaterialRef}
          color={paintHex}
          metalness={0.86}
          roughness={0.22}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          envMapIntensity={1.35}
        />
      </mesh>

      {/* Tinted Greenhouse Glass */}
      <mesh geometry={greenhouseGeometry}>
        <meshPhysicalMaterial
          color="#0D1117"
          metalness={0.1}
          roughness={0.06}
          clearcoat={1}
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </mesh>

      {/* Interior Cabin (Visible through glass and in Interior Camera Mode) */}
      <group>
        {/* Cabin Floor */}
        <mesh position={[-0.2, 0.44, 0]}>
          <boxGeometry args={[2.1, 0.06, 1.44]} />
          <meshStandardMaterial color="#1A1817" roughness={0.9} metalness={0.05} />
        </mesh>
        {/* Cognac Leather Seats (Front Left/Right + Rear Bench) */}
        {[-0.36, 0.36].map((zPos, i) => (
          <group key={i} position={[-0.08, 0.62, zPos]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.52, 0.14, 0.46]} />
              <meshStandardMaterial color="#8B532B" roughness={0.55} metalness={0.08} />
            </mesh>
            <mesh position={[-0.2, 0.28, 0]} rotation={[0, 0, 0.16]}>
              <boxGeometry args={[0.14, 0.56, 0.44]} />
              <meshStandardMaterial color="#8B532B" roughness={0.55} metalness={0.08} />
            </mesh>
          </group>
        ))}
        {/* Rear Luxury Bench */}
        <mesh position={[-1.05, 0.66, 0]}>
          <boxGeometry args={[0.52, 0.22, 1.32]} />
          <meshStandardMaterial color="#8B532B" roughness={0.55} />
        </mesh>
        {/* Dashboard & Walnut Trim */}
        <mesh position={[0.72, 0.78, 0]}>
          <boxGeometry args={[0.48, 0.24, 1.42]} />
          <meshStandardMaterial color="#18191C" roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Glowing Digital Infotainment Cluster */}
        <mesh position={[0.52, 0.9, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.68, 0.16]} />
          <meshStandardMaterial color="#111827" emissive="#C8A253" emissiveIntensity={0.45} roughness={0.2} />
        </mesh>
        {/* Steering Wheel */}
        <mesh position={[0.38, 0.89, 0.35]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.15, 0.022, 12, 28]} />
          <meshStandardMaterial color="#27272A" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>

      {/* Front Grille & Chrome Accents */}
      <mesh position={[2.25, 0.58, 0]}>
        <boxGeometry args={[0.08, 0.26, 1.06]} />
        <meshStandardMaterial color="#141518" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[2.27, 0.58, 0]}>
        <boxGeometry args={[0.02, 0.28, 1.1]} />
        <meshStandardMaterial color="#D4D4D8" metalness={0.95} roughness={0.15} wireframe />
      </mesh>

      {/* LED Headlights */}
      {[-0.64, 0.64].map((z, idx) => (
        <mesh key={idx} position={[2.24, 0.72, z]}>
          <boxGeometry args={[0.09, 0.07, 0.34]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFF8E7" emissiveIntensity={2.2} roughness={0.1} />
        </mesh>
      ))}

      {/* Rear LED Taillight Bar */}
      <mesh position={[-2.21, 0.76, 0]}>
        <boxGeometry args={[0.06, 0.065, 1.54]} />
        <meshStandardMaterial color="#B91C1C" emissive="#EF4444" emissiveIntensity={1.6} roughness={0.2} />
      </mesh>

      {/* Side Mirrors */}
      {[-0.96, 0.96].map((z, idx) => (
        <mesh key={idx} position={[0.72, 0.98, z]}>
          <boxGeometry args={[0.16, 0.1, 0.18]} />
          <meshStandardMaterial color={paintHex} metalness={0.8} roughness={0.25} />
        </mesh>
      ))}

      {/* 4 Multi-Spoke Wheels + Calipers */}
      {wheelPositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.36, 0.36, 0.24, 32]} />
            <meshStandardMaterial color="#141517" roughness={0.85} metalness={0.05} />
          </mesh>
          {/* Alloy Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.255, 20]} />
            <meshStandardMaterial color="#C9CDD4" metalness={0.94} roughness={0.16} />
          </mesh>
          {/* Gold Brake Caliper */}
          <mesh position={[0, 0.02, pos[2] > 0 ? 0.04 : -0.04]}>
            <boxGeometry args={[0.14, 0.12, 0.08]} />
            <meshStandardMaterial color="#C8A253" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>
      ))}

      {/* Showroom Turntable Plinth */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[3.15, 3.25, 0.04, 64]} />
        <meshStandardMaterial color="#111317" metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.12, 3.16, 64]} />
        <meshStandardMaterial color="#C8A253" emissive="#C8A253" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
};

interface ExternalGltfModelProps {
  url: string;
  paintHex: string;
  onFailure: () => void;
}

const ExternalGltfModel: React.FC<ExternalGltfModelProps> = ({ url, paintHex, onFailure }) => {
  const [sceneGroup, setSceneGroup] = useState<THREE.Group | null>(null);
  const paintMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  useEffect(() => {
    let active = true;
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        if (!active) return;
        const root = gltf.scene;
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetScale = 4.4 / maxDim;
        root.scale.setScalar(targetScale);
        root.position.set(-center.x * targetScale, -box.min.y * targetScale, -center.z * targetScale);

        const paintMats: THREE.MeshStandardMaterial[] = [];
        root.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat && mat.name && /paint|body|coat|exterior|car/i.test(mat.name)) {
              paintMats.push(mat);
            }
          }
        });
        paintMaterialsRef.current = paintMats;
        setSceneGroup(root);
      },
      undefined,
      () => {
        if (active) onFailure();
      }
    );

    return () => {
      active = false;
    };
  }, [url, onFailure]);

  useEffect(() => {
    paintMaterialsRef.current.forEach((mat) => {
      mat.color.set(paintHex);
      if ('metalness' in mat) mat.metalness = 0.85;
      if ('roughness' in mat) mat.roughness = 0.22;
      mat.needsUpdate = true;
    });
  }, [paintHex, sceneGroup]);

  if (!sceneGroup) return null;
  return <primitive object={sceneGroup} />;
};

export const CarViewer3D: React.FC<CarViewer3DProps> = ({
  bodyType,
  paintHex,
  model3d,
  fallbackImage,
  carName,
}) => {
  const [viewMode, setViewMode] = useState<'exterior' | 'interior'>('exterior');
  const [autoRotate, setAutoRotate] = useState(!isSoftwareWebGL);
  const [resetSignal, setResetSignal] = useState(0);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [gltfFailed, setGltfFailed] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const hasValidExternalGlb = Boolean(model3d && model3d.trim().length > 0 && !gltfFailed);

  const fallbackUI = (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-[#101214]">
      <SafeImage src={fallbackImage} alt={carName} fallbackTitle={carName} />
      <div className="absolute bottom-4 left-4 rounded bg-black/80 px-3 py-1.5 text-xs text-[#E0BE74] border border-white/10">
        2D Studio Preview Active
      </div>
    </div>
  );

  if (contextLost) {
    return fallbackUI;
  }

  return (
    <div className="relative h-[420px] sm:h-[520px] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0A0B0D]">
      <ViewerErrorBoundary fallback={fallbackUI}>
        <Canvas
          shadows={!isSoftwareWebGL}
          dpr={isSoftwareWebGL ? 1 : [1, 2]}
          camera={{ position: [4.1, 1.55, 4.4], fov: 42, near: 0.08, far: 100 }}
          gl={{
            antialias: !isSoftwareWebGL,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.08,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              setContextLost(true);
            });
            gl.domElement.addEventListener('webglcontextrestored', () => {
              setContextLost(false);
            });
          }}
        >
          <color attach="background" args={['#090A0D']} />
          <fog attach="fog" args={['#090A0D', 10, 26]} />

          {/* Studio 3-Point + Softbox Lighting */}
          <hemisphereLight args={['#B8C4D9', '#1D1914', 0.45]} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={2.1}
            color="#FFF4DF"
            castShadow={!isSoftwareWebGL}
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0005}
            shadow-normalBias={0.02}
          />
          <directionalLight position={[-6, 3, -5]} intensity={1.1} color="#9BB6DF" />

          {/* Procedural Studio Environment Map (Zero External HDR 404s) */}
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={2.6} color="#FFF8EC" position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 4, 1]} />
            <Lightformer form="rect" intensity={1.8} color="#DCE7F7" position={[-6, 2, 4]} rotation={[0, Math.PI / 2, 0]} scale={[8, 2, 1]} />
            <Lightformer form="rect" intensity={1.5} color="#E0BE74" position={[6, 2, -4]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 2, 1]} />
          </Environment>

          <Suspense fallback={null}>
            {hasValidExternalGlb && model3d ? (
              <ExternalGltfModel
                url={model3d}
                paintHex={paintHex}
                onFailure={() => setGltfFailed(true)}
              />
            ) : (
              <ProceduralVehicle bodyType={bodyType} paintHex={paintHex} />
            )}
          </Suspense>

          {!isSoftwareWebGL && (
            <ContactShadows position={[0, 0.005, 0]} opacity={0.55} scale={9} blur={2.2} far={2.5} />
          )}

          <CameraRig viewMode={viewMode} autoRotate={autoRotate} resetSignal={resetSignal} />
        </Canvas>
      </ViewerErrorBoundary>

      {/* Top-Left Minimal Spec Label (No Backdrop-Filter Over WebGL) */}
      <div className="pointer-events-none absolute top-4 left-4 z-10 rounded-md bg-[#08090A]/85 px-3 py-1.5 border border-white/10">
        <p className="text-[11px] font-medium text-[#E0BE74]">
          {hasValidExternalGlb ? 'Interactive 3D Model' : '3D Studio Configurator'}
          <span className="mx-1.5 text-white/30">·</span>
          <span className="text-[#D1D5DB]">Drag to orbit 360° · Scroll to zoom</span>
        </p>
      </div>

      {/* Collapsible Bottom Control Dock (Zero Viewport Occlusion, Solid Background) */}
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center max-w-[94vw]">
        <button
          type="button"
          onClick={() => setHudCollapsed((c) => !c)}
          className="mb-1.5 inline-flex items-center gap-1 rounded-t-md border border-white/15 bg-[#101214]/95 px-3 py-1 text-[11px] font-medium text-[#D1D5DB] hover:text-[#E0BE74] cursor-pointer"
        >
          {hudCollapsed ? (
            <>
              <ChevronUp className="h-3 w-3" aria-hidden="true" />
              Show 3D Controls
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
              Hide Controls
            </>
          )}
        </button>

        {!hudCollapsed && (
          <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#101214]/95 px-3 py-2 shadow-xl">
            <div className="inline-flex rounded-md bg-[#08090A] p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('exterior')}
                className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  viewMode === 'exterior'
                    ? 'bg-[#C8A253] text-[#08090A]'
                    : 'text-[#D1D5DB] hover:text-white'
                }`}
              >
                <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                Exterior
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('interior');
                  setAutoRotate(false);
                }}
                className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  viewMode === 'interior'
                    ? 'bg-[#C8A253] text-[#08090A]'
                    : 'text-[#D1D5DB] hover:text-white'
                }`}
              >
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                Interior
              </button>
            </div>

            <button
              type="button"
              onClick={() => setAutoRotate((r) => !r)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                autoRotate
                  ? 'border-[#C8A253]/60 bg-[#C8A253]/15 text-[#E0BE74]'
                  : 'border-white/15 bg-[#171A1E] text-[#D1D5DB] hover:text-white'
              }`}
            >
              <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
              {autoRotate ? 'Auto-Rotate On' : 'Auto-Rotate Off'}
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('exterior');
                setResetSignal((s) => s + 1);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-[#171A1E] px-3 py-1.5 text-xs font-medium text-[#D1D5DB] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset View
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
