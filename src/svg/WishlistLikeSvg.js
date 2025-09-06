import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const WishlistLikeSvg = () => (
  <Svg width={33} height={33} fill="none">
    <Path
      d="M22.762 11.265a3.897 3.897 0 0 0-5.511 0l-.751.751-.75-.75a3.897 3.897 0 1 0-5.512 5.51l.751.751 5.51 5.51 5.512-5.51.75-.75a3.897 3.897 0 0 0 0-5.512Z"
      fill="#F4303C"
      stroke="#F4303C"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect x={0.5} y={0.5} width={32} height={32} rx={16} stroke="#DBE3F5" />
  </Svg>
);

export default WishlistLikeSvg;
