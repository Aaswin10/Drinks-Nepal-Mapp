import * as React from 'react';
import Svg, { G, Path, Rect, Defs, ClipPath } from 'react-native-svg';

const ContactMailSvg = () => (
  <Svg width={30} height={30} fill="none">
    <G
      clipPath="url(#a)"
      stroke="#fff"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M10.583 10.083h9.334a1.17 1.17 0 0 1 1.166 1.167v7a1.17 1.17 0 0 1-1.166 1.167h-9.334a1.17 1.17 0 0 1-1.166-1.167v-7a1.17 1.17 0 0 1 1.166-1.167Z" />
      <Path d="m21.083 11.25-5.833 4.083-5.833-4.083" />
    </G>
    <Rect x={0.5} y={0.5} width={29} height={29} rx={14.5} stroke="#DBE3F5" strokeOpacity={0.3} />
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" transform="translate(8.25 7.75)" d="M0 0h14v14H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default ContactMailSvg;
