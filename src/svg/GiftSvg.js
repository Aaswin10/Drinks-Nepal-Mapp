import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const GiftSvg = () => (
  <Svg width={20} height={20} fill="none">
    <Path
      d="M16.667 10v8.333H3.333V10M18.333 5.833H1.667V10h16.666V5.833ZM10 18.333v-12.5M10 5.833H6.25a2.083 2.083 0 1 1 0-4.166c2.917 0 3.75 4.166 3.75 4.166ZM10 5.833h3.75a2.083 2.083 0 0 0 0-4.166c-2.917 0-3.75 4.166-3.75 4.166Z"
      stroke="#626262"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default GiftSvg;
