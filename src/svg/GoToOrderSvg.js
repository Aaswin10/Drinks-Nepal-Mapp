import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const GoToOrderSvg = () => (
  <Svg width={40} height={40} fill="none">
    <Circle opacity={0.3} cx={20} cy={20} r={20} fill="#B3B9C7" />
    <Path
      d="M13 20h14M20 13l7 7-7 7"
      stroke="#111"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default GoToOrderSvg;
