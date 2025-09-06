import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { components } from '../components';
import { theme } from '../constants';

const TermsofService = () => {
  const renderHeader = () => {
    return (
      <components.Header
        title="Terms of Service"
        goBack={true}
        height={42}
        displayScreenName={true}
      />
    );
  };

  function renderContent() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 10, paddingHorizontal: 12 }}
      >
        <View className="flex space-y-2">
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis est augue, gravida et odio
            nec, faucibus dignissim felis. Sed rhoncus, ipsum porttitor porttitor molestie, orci
            sapien consectetur libero, non dignissim nulla nisi commodo risus. Donec gravida ante in
            congue vehicula. Integer ultricies, lectus vel ultricies volutpat, lectus est interdum
            lectus, vitae tincidunt felis tortor quis magna. Donec consequat, mauris at dignissim
            mollis, augue lorem placerat metus, id blandit metus dui sed ante. Morbi nulla nunc,
            faucibus sed feugiat vel, vestibulum ac nisi. Aenean ornare a justo nec molestie.
            Maecenas nibh libero, elementum id nisi lobortis, dignissim malesuada sapien. Curabitur
            semper neque eu hendrerit lacinia. Praesent a leo eu velit elementum commodo. Nunc
            dapibus lectus ac arcu dapibus, sit amet maximus tellus mollis. Phasellus bibendum
            mauris id enim fermentum, ac dictum elit malesuada. Nam in lorem a nibh pharetra luctus
            a at nulla. Etiam tristique scelerisque metus volutpat facilisis. Quisque placerat
            pulvinar diam sit amet pulvinar. Donec varius sed neque eget porta. Nam ut mauris eu
            odio mollis fermentum. Quisque tempus tellus libero, eu imperdiet ipsum tincidunt sed.
            Nulla nibh erat, eleifend ut magna malesuada, commodo cursus felis. Etiam ac ligula
            dignissim, egestas erat vel, ultrices quam. Integer tempus dignissim elementum. Sed
            vitae felis felis. Suspendisse in ex ultricies, malesuada nisl nec, feugiat lectus.
            Quisque ut luctus orci. Curabitur vel lectus eget velit laoreet elementum. Vivamus
            elementum erat a dolor varius venenatis. Vivamus at quam nec odio iaculis consequat.
            Donec vitae tincidunt ex. Praesent ullamcorper lobortis nisi. Donec et molestie metus.
            Cras vel condimentum metus. Nulla dapibus elit in mi tincidunt, at consectetur mi
            cursus. Integer et convallis leo, sit amet blandit tortor. Maecenas rutrum mi augue,
            tempor porttitor turpis consequat eu. Praesent ac ipsum dui. Mauris non tellus orci.
            Morbi eu quam ante. Proin hendrerit lectus ut vulputate finibus. In non tristique eros.
            Nunc suscipit varius justo, sed varius enim semper in. Nulla fermentum iaculis nibh vel
            rhoncus. Proin viverra, ante id iaculis eleifend, sem diam accumsan velit, sed dapibus
            orci lacus venenatis velit. Nulla facilisi. Quisque eu consequat sem. Proin ipsum elit,
            faucibus vel faucibus vitae, volutpat in eros. Proin eget augue congue, porta diam non,
            pharetra ante. Proin sollicitudin urna ipsum, sed consectetur velit dictum et. Phasellus
            quis consequat metus. Sed sollicitudin consequat vehicula. Ut non tellus sit amet enim
            hendrerit commodo. Ut tincidunt magna vel nisl sagittis, a placerat justo faucibus.
            Nulla pellentesque, sem et feugiat auctor, lectus libero accumsan velit, quis venenatis
            metus ante id urna. Aliquam placerat molestie diam vitae pellentesque. In tristique
            mauris eros, a finibus risus dictum ac. Donec gravida nisi ornare, tristique nunc
            mollis, lobortis mauris. Morbi arcu lorem, consectetur ut nunc vel, dapibus ornare
            risus. Mauris ac quam non nisl sollicitudin scelerisque iaculis vitae diam. Aliquam
            fermentum purus eu quam feugiat varius. Etiam odio lacus, porta a dolor non, iaculis
            laoreet mi. Nullam tincidunt efficitur ante. Vivamus ac dui dui. Integer elit leo,
            congue ut lacinia at, sollicitudin at quam. Aliquam in quam rhoncus velit auctor
            volutpat. Suspendisse potenti. Vestibulum dignissim placerat luctus. Quisque fermentum
            vitae massa eget dignissim. Integer tristique lorem nisl, dignissim ornare libero
            pharetra nec. Aliquam ex justo, tincidunt pulvinar tellus ac, pretium pretium tortor.
          </Text>
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

export default TermsofService;
