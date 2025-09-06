import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const BagSvg = ({ iconColor = '#111' }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M7.342 1.667L4.325 4.692M12.658 1.667l3.017 3.025"
      stroke={iconColor}
      strokeOpacity={1}
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M1.667 6.542c0-1.542.825-1.667 1.85-1.667h12.967c1.025 0 1.85.125 1.85 1.667 0 1.791-.825 1.666-1.85 1.666H3.517c-1.025 0-1.85.125-1.85-1.666z"
      stroke={iconColor}
      strokeOpacity={1}
      strokeWidth={1.5}
    />
    <Path
      d="M8.134 11.667v2.958M11.967 11.667v2.958M2.917 8.333l1.175 7.2c.267 1.617.908 2.8 3.292 2.8h5.025c2.591 0 2.975-1.133 3.275-2.7l1.4-7.3"
      stroke={iconColor}
      strokeOpacity={1}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);

export default BagSvg;
