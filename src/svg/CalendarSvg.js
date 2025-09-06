import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SvgComponent = () => (
  <Svg width={20} height={20} fill="none">
    <Path
      d="M15.833 3.333H4.167C3.247 3.333 2.5 4.08 2.5 5v11.667c0 .92.746 1.666 1.667 1.666h11.666c.92 0 1.667-.746 1.667-1.666V5c0-.92-.746-1.667-1.667-1.667ZM13.333 1.667V5M6.667 1.667V5M2.5 8.333h15"
      stroke="#626262"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SvgComponent;
