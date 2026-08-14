import React from 'react';
import LucideIcon from '../common/LucideIcon';

export default function GisMapControls({ onZoomIn, onZoomOut, onLocate, onCompass, onFullscreen, isFullscreen }) {
  return (
    <div className="map-tools">
      <button type="button" onClick={onZoomIn}>
        <LucideIcon name="plus" />
      </button>
      <button type="button" onClick={onZoomOut}>
        <LucideIcon name="minus" />
      </button>
      <button type="button" onClick={onLocate}>
        <LucideIcon name="locate-fixed" />
      </button>
      <button type="button" onClick={onCompass} title="Reset view">
        <LucideIcon name="compass" />
      </button>
      <button type="button" onClick={onFullscreen} title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
        <LucideIcon name={isFullscreen ? 'minimize' : 'maximize'} />
      </button>
    </div>
  );
}
