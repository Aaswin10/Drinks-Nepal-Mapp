import React from 'react';
import Svg, { Path } from 'react-native-svg';

const PlusBlueSvg = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 12H18"
      stroke="#2F6FED"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 18V6"
      stroke="#2F6FED"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PlusBlueSvg;
