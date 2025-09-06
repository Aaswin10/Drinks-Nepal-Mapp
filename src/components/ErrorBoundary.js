import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../constants';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry for the inconvenience. Please try again.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.COLORS.white,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.COLORS.black,
    marginBottom: 10,
    textAlign: 'center',
    ...theme.FONTS.H2,
  },
  message: {
    fontSize: 16,
    color: theme.COLORS.gray1,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    ...theme.FONTS.Mulish_400Regular,
  },
  retryButton: {
    backgroundColor: theme.COLORS.lightBlue1,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    ...theme.FONTS.Mulish_600SemiBold,
  },
});

export default ErrorBoundary;