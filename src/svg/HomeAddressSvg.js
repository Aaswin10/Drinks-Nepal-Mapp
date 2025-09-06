import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const HomeAddress = () => (
  <Svg width={20} height={20} fill="none">
    <Path
      d="M2.5 7.5 10 1.667 17.5 7.5v9.167a1.667 1.667 0 0 1-1.667 1.666H4.167A1.667 1.667 0 0 1 2.5 16.667V7.5Z"
      stroke="#626262"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.5 18.333V10h5v8.333"
      stroke="#626262"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default HomeAddress;
