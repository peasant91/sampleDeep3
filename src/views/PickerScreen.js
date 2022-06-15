import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import CustomInput from '../components/atoms/CustomInput';

import IconSearch from '../assets/images/ic_search_offer.svg';
import translate from '../locales/translate';
import ListCompany from '../components/atoms/list/ListCompany';

import IconBack from '../assets/images/ic_arrow_back.svg';
import IconCheckmark from '../assets/images/ic_checkmark.svg'

import { Input } from 'react-native-elements';
import ListArea from '../components/atoms/list/ListArea';
import { LatoRegular } from '../components/atoms/CustomText';
import Colors from '../constants/Colors';
import { Shadow } from 'react-native-shadow-2';
import EmptySearch from '../components/atoms/EmptySearch';

const PickerScreen = ({ navigation, route }) => {

  const { pickerId, title, data, selectedId, isEdit, dispatch, isRegister } = route.params;

  const [filteredData, setfilteredData] = useState(data ? data : [])
  const manualInputId = -99

  const onPressList = (id, name) => {
    console.log(isEdit)
    navigation.navigate(route.params.previousRoute, { pickerId: pickerId, id: id, name: name, isEdit: isEdit, dispatch: dispatch, isRegister: isRegister }, true)
  }

  const onChangeText = (text) => {
    console.log(data)
    setfilteredData(data.filter(item => item.name.toLowerCase().includes(text.toLowerCase()) || item.address?.toLowerCase().includes(text.toLowerCase())))
  }

  return (
    <SafeAreaView style={style.container}>
      <Shadow viewStyle={{width: '100%'}} offset={[0,5]} distance={5} startColor={Colors.divider}>

      <View style={style.header}>
        
        <TouchableOpacity onPress={() => navigation.pop()}>
          <IconBack onPress={() => navigation.pop()} />
        </TouchableOpacity>
        <Input
          onChangeText={onChangeText}
          rightIcon={IconSearch}
          rightIconContainerStyle={{ marginVertical: 0 }} 
          placeholder={translate('find_picker' , {title: translate(title)})} 
          style={{ flex: 1 }} 
          containerStyle={{ flex: 1, marginBottom: -15 }} />
      </View>
      </Shadow>
      <View style={{flex: 1}}>


      {filteredData.length <= 0 ? <EmptySearch title={translate(title)}/> : 
      <FlatList
        contentContainerStyle={{ paddingTop: 16 }}
        style={{flex: 0, flexShrink: 1}}
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => {
          if (pickerId == 'driver_company_id')
            return <ListCompany data={item} onPress={onPressList} selectedId={selectedId} />
          else
            return <ListArea data={item} onPress={onPressList} selectedId={selectedId} />
        }}
      />}

      {pickerId == 'village_id' && filteredData.length > 0 &&
      <View
        style={{flex: 0 , flexGrow: 100,}}>
          <View style={{flexDirection: 'row', backgroundColor: selectedId == manualInputId ? '#EEEEFF' : 'white', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => onPressList(manualInputId, translate('manual_input') )}
              style={{ padding: 16, }}
            >
        <LatoRegular style={{color: Colors.primary, width: '90%'}}>{translate('add_manual_input')}</LatoRegular>
            </TouchableOpacity>
        {selectedId == manualInputId && <IconCheckmark/>} 
          </View>
        </View>}
      </View>

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
