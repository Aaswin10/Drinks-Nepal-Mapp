import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const SearchSvg = ({ bgColor = '#DBE3F5', iconColor = '#111' }) => (
  <Svg width={40} height={40} fill="none">
    <Circle cx={20} cy={20} r={20} fill={bgColor} />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 11.75a7.25 7.25 0 1 0 0 14.5 7.25 7.25 0 0 0 0-14.5ZM10.25 19a8.75 8.75 0 1 1 17.5 0 8.75 8.75 0 0 1-17.5 0Z"
      fill={iconColor}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.293 24.293a1 1 0 0 1 1.414 0l4.35 4.35a1 1 0 0 1-1.414 1.414l-4.35-4.35a1 1 0 0 1 0-1.414Z"
      fill={iconColor}
    />
  </Svg>
);

export default SearchSvg;
