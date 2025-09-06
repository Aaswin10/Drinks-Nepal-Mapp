import { MapPin } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../constants';

const LocationSelector = ({
  currentLocation = 'Current Location',
  setIsLocationModalVisible = () => {},
}) => {
  return (
    <TouchableOpacity
      onPress={() => setIsLocationModalVisible(true)}
      className="flex flex-row items-end justify-start gap-1"
    >
      <MapPin color={theme.COLORS.lightBlue1} size={15} />
      <View>
        <Text
          style={{
            ...theme.FONTS.Mulish_400Regular,
            fontSize: 15,
            color: theme.COLORS.lightBlue1,
          }}
        >
          {currentLocation || 'Select City'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default LocationSelector;
