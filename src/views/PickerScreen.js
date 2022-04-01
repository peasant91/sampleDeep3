import React from 'react';
import {FlatList, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import CustomInput from '../components/atoms/CustomInput';

import IconSearch from '../assets/images/ic_search_offer.svg';
import translate from '../locales/translate';
import ListCompany from '../components/atoms/list/ListCompany';

import IconBack from '../assets/images/ic_arrow_back.svg';
import { Input } from 'react-native-elements';
import ListArea from '../components/atoms/list/ListArea';

const PickerScreen = ({navigation, route}) => {
  const {pickerId, title, data, selectedId} = route.params;

  const onPressList = (id, name) => {
    navigation.navigate(route.params.previousRoute, {pickerId: pickerId, id: id, name: name}, true)
  }

  return (
    <SafeAreaView style={style.container}>
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.pop()}>
        <IconBack onPress={() => navigation.pop()}/>
        </TouchableOpacity>
        <Input rightIcon={IconSearch} rightIconContainerStyle={{marginVertical: 0}} placeholder={translate(title)} style={{flex: 1}} containerStyle={{flex: 1, marginBottom: -15}} />
      </View>

      <FlatList
        contentContainerStyle={{paddingVertical: 16}}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          if (pickerId == 'driver_company_id')
          return <ListCompany data={item} onPress={onPressList} selectedId={selectedId} />
          else 
          return <ListArea data={item} onPress={onPressList} selectedId={selectedId}/>
        }}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 10,
    shadowColor: '#000',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2.22,

    elevation: 3,
    zIndex: 1
  },
});

export default PickerScreen;
