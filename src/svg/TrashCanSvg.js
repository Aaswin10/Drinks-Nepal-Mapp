import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const TrashCanSvg = () => (
    <Svg width="65" height="64" viewBox="0 0 65 64" fill="none">
    <Rect x="8.5" y="8" width="48" height="48" rx="24" fill="#2F6FED" />
    <Rect
      x="4.5"
      y="4"
      width="56"
      height="56"
      rx="28"
      stroke="#D3178A"
      strokeOpacity="0.1"
      strokeWidth="8"
    />
    <Path
      d="M41.5 25.98C38.17 25.65 34.82 25.48 31.48 25.48C29.5 25.48 27.52 25.58 25.54 25.78L23.5 25.98"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M29 24.97L29.22 23.66C29.38 22.71 29.5 22 31.19 22H33.81C35.5 22 35.63 22.75 35.78 23.67L36 24.97"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M39.35 29.1399L38.7 39.2099C38.59 40.7799 38.5 41.9999 35.71 41.9999H29.29C26.5 41.9999 26.41 40.7799 26.3 39.2099L25.65 29.1399"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M30.83 36.5H34.16"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M30 32.5H35"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
  );
  
  export default TrashCanSvg;