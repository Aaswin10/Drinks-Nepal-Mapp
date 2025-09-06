import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const HeartWithCircleSvg = ({ strokeColor = '#626262', fillColor }) => (
  <Svg width={33} height={33} fill="none">
    <Path
      d="M22.762 11.265a3.898 3.898 0 0 0-5.511 0l-.751.751-.75-.75a3.897 3.897 0 0 0-5.512 5.51l.751.751 5.511 5.51 5.51-5.51.752-.75a3.897 3.897 0 0 0 0-5.512v0Z"
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect x={0.5} y={0.5} width={32} height={32} rx={16} stroke="#DBE3F5" />
  </Svg>
);

export default HeartWithCircleSvg;
