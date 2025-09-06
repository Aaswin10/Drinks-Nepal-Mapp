import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const OrderSvg = ({ iconColor = '#111' }) => (
  <Svg width={25} height={24} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M22.625 12c0 5.52-4.48 10-10 10s-10-4.48-10-10 4.48-10 10-10 10 4.48 10 10z"
      stroke={iconColor}
      strokeOpacity={1}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.335 15.18l-3.1-1.85c-.54-.32-.98-1.09-.98-1.72v-4.1"
      stroke={iconColor}
      strokeOpacity={1}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default OrderSvg;
