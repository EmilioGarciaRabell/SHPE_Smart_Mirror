import React from 'react';
import Traffic from './Traffic';
import PanelWrapper from './PanelWrapper';

function TrafficPanel({ onClose }) {
  return (
    <PanelWrapper title="Traffic Level" onClose={onClose}>
      <Traffic />
    </PanelWrapper>
  );
}

export default TrafficPanel;
