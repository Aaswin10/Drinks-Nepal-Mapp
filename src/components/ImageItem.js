import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';

import { theme } from '../constants';

const ImageItem = ({
  item,
  containerStyle,
  children,
  resizeMode,
  borderRadius,
  indicatorBorderRadius,
}) => {
  const [loading, setLoading] = useState(true);
  const imageUri = item?.images && item?.images?.length > 0 ? item?.images[0] : null;

  useEffect(() => {
    // Keep loader visible if no image
    if (!imageUri) {
      setLoading(true);
    }
  }, [imageUri]);

  const onloading = (value) => {
    // Only update loading state if there is an image
    if (imageUri) {
      setLoading(value);
    }
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
            borderColor: theme.COLORS.lightBlue2,
            borderWidth: 1,
          }}
        />
      )}
      <Image
        key={item?.id}
        style={{ width: '100%', height: '90%', borderRadius: borderRadius }}
        source={{
          uri: imageUri,
        }}
        onLoadStart={() => onloading(true)}
        onLoadEnd={() => onloading(false)}
        resizeMode={resizeMode}
      />
      {children}
    </View>
  );
};

export default ImageItem;
