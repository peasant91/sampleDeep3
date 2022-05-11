import { FlatList, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CardContract from '../../../components/atoms/list/CardContract';
import { Input } from 'react-native-elements';

import IconSearch from '../../../assets/images/ic_search_offer.svg';
import IconFilter from '../../../assets/images/ic_filter.svg';
import { getCampaignList } from '../../../services/campaign';
import ErrorNotRegisterVehicle from '../../../components/atoms/ErrorNotRegisterVehicle';
import { showDialog } from '../../../actions/commonActions';
import translate from '../../../locales/translate';
import { ShimmerCardContract } from '../../../components/atoms/shimmer/Shimmer';

const dummyContractData = {
  imageUrl: 'https://statik.tempo.co/?id=836405&width=650',
  contractTitle: 'Full Body',
  bankName: 'PT Bank Mega',
  address: 'Prov. Jawa Tengah',
  date: '31 Nov 2022',
  carList: 'Sedan, SUV, MPV',
};

export const dummyContractShimmer = [
  dummyContractData,
  dummyContractData,
  dummyContractData,
  dummyContractData,
];

const OfferScreen = ({ navigation, route }) => {

  const [data, setdata] = useState([])
  const [isNotRegisterVehicle, setisNotRegisterVehicle] = useState(false)
  const page = useRef(1)
  const canLoadData = useRef(true)  
  const [isLoading, setisLoading] = useState(true)
  const [search, setsearch] = useState('')

  const goToDetail = (item) => {
    navigation.navigate('OfferDetail', { id: item.id })
  }

  const getCampaignListApi = () => {

    if (page.current == 1) {
      setisLoading(true)
    }

    if (canLoadData.current) {
    getCampaignList({
      page: page.current,
      search: search
    }).then(response => {
      setisLoading(false)
      if (response.length > 0) {
        if (page.current == 1) {
          setdata(response)
        } else {
          setdata([...data, ...response])
        }
        page.current += 1
      } else {
        canLoadData.current = false
      }
    }).catch(err => {
      setisLoading(false)
      if (err.message.includes('verifikasi')) {
        setisNotRegisterVehicle(true)
      } else if (err.message.includes('belum ada')) {
        setisNotRegisterVehicle(true)
      } else {
        setisNotRegisterVehicle(false)
        showDialog(err.message)
      }
    })
    }
  }

  const onRefresh = () => {
    canLoadData.current = true
    page.current = 1
    getCampaignListApi()
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
            onChangeText={(text) => {
              page.current = 1
              setsearch(text)
            }}
          />
        </View>

        {isNotRegisterVehicle ? <ErrorNotRegisterVehicle /> :
          (isLoading ? dummyContractShimmer.map((item, index) => {
                return <ShimmerCardContract
                  containerStyle={{ marginHorizontal: 16, marginTop: 16 }}
                />
          }) :
          <FlatList
            refreshControl={<RefreshControl
              refreshing={isLoading}
              onRefresh={onRefresh}
            />}
            data={data}
            contentContainerStyle={{ paddingBottom: 16, overflow: 'visible' }}
            keyExtractor={item => item.id}
            onEndReachedThreshold={0.2}
            onEndReached={getCampaignListApi}
            renderItem={({ item, index }) => {
              return (
                <CardContract
                  containerStyle={{ marginHorizontal: 16, marginTop: 16 }}
                  data={item}
                  onPress={() => goToDetail(item)}
                />
              )
            }}
          />)
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
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,

    elevation: 10,
    zIndex: 1,
  },
});
export default OfferScreen;
