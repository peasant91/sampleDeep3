import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CardContract from '../../../components/atoms/CardContract';
import { Input } from 'react-native-elements';

import IconSearch from '../../../assets/images/ic_search_offer.svg';
import IconFilter from '../../../assets/images/ic_filter.svg';
import { getCampaignList } from '../../../services/campaign';
import ErrorNotRegisterVehicle from '../../../components/atoms/ErrorNotRegisterVehicle';
import { showDialog } from '../../../actions/commonActions';
import translate from '../../../locales/translate';

const dummyContractData = {
  imageUrl: 'https://statik.tempo.co/?id=836405&width=650',
  contractTitle: 'Full Body',
  bankName: 'PT Bank Mega',
  address: 'Prov. Jawa Tengah',
  date: '31 Nov 2022',
  carList: 'Sedan, SUV, MPV',
};

const dummyData = [
  dummyContractData,
  dummyContractData,
  dummyContractData,
  dummyContractData,
];

const OfferScreen = ({ navigation, route }) => {

  const [data, setdata] = useState([])
  const [isNotRegisterVehicle, setisNotRegisterVehicle] = useState(false)

  const goToDetail = (item) => {
    navigation.navigate('OfferDetail', { id: item.id })
  }

  const getCampaignListApi = () => {
    getCampaignList().then(response => {
      setdata(response)
    }).catch(err => {
      if (err.message.includes('verifikasi')) {
        setisNotRegisterVehicle(true)
      } else {
        setisNotRegisterVehicle(false)
        showDialog(err.message)
      }
    })
  }


  useEffect(() => {
    getCampaignListApi()
  }, [])


  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
        <View style={styles.topHeader}>
          <Input
            containerStyle={{ flex: 1, paddingHorizontal: 16 }}
            rightIcon={IconSearch}
            style={{ height: 35 }}
            placeholder={translate('find_offer_here')}
            multiline={false}
          />
        </View>

        {isNotRegisterVehicle ? <ErrorNotRegisterVehicle /> :
          <FlatList
            data={data}
            contentContainerStyle={{ paddingBottom: 16, overflow: 'visible' }}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => {
              return (
                <CardContract
                  containerStyle={{ marginHorizontal: 16, marginTop: 16 }}
                  data={item}
                  onPress={() => goToDetail(item)}
                />
              );
            }}
          />
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,

    elevation: 3,
    zIndex: 1,
  },
});
export default OfferScreen;
