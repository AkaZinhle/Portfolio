import React from 'react';
import { Project } from '../../types';
import { InfiniteProjectCarousel } from './InfiniteProjectCarousel';

interface SelectedWorkProps {
  onSelectProject: (project: Project) => void;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({ onSelectProject }) => {
  return <InfiniteProjectCarousel onSelectProject={onSelectProject} />;
};
