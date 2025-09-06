import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ExploreSvg = ({ bgColor = '#DBE3F5', iconColor = '#111' }) => (
  <Svg width={30} height={30} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M5.375 10h2c2 0 3-1 3-3V5c0-2-1-3-3-3h-2c-2 0-3 1-3 3v2c0 2 1 3 3 3zM17.375 10h2c2 0 3-1 3-3V5c0-2-1-3-3-3h-2c-2 0-3 1-3 3v2c0 2 1 3 3 3zM17.375 22h2c2 0 3-1 3-3v-2c0-2-1-3-3-3h-2c-2 0-3 1-3 3v2c0 2 1 3 3 3zM5.375 22h2c2 0 3-1 3-3v-2c0-2-1-3-3-3h-2c-2 0-3 1-3 3v2c0 2 1 3 3 3z"
      stroke={iconColor}
      strokeOpacity={1}
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={bgColor}
    />
  </Svg>
);

export default ExploreSvg;
