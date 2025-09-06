import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const ProductLikeSvg = ({ fillColor = '#fff', strokeColor = '#626262' }) => (
  <Svg width={44} height={44} fill="none">
    <Path
      d="M29.367 15.842a4.584 4.584 0 0 0-6.484 0l-.883.883-.883-.883a4.584 4.584 0 0 0-6.484 6.483l.884.883L22 29.692l6.483-6.484.884-.883a4.582 4.582 0 0 0 0-6.483v0Z"
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect x={0.5} y={0.5} width={43} height={43} rx={21.5} stroke="#DBE3F5" />
  </Svg>
);

export default ProductLikeSvg;
