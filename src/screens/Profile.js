import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../store/selectors';
import { components } from '../components';
import { setScreen } from '../store/tabSlice';
import { setIsAuthenticated, setUser } from '../store/userSlice';
import { svg } from '../svg';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const dispatch = useDispatch();

  const handleSignOut = () => {
    setShowLogoutPopup(true);
  };

  const user = useSelector(selectUser);
  const userName = user?.fullName;
  const phoneNumber = user?.phoneNumber;

  const confirmLogout = () => {
    console.log('User logged out');
    dispatch(setIsAuthenticated(false));
    dispatch(setUser(null));
    AsyncStorage.removeItem('accessToken');
    AsyncStorage.removeItem('refreshToken');
    dispatch(setScreen('Home'));
    navigation.navigate('Onboarding');
    setShowLogoutPopup(false);
  };

  return (
    <ScrollView className="bg-[#f0f4f8] h-full">
      <View className="bg-white p-4">
        <Text className="text-xl text-[#1D2433] font-bold leading-8">Profile</Text>
      </View>
      <View className="bg-white mt-2 p-4 flex-row items-center space-x-4 mb-2">
        <View className="mx-3 flex-1">
          <Text className="text-base leading-5 font-bold">{userName}</Text>
          <Text className="text-gray-500">+977 {phoneNumber}</Text>
        </View>
        <Text className="text-blue-600 font-bold">Points: $$$</Text>
      </View>
      <View className="bg-white p-4 rounded-lg mx-3 flex space-y-5">
        <View className="flex flex-row gap-3">
          <View className="bg-[#2F6FED] rounded-tr-full rounded-br-full w-1 h-6" />
          <Text className="text-lg font-semibold">Accounts</Text>
        </View>
        <View>
          <components.ProfileCategory
            title="Saved Address"
            icon={<svg.MapPinSvg />}
            onPress={() => navigation.navigate('MyAddress')}
          />
          <components.ProfileCategory
            title="About Us"
            icon={<svg.AboutUsIcon />}
            onPress={() => navigation.navigate('AboutUs')}
          />
          <components.ProfileCategory
            title="Sign Out"
            icon={<svg.LogOutSvg />}
            onPress={handleSignOut}
          />
        </View>
      </View>
      <Modal animationType="fade" transparent={true} visible={showLogoutPopup}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 35,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <svg.TrashCanSvg />
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
              Are you sure you want to log out?
            </Text>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
              Just a quick check
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  borderColor: '#4285F4',
                  borderWidth: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderRadius: 20,
                }}
                onPress={() => setShowLogoutPopup(false)}
              >
                <Text style={{ color: '#4285F4' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#4285F4',
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderRadius: 20,
                }}
                onPress={confirmLogout}
              >
                <Text style={{ color: 'white' }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;
