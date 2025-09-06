import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

const RatingSvg = ({ rating }) => (
  <Svg width={69} height={13} fill="none">
    <G clipPath="url(#a)">
      <Path
        d="m6.71 1.742 1.544 3.13 3.455.505-2.5 2.435.59 3.44-3.09-1.625-3.09 1.625.59-3.44-2.5-2.435 3.455-.505 1.545-3.13Z"
        fill={rating >= 1 ? '#FFCA00' : '#fff'}
        stroke="#FFBE00"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <G clipPath="url(#b)">
      <Path
        d="m20.71 1.742 1.544 3.13 3.455.505-2.5 2.435.59 3.44-3.09-1.625-3.09 1.625.59-3.44-2.5-2.435 3.455-.505 1.545-3.13Z"
        fill={rating >= 2 ? '#FFCA00' : '#fff'}
        stroke="#FFBE00"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <G clipPath="url(#c)">
      <Path
        d="m34.71 1.742 1.544 3.13 3.455.505-2.5 2.435.59 3.44-3.09-1.625-3.09 1.625.59-3.44-2.5-2.435 3.455-.505 1.545-3.13Z"
        fill={rating >= 3 ? '#FFCA00' : '#fff'}
        stroke="#FFBE00"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <G clipPath="url(#d)">
      <Path
        d="m48.71 1.742 1.544 3.13 3.455.505-2.5 2.435.59 3.44-3.09-1.625-3.09 1.625.59-3.44-2.5-2.435 3.455-.505 1.545-3.13Z"
        fill={rating >= 4 ? '#FFCA00' : '#fff'}
        stroke="#FFBE00"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <G clipPath="url(#e)">
      <Path
        d="m62.71 1.742 1.544 3.13 3.455.505-2.5 2.435.59 3.44-3.09-1.625-3.09 1.625.59-3.44-2.5-2.435 3.455-.505 1.545-3.13Z"
        fill={rating >= 5 ? '#FFCA00' : '#fff'}
        stroke="#FFBE00"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" transform="translate(.71 .742)" d="M0 0h12v12H0z" />
      </ClipPath>
      <ClipPath id="b">
        <Path fill="#fff" transform="translate(14.71 .742)" d="M0 0h12v12H0z" />
      </ClipPath>
      <ClipPath id="c">
        <Path fill="#fff" transform="translate(28.71 .742)" d="M0 0h12v12H0z" />
      </ClipPath>
      <ClipPath id="d">
        <Path fill="#fff" transform="translate(42.71 .742)" d="M0 0h12v12H0z" />
      </ClipPath>
      <ClipPath id="e">
        <Path fill="#fff" transform="translate(56.71 .742)" d="M0 0h12v12H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default RatingSvg;
