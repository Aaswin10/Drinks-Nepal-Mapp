import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const UserSvg = ({ iconColor = '#111' }) => (
  <Svg width={30} height={30} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M12.875 12a5 5 0 100-10 5 5 0 000 10zM21.465 22c0-3.87-3.85-7-8.59-7s-8.59 3.13-8.59 7"
      stroke={iconColor}
      strokeOpacity={1}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default UserSvg;
