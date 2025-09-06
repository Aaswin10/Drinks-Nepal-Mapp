import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const WishlistSvg = ({ bgColor = '#DBE3F5', iconColor = '#111' }) => (
  <Svg width={40} height={40} fill="none">
    <Circle cx={20} cy={20} r={20} fill={bgColor} />
    <Path
      d="M28.84 12.61a5.5 5.5 0 0 0-7.78 0L20 13.67l-1.06-1.06a5.501 5.501 0 0 0-7.78 7.78l1.06 1.06L20 29.23l7.78-7.78 1.06-1.06a5.501 5.501 0 0 0 0-7.78v0Z"
      stroke={iconColor}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default WishlistSvg;
