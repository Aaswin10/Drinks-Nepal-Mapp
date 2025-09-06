import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';
import { theme } from '../constants';

const LoadingSpinner = ({ 
  size = 'large', 
  color = theme.COLORS.lightBlue1, 
  text = null,
  overlay = false,
  style 
}) => {
  const { getScaledSize } = useResponsiveDimensions();
  
  const styles = React.useMemo(() => createStyles(getScaledSize, overlay), [getScaledSize, overlay]);

  const Container = overlay ? View : React.Fragment;
  const containerProps = overlay ? { style: styles.overlay } : {};

  return (
    <Container {...containerProps}>
      <View style={[styles.container, style]}>
        <ActivityIndicator size={size} color={color} />
        {text && <Text style={styles.text}>{text}</Text>}
        }
      </View>
    </Container>
  );
};

const createStyles = (getScaledSize, overlay) => StyleSheet.create({
  overlay: overlay ? {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  } : {},
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: getScaledSize(20),
  },
  text: {
    marginTop: getScaledSize(12),
    fontSize: getScaledSize(16),
    color: theme.COLORS.gray1,
    ...theme.FONTS.Mulish_400Regular,
    textAlign: 'center',
  },
});

export default LoadingSpinner;