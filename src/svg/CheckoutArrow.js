import * as React from 'react';
import Svg, { Path, Defs } from 'react-native-svg';

const CheckoutArrow = () => (
  <Svg width={6} height={10} fill="none">
    <Path
      d="m1 9 4-4-4-4"
      stroke="#111"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Defs>
      <Path fill="#fff" d="M0 0h6v10H0z" />
    </Defs>
  </Svg>
);

export default CheckoutArrow;
