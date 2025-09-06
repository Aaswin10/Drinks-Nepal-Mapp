import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  black: '#111111',
  white: '#FFFFFF',
  gray1: '#626262',
  lightGray: 'rgba(29, 36, 51, 0.65)',
  lightGray2: 'rgba(29, 36, 51, 0.19)',
  lightGray1: 'rgba(225, 230, 239, 0.65)',
  darkGray: '#1D2433A6',
  accent: '#F4303C',
  lightBlue1: '#2F6FED',
  lightBlue2: '#EBF2FC',
  green: '#08875D',
  transparent: 'transparent',
  darkBlue: '#23272F',
  red: '#E02D3C',
  orange: '#B25E09',
};

const FONTS = {
  H1: {
    fontFamily: 'Lato_700Bold',
    fontSize: 32,
    lineHeight: 32 * 1.2,
  },
  H2: {
    fontFamily: 'Lato_700Bold',
    fontSize: 22,
    lineHeight: 22 * 1.2,
  },
  H3: {
    fontFamily: 'Lato_700Bold',
    fontSize: 20,
    lineHeight: 20 * 1.2,
  },
  H4: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    lineHeight: 18 * 1.2,
  },
  H5: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    lineHeight: 16 * 1.2,
  },
  Mulish_400Regular: {
    fontFamily: 'Lato_400Regular',
  },
  Mulish_600SemiBold: {
    fontFamily: 'Lato_700Bold',
  },
  Mulish_700Bold: {
    fontFamily: 'Lato_700Bold',
  },
};

const SIZES = {
  width,
  height,
};

const theme = {
  COLORS,
  FONTS,
  SIZES,
};

export { COLORS, FONTS, SIZES, theme };
