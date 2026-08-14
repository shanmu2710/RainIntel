import React, { useState, useRef, useEffect } from 'react';
import PageHeading from '../../components/common/PageHeading';
import Button from '../../components/common/Button';
import DesignViewer from '../../components/design3D/DesignViewer';
import DesignSpecificationPanel from '../../components/design3D/DesignSpecificationPanel';

export default function Design3D({ assessment }) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
       alert("Fullscreen is unavailable in this browser.");
    }
  };

  const handleReset = () => {
    setResetTrigger(prev => prev + 1);
  };
  if (!assessment) {
    return (
      <>
        <PageHeading
          title="3D system design"
          subtitle="Interactive recommended rainwater harvesting layout."
        />
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          No assessment selected. Please select an existing survey to view its engineering design.
        </div>
      </>
    );
  }

  return (
    <div ref={containerRef} style={{ background: isFullscreen ? '#fff' : 'transparent', padding: isFullscreen ? '24px' : '0', overflowY: isFullscreen ? 'auto' : 'visible', minHeight: isFullscreen ? '100vh' : 'auto' }}>
      <PageHeading
        title="3D system design"
        subtitle="Interactive recommended rainwater harvesting layout."
        actions={
          <>
            <Button variant="secondary" icon="rotate-3d" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="secondary" icon="maximize" onClick={handleFullscreen}>
              {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </Button>
          </>
        }
      />

      <div className="design-3d-layout">
        <DesignViewer assessment={assessment} resetTrigger={resetTrigger} />
        <DesignSpecificationPanel assessment={assessment} />
        
        <style dangerouslySetInnerHTML={{__html: `
          .design-3d-layout {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
          }
          @media (min-width: 1024px) {
            .design-3d-layout {
              grid-template-columns: 2fr 1fr;
            }
          }
        `}} />
      </div>
    </div>
  );
}
