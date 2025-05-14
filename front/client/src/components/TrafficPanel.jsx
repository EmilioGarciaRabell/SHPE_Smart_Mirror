import React from 'react';
import Traffic from './Traffic';
import PanelWrapper from './PanelWrapper';
import {FaCar} from 'react-icons/fa';

function TrafficPanel({ onClose }) {
  return (
    <PanelWrapper title="Traffic Level" icon={<FaCar />} onClose={onClose}>
      <Traffic />
    </PanelWrapper>
  );
}

export default TrafficPanel;
