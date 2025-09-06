import { View, Text, ScrollView, SafeAreaView, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from 'expo-router';
import { theme } from '../constants';
import { components } from '../components';
import { svg } from '../svg';


const AboutUs = () => {
    const navigation = useNavigation();
    const renderHeader = () => {
        return <components.Header title="About Us" goBack={true} height={42} displayScreenName={true} />;
      };

      function renderContent() {
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 10, backgroundColor: '#f8f9fc' }}
          >
            <View className="flex space-y-2">
          <Pressable className="p-5 w-full h-14 bg-white/95 flex flex-row items-center" onPress={() => navigation.navigate('TermsOfService')}>
              <Text style={{flex: 1, ...theme.FONTS.H5}}>Terms of Service</Text>
              <svg.ProfileNavigation/>
          
          </Pressable>
          <Pressable className="p-5 w-full h-14 bg-white/95 flex flex-row items-center" onPress={() => navigation.navigate('PrivacyPolicy')}>
              <Text style={{flex: 1, ...theme.FONTS.H5}}>Privacy Policy</Text>
              <svg.ProfileNavigation/>
          
          </Pressable>
            </View>
          </ScrollView>
        );
      }
    
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
          {renderHeader()}
          {renderContent()}
        </SafeAreaView>
      );
    };
    
    

export default AboutUs


