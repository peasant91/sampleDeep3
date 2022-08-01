import {
  FlatList,
  KeyboardAvoidingView,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View, ScrollView
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CardContract from '../../../components/atoms/list/CardContract';
import { Input } from 'react-native-elements';

import IconSearch from '../../../assets/images/ic_search_offer.svg';
import IconFilter from '../../../assets/images/ic_filter.svg';
import IconEmpty from '../../../assets/images/ic_empty_offer.svg';

import { getCampaignList } from '../../../services/campaign';
import ErrorNotRegisterVehicle from '../../../components/atoms/ErrorNotRegisterVehicle';
import { showDialog } from '../../../actions/commonActions';
import translate from '../../../locales/translate';
import { ShimmerCardContract } from '../../../components/atoms/shimmer/Shimmer';
import { Shadow } from 'react-native-shadow-2';
import { useIsFocused } from '@react-navigation/native';
import Colors from '../../../constants/Colors';
import { LatoBold, LatoRegular } from '../../../components/atoms/CustomText';

import debounce from 'lodash.debounce';
import EmptySearch from '../../../components/atoms/EmptySearch';

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
  const [data, setdata] = useState([]);
  const [isNotRegisterVehicle, setisNotRegisterVehicle] = useState(false);
  const page = useRef(1);
  const canLoadData = useRef(true);
  const [isLoading, setisLoading] = useState(true);
  const [search, setsearch] = useState('');
  const isFocused = useIsFocused();
  const searchText = useRef(null);
  const timeout = useRef(null);

  const goToDetail = item => {
    navigation.navigate('OfferDetail', { id: item.id });
  };

  const getCampaignListApi = () => {
    if (page.current == 1) {
      setisLoading(true);
    }

    if (!canLoadData.current) {
      return;
    }
    getCampaignList(searchText.current, {
      page: page.current,
    })
      .then(response => {
        setisNotRegisterVehicle(false);
        setisLoading(false);
        if (page.current == 1) {
          setdata(response.data);
        } else {
          setdata([...data, ...response.data]);
        }
        if (page.current === response.meta.last_page) {
          canLoadData.current = false;
        }
        page.current += 1;
      })
      .catch(err => {
        setisLoading(false);
        if (err.message.includes('verifikasi')) {
          setisNotRegisterVehicle(true);
        } else if (err.message.includes('belum ada')) {
          setisNotRegisterVehicle(true);
        } else {
          setisNotRegisterVehicle(false);
          showDialog(err.message);
        }
      });
  };

  const onRefresh = () => {
    console.log('search text', searchText.current);
    canLoadData.current = true;
    page.current = 1;
    getCampaignListApi();
  };

  // const debounceSearch = useCallback(
  //  debounce(onRefresh, 1000),
  //   [],
  // )

  // useEffect(() => {
  //   if (isFocused) {
  //     searchText.current = search
  //     debounceSearch()
  //   } else {
  //     setisLoading(true)
  //     console.log("is note focused");
  //   }
  // }, [search, isFocused])

  useEffect(() => {
    if (timeout.current !== null) {
      // IF THERE'S A RUNNING TIMEOUT
      clearTimeout(timeout.current); // THEN, CANCEL IT
    }
    timeout.current = setTimeout(() => {
      timeout.current = null;
      searchText.current = search;
      onRefresh();
    }, 500);
  }, [search]);

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
          <Shadow
            viewStyle={{ width: '100%' }}
            offset={[0, 10]}
            distance={10}
            startColor={Colors.divider}>
            <View style={styles.topHeader}>
              <Input
                containerStyle={{ flex: 1, paddingHorizontal: 16 }}
                rightIcon={IconSearch}
                style={{ height: 35, fontSize: 14, fontFamily: 'Lato-Regular' }}
                placeholder={translate('find_offer_here')}
                multiline={false}
                onChangeText={text => {
                  clearTimeout(timeout.current);
                  page.current = 1;
                  setsearch(text);
                }}
              />
            </View>
          </Shadow>

          {isNotRegisterVehicle ? (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
              }
              contentContainerStyle={{ flex: 1 }}>
              <ErrorNotRegisterVehicle />
            </ScrollView>
          ) : isLoading ? (
            dummyContractShimmer.map((item, index) => {
              return (
                <ShimmerCardContract
                  containerStyle={{ marginHorizontal: 16, marginTop: 16 }}
                />
              );
            })
          ) : data.length == 0 ? (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
              }
              contentContainerStyle={{ flex: 1 }}>
              <EmptySearch title={translate('work')} />
            </ScrollView>
          ) : (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
              }
              style={{ backgroundColor: '#FAFAFA' }}
              data={data}
              contentContainerStyle={{ paddingBottom: 16, overflow: 'visible' }}
              keyExtractor={(item, index) => `key ${index}-${item.id}`}
              onEndReachedThreshold={0.2}
              onEndReached={getCampaignListApi}
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
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 24,
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
