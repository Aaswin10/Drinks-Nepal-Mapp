import { ActivityIndicator, Image, View } from 'react-native';
import React, { useState } from 'react';

import { theme } from '../constants';

const SingleImageItem = ({
  source,
  containerStyle,
  children,
  resizeMode,
  borderRadius,
  indicatorBorderRadius,
  imageStyle,
}) => {
  const [loading, setLoading] = useState(true);

  const onloading = (value) => {
    setLoading(value);
  };

  return (
    <View style={{ ...containerStyle }}>
      {loading && (
        <ActivityIndicator
          size="small"
          color={theme.COLORS.lightGray}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 0,
            opacity: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#EBF2FC',
            borderRadius: indicatorBorderRadius,
          }}
        />
      )}
      <Image
        style={{ height: '100%', width: '100%', ...imageStyle }}
        source={source}
        onLoadStart={() => onloading(true)}
        onLoadEnd={() => onloading(false)}
        resizeMode={resizeMode}
        borderRadius={borderRadius}
      />
      {children}
    </View>
  );
};

export default SingleImageItem;
