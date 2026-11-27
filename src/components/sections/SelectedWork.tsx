import React, { memo } from 'react';
import { Project } from '../../types';
import { PixelPackShowcase } from './PixelPackShowcase';

interface SelectedWorkProps {
  onSelectProject: (project: Project) => void;
}

const SelectedWorkComponent: React.FC<SelectedWorkProps> = ({ onSelectProject }) => {
  return <PixelPackShowcase onSelectProject={onSelectProject} />;
};

export const SelectedWork = memo(SelectedWorkComponent);
