import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const PlusSvg = () => (
  <Svg width={14} height={14} fill="none">
    <Path
      d="M6.955 2.917v8.166M2.898 7h8.114"
      stroke="#111"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PlusSvg;
