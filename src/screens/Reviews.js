import { useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { components } from '../components';
import { theme } from '../constants';
import { svg } from '../svg';

const Reviews = () => {
  const route = useRoute();
  const { reviews } = route.params;

  const renderHeader = () => {
    return <components.Header title="Reviews" goBack={true} />;
  };

  const renderContent = () => {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {reviews.map((item, index, array) => {
          return (
            <View
              key={item.id}
              style={{
                width: '100%',
                paddingVertical: 20,
                borderColor: theme.COLORS.lightBlue1,
                borderBottomWidth: array.length - 1 === index ? 0 : 1,
                paddingHorizontal: 20,
                flexDirection: 'row',
              }}
            >
              <components.ImageItem
                item={item}
                containerStyle={{ width: 50, height: 50, marginRight: 14 }}
                imageStyle={{ borderRadius: 25 }}
              />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      ...theme.FONTS.H5,
                      color: theme.COLORS.black,
                      lineHeight: 16 * 1.2,
                      marginBottom: 6,
                    }}
                  >
                    {item.name}
                  </Text>
                  <svg.RatingSvg rating={item.rating} />
                </View>
                <Text
                  style={{
                    ...theme.FONTS.Mulish_400Regular,
                    fontSize: 10,
                    color: theme.COLORS.gray1,
                    lineHeight: 10 * 1.5,
                    marginBottom: 10,
                  }}
                >
                  {item.created_at}
                </Text>
                <Text
                  style={{
                    ...theme.FONTS.Mulish_400Regular,
                    fontSize: 14,
                    lineHeight: 14 * 1.5,
                    color: theme.COLORS.gray1,
                  }}
                >
                  {item.comment}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default Reviews;
