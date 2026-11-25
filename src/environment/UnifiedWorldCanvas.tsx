import React from 'react';
import { PixelValleyCanvas } from './PixelValleyCanvas';

interface UnifiedWorldCanvasProps {
  enabled?: boolean;
  intensity?: number;
  onKoiClick?: () => void;
  onExplorerClick?: () => void;
}

export const UnifiedWorldCanvas: React.FC<UnifiedWorldCanvasProps> = ({
  enabled = true,
}) => {
  return <PixelValleyCanvas enabled={enabled} />;
};

export { PixelValleyCanvas };

