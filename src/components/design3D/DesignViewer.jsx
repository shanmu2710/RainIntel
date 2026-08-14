import React, { Suspense, useRef, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Box, Cylinder } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const WaterParticles = ({ start, end }) => {
  const points = useRef();
  const particleCount = 20;

  useFrame((state) => {
    if (points.current) {
      const time = state.clock.getElapsedTime();
      const positions = points.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        // Interpolate over logic frame cycle
        const iter = ((time * 0.8) + (i / particleCount)) % 1;
        const currentY = start[1] - iter * (start[1] - end[1]);
        
        positions[i * 3] = start[0];
        positions[i * 3 + 1] = currentY;
        positions[i * 3 + 2] = start[2];
      }
      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const positions = new Float32Array(particleCount * 3);
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.12} color="#3b82f6" transparent opacity={0.8} />
    </points>
  );
};

const ControlsResetter = ({ resetTrigger }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  
  // Save initial camera layout when controls mount so reset() returns here, not 0,0,0
  React.useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.saveState();
    }
  }, []);

  React.useEffect(() => {
    if (resetTrigger > 0 && controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [resetTrigger]);

  return <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} enableRotate={true} />;
};

const RwhScene = ({ data }) => {
  // If exact inputs are absent, fallback only for visual proportioning, not as explicit engineering truths
  const roofArea = data?.roofAreaSqFt || 2000;
  const storageCap = data?.recommendedStorageL || data?.storageCapacityL || 5000;
  
  // Proportional scale computations based on functional Area sizes
  const roofSize = Math.sqrt(roofArea) * 0.12; 
  const tankRadius = Math.max(0.5, Math.min((storageCap / 10000) * 1.5, 2.5));
  const tankHeight = tankRadius * 2.2;

  const roofY = 4;
  const gutterX = roofSize / 2;
  const downpipeX = gutterX;
  const filterY = 1.5;
  const tankY = 0;
  const tankX = roofSize / 2 + tankRadius + 1;
  const pitY = -1;
  const pitX = tankX + tankRadius + 1.5;

  return (
    <group position={[-1.5, -1, 0]}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 5]} intensity={1.5} castShadow />
      
      {/* Roof */}
      <Box args={[roofSize, 0.1, roofSize]} position={[0, roofY, 0]}>
        <meshStandardMaterial color="#64748b" />
        <Html distanceFactor={15} position={[0, 0.5, 0]} center className="thrd-label">
          <strong>Roof Catchment</strong><br/>
          {data?.roofAreaSqFt ? `${Math.round(data.roofAreaSqFt).toLocaleString()} sq ft` : 'Proportional Representation'}
          {!data?.roofSlope && <div style={{fontSize:'8px', color:'#94a3b8', fontStyle: 'italic', marginTop: '2px'}}>Visualized slope — site slope not provided</div>}
        </Html>
      </Box>

      {/* Gutter */}
      <Box args={[0.15, 0.15, roofSize]} position={[gutterX, roofY - 0.05, 0]}>
        <meshStandardMaterial color="#94a3b8" />
        <Html distanceFactor={15} position={[0, 0.4, 0]} center className="thrd-label">
          <strong>Gutter</strong><br/>
          <span style={{fontSize:'9px', color:'#64748b', fontStyle:'italic'}}>Preliminary / estimated routing</span>
        </Html>
      </Box>

      {/* Downpipe */}
      <Cylinder args={[0.08, 0.08, roofY - filterY]} position={[downpipeX, (roofY + filterY)/2, 0]}>
        <meshStandardMaterial color="#cbd5e1" />
      </Cylinder>

      {/* Filter */}
      <Box args={[0.5, 0.5, 0.5]} position={[downpipeX, filterY, 0]}>
        <meshStandardMaterial color="#334155" />
        <Html distanceFactor={15} position={[0, 0.6, 0]} center className="thrd-label">
          <strong>First-Flush / Filter</strong><br/>
          {data?.filterType || 'Standard Mesh'}<br/>
          <span style={{fontSize:'9px', color:'#64748b', fontStyle:'italic'}}>Preliminary scaling</span>
        </Html>
      </Box>

      {/* Storage Pipe connector */}
      <Cylinder args={[0.08, 0.08, tankX - downpipeX]} position={[(downpipeX + tankX)/2, filterY, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <meshStandardMaterial color="#cbd5e1" />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, filterY - tankY - tankHeight/2]} position={[tankX, (filterY + tankY + tankHeight/2)/2, 0]}>
        <meshStandardMaterial color="#cbd5e1" />
      </Cylinder>

      {/* Storage Tank */}
      <Cylinder args={[tankRadius, tankRadius, tankHeight]} position={[tankX, tankY + tankHeight/2, 0]}>
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.65} />
        <Html distanceFactor={15} position={[0, tankHeight/2 + 0.3, 0]} center className="thrd-label">
          <strong>Storage Tank</strong><br/>
          {data?.recommendedStorageL ? `${Math.round(data.recommendedStorageL).toLocaleString()} L` : 'Scaled Capacity'}
        </Html>
      </Cylinder>

      {/* Pit connector */}
      <Cylinder args={[0.08, 0.08, pitX - tankX]} position={[(tankX + pitX)/2, tankY + tankHeight*0.8, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <meshStandardMaterial color="#cbd5e1" />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, (tankY + tankHeight*0.8) - pitY]} position={[pitX, ((tankY + tankHeight*0.8) + pitY)/2, 0]}>
        <meshStandardMaterial color="#cbd5e1" />
      </Cylinder>

      {/* Recharge Pit */}
      <Box args={[1.5, 0.2, 1.5]} position={[pitX, pitY, 0]}>
        <meshStandardMaterial color="#22c55e" />
        <Html distanceFactor={15} position={[0, 0.5, 0]} center className="thrd-label">
          <strong>Recharge System</strong><br/>
          {data?.rechargeType || 'Standard Pit'}<br/>
          <span style={{fontSize:'9px', color:'#64748b', fontStyle:'italic'}}>Preliminary design based on assessment</span>
        </Html>
      </Box>

      {/* Animated Water flow routing */}
      <WaterParticles start={[gutterX, roofY, 0]} end={[downpipeX, filterY + 0.3, 0]} />
      <WaterParticles start={[tankX, filterY - 0.1, 0]} end={[tankX, tankY + tankHeight/2, 0]} />

      <gridHelper args={[25, 25]} position={[0, pitY, 0]} />
    </group>
  );
};

export default function DesignViewer({ assessment, resetTrigger }) {
  return (
    <div className="design-view" style={{ width: '100%', minHeight: '550px', height: '100%', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <ErrorBoundary fallback={<div style={{padding:'20px',color:'#b91c1c'}}>WebGL rendering failed. Your device might lack 3D acceleration.</div>}>
        <Suspense fallback={<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: '500', color: '#64748b' }}>Loading WebGL 3D Visualization...</div>}>
          <Canvas camera={{ position: [5, 4, 10], fov: 50 }}>
            <RwhScene data={assessment} />
            <ControlsResetter resetTrigger={resetTrigger} />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
      
      <style dangerouslySetInnerHTML={{__html: `
        .thrd-label {
          background: rgba(255, 255, 255, 0.95);
          padding: 6px 10px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 11px;
          color: #0f172a;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          pointer-events: none;
          white-space: nowrap;
          border: 1px solid #cbd5e1;
          user-select: none;
        }
      `}} />
    </div>
  );
}
