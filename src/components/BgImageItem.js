/* eslint-disable @typescript-eslint/no-require-imports */

import React, { useState } from 'react';
import { ActivityIndicator, ImageBackground, View } from 'react-native';

import { theme } from '../constants';

const ratio = theme.SIZES.width / 375; //375 is actual image width

const BgImageItem = ({
  item,
  containerStyle,
  children,
  resizeMode,
  borderRadius,
  indicatorBorderRadius,
  imageStyle,
}) => {
  const [loading, setLoading] = useState(true);
  const [elementLoaded, setElementLoaded] = useState(true);

  const onloading = (value) => {
    setLoading(value);
  };

  return (
    <View style={{ ...containerStyle }} key={item.index}>
      {loading && (
        <ActivityIndicator
          size="large"
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
            backgroundColor: theme.COLORS.lightBlue2,
            borderRadius: indicatorBorderRadius,
          }}
        />
      )}
      <ImageBackground
        style={{ height: '100%', width: '100%', ...imageStyle }}
        source={item.image}
        onLoadStart={() => onloading(true)}
        onLoadEnd={() => onloading(false)}
        resizeMode={resizeMode}
        borderRadius={borderRadius}
      >
        {loading === false && (
          <View style={{ width: theme.SIZES.width, height: 425 * ratio }}>
            {elementLoaded === true && (
              <ActivityIndicator
                size="large"
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
                }}
              />
            )}
            <ImageBackground
              source={require('../assets/circle.png')}
              style={{
                width: theme.SIZES.width,
                height: 425 * ratio, //425 is actual height of image
                justifyContent: 'center',
                alignItems: 'center',
              }}
              resizeMode="cover"
              onLoadStart={() => setElementLoaded(true)}
              onLoadEnd={() => setElementLoaded(false)}
            >
              {elementLoaded === false && children}
            </ImageBackground>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

export default BgImageItem;
