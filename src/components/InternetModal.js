import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';
import { theme } from '../constants';

export default function InternetModal() {
  const isConnected = useSelector(state => state.connectivity.isConnected);
  const { getScaledSize } = useResponsiveDimensions();

  const styles = React.useMemo(() => createStyles(getScaledSize), [getScaledSize]);

  const handleRetry = () => {
    // Force a network check
    console.log('Retrying connection...');
  };

  return (
    <Modal visible={!isConnected} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ActivityIndicator 
            size="large" 
            color={theme.COLORS.lightBlue1} 
            style={styles.spinner}
          />
          <Text style={styles.title}>No Internet Connection</Text>
          <Text style={styles.message}>
            Please check your network and try again.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (getScaledSize) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getScaledSize(20),
  },
  modal: {
    width: '100%',
    maxWidth: getScaledSize(350),
    backgroundColor: '#fff',
    borderRadius: getScaledSize(15),
    padding: getScaledSize(25),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  spinner: {
    marginBottom: getScaledSize(15),
  },
  title: {
    fontSize: getScaledSize(18),
    fontWeight: '700',
    marginBottom: getScaledSize(10),
    color: theme.COLORS.black,
    ...theme.FONTS.H3,
  },
  message: {
    fontSize: getScaledSize(14),
    color: theme.COLORS.gray1,
    textAlign: 'center',
    marginBottom: getScaledSize(20),
    ...theme.FONTS.Mulish_400Regular,
    lineHeight: getScaledSize(20),
  },
  retryButton: {
    backgroundColor: theme.COLORS.lightBlue1,
    paddingVertical: getScaledSize(12),
    paddingHorizontal: getScaledSize(30),
    borderRadius: getScaledSize(25),
    minWidth: getScaledSize(120),
  },
  retryText: {
    color: 'white',
    fontSize: getScaledSize(16),
    fontWeight: 'bold',
    ...theme.FONTS.Mulish_600SemiBold,
  },
});
