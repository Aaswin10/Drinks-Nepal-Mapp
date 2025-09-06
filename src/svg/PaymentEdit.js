import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const PaymentEdit = () => (
  <Svg width={16} height={16} fill="none">
    <Path
      d="M8 13.333h6M11 2.333a1.414 1.414 0 1 1 2 2l-8.333 8.334L2 13.333l.667-2.666L11 2.333Z"
      stroke="#626262"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PaymentEdit;
