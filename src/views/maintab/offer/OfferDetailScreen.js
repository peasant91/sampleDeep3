import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Image} from 'react-native-elements';
import CustomButton from '../../../components/atoms/CustomButton';
import {LatoBold, LatoRegular} from '../../../components/atoms/CustomText';
import NavBar from '../../../components/atoms/NavBar';
import Colors from '../../../constants/Colors';
import translate from '../../../locales/translate';
import DeviceInfo from 'react-native-device-info';
import RNLocalize from 'react-native-localize';
import moment from 'moment';

import IconLocation from '../../../assets/images/ic_home_location.svg';
import Divider from '../../../components/atoms/Divider';
import ListInstallationSchedule from '../../../components/atoms/list/ListInstallationSchedule';
import {getCampaignDetail} from '../../../services/campaign';
import {showDialog} from '../../../actions/commonActions';
import {
  displayProvince,
  getFullLink,
  openMaps,
  toCurrency,
} from '../../../actions/helper';
import ListTag from '../../../components/atoms/list/ListTag';
import {ShimmerOfferDetail} from '../../../components/atoms/shimmer/Shimmer';
import {applyContract} from '../../../services/contract';
import SafeAreaView from 'react-native-safe-area-view';
import InfoMenu from '../../../components/atoms/InfoMenu';

const data = {
  imageUrl: 'https://picsum.photos/200/300',
  name: 'PT Bank Mega, Tbk',
  address: 'Prov. Jawa Tengah',
  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia quis vel eros donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus',
};

const dummyData = [
  {
    id: 1,
    title: 'Otongmedia',
    date: '14:00 - 17:00 WIB',
  },
  {
    id: 2,
    title: 'Otongmedia',
    date: '14:00 - 17:00 WIB',
  },
];

const OfferDetailScreen = ({navigation, route}) => {
  const {id} = route.params;

  const [isLoading, setisLoading] = useState(true);
  const [isProcessing, setisProcessing] = useState(false);
  const [data, setdata] = useState({});

  const getDetail = id => {
    getCampaignDetail(id, {
      timezone: RNLocalize.getTimeZone(),
    })
      .then(response => {
        setisLoading(false);
        setdata(response);
      })
      .catch(err => {
        setisLoading(false);
        showDialog(err.message);
      });
  };

  const getAdsDate = () => {
    const start = moment(data.start_date);
    const end = moment(data.end_date);
    if (start.format('YYYY') != end.format('YYYY')) {
      return start.format('DD MMMM YYYY') + ' - ' + end.format('DD MMMM YYYY');
    } else if (start.format('MM') != end.format('MM')) {
      return start.format('DD MMMM') + ' - ' + end.format('DD MMMM YYYY');
    } else {
      return start.format('DD') + ' - ' + end.format('DD MMMM YYYY, HH:mm:ss');
    }
  };

  const assignContract = () => {
    setisProcessing(true);
    applyContract(id)
      .then(response => {
        setisProcessing(false);
        navigation.navigate('Home', {isReload: true}, true);
      })
      .catch(err => {
        showDialog(err.message);
      });
  };

  const showConfirmationDialog = () => {
    showDialog(
      translate('contract_offer_confirmation'),
      true,
      assignContract,
      null,
      translate('yes'),
    );
  };

  useEffect(() => {
    getDetail(id);
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <NavBar
        title={translate('offer_detail')}
        navigation={navigation}
        shadowEnabled
      />
      <ScrollView style={{flex: 1}}>
        {isLoading ? (
          <ShimmerOfferDetail containerStyle={{padding: 16}} />
        ) : (
          <View>
            <View style={{flexDirection: 'row', padding: 16}}>
              <Image
                source={{uri: getFullLink(data?.company_image)}}
                style={{height: 64, width: 'auto', aspectRatio: 1}}
              />

              <View style={{paddingLeft: 16}}>
                <LatoBold style={{color: '#6D6D6D'}}>
                  {data.company_name}
                </LatoBold>
                <LatoRegular
                  style={{
                    color: Colors.primary,
                    fontSize: 10,
                    paddingVertical: 10,
                  }}
                  Icon={IconLocation}>
                  {displayProvince(data.contract_area)}
                </LatoRegular>
                <LatoRegular style={{fontSize: 10, color: '#A7A7A7'}}>
                  {translate('created_at', {
                    date: moment(data.created_at).format('DD MMMM YYYY'),
                  })}
                </LatoRegular>
              </View>
            </View>

            <Divider />
            {data.is_available == false && (
              <InfoMenu
                containerStyle={{marginHorizontal: 16, marginTop: 16}}
                text={
                  'Kuota untuk kontrak ini sudah penuh. Coba mengajukan kontrak pada pekerjaan lain.'
                }
              />
            )}

            <View style={{padding: 16}}>
              <LatoBold style={styles.primaryHead}>
                {translate('offer_info')}
              </LatoBold>
              <View style={{flexDirection: 'row', height: 80, marginTop: 16}}>
                <View style={{flex: 3, justifyContent: 'space-around'}}>
                  <LatoRegular style={styles.primarySub}>
                    {translate('offer_type')}
                  </LatoRegular>
                  <LatoRegular style={styles.primarySub}>
                    {translate('ad_duration')}
                  </LatoRegular>
                  <LatoRegular style={styles.primarySub}>
                    {translate('price_per_kilos')}
                  </LatoRegular>
                </View>
                <View style={{justifyContent: 'space-around'}}>
                  <LatoRegular style={styles.primarySub}>:</LatoRegular>
                  <LatoRegular style={styles.primarySub}>:</LatoRegular>
                  <LatoRegular style={styles.primarySub}>:</LatoRegular>
                </View>
                <View
                  style={{
                    flex: 5,
                    marginLeft: 10,
                    justifyContent: 'space-around',
                  }}>
                  <LatoRegular style={styles.primarySub}>
                    {data.sticker_area?.length > 1
                      ? data.sticker_area.join(', ')
                      : data.sticker_area}
                  </LatoRegular>
                  <LatoRegular style={styles.primarySub}>
                    {getAdsDate()}
                  </LatoRegular>
                  <LatoRegular style={styles.primarySub}>
                    {toCurrency(data.price_km)}
                  </LatoRegular>
                </View>
              </View>
              <LatoRegular
                style={styles.primarySub}
                containerStyle={{marginTop: 8}}>
                {translate('operational_province')}
              </LatoRegular>
              <FlatList
                scrollEnabled={false}
                contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
                data={data.contract_area}
                keyExtractor={item => item}
                renderItem={({item, index}) => {
                  return <ListTag title={item} />;
                }}
              />
              <LatoRegular
                style={styles.primarySub}
                containerStyle={{marginTop: 8}}>
                {translate('operational_city')}
              </LatoRegular>
              <FlatList
                scrollEnabled={false}
                contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
                data={data.contract_area_city}
                keyExtractor={item => item}
                renderItem={({item, index}) => {
                  return <ListTag title={item} />;
                }}
              />
            </View>

            <Divider />

            <View style={{padding: 16}}>
              <LatoBold style={styles.primaryHead}>
                {translate('vehicle_purpose')}
              </LatoBold>
              <View style={{flexDirection: 'row', marginTop: 16}}>
                <LatoRegular
                  style={styles.primarySub}
                  containerStyle={{flex: 3}}>
                  {translate('vehicle_type')}
                </LatoRegular>
                <LatoRegular>:</LatoRegular>
                <LatoRegular
                  style={styles.primarySub}
                  containerStyle={{flex: 5, marginLeft: 10}}>
                  {data?.vehicle_type?.length > 1
                    ? data.vehicle_type.join(' & ')
                    : data.vehicle_type}
                </LatoRegular>
              </View>
              <LatoRegular
                style={styles.primarySub}
                containerStyle={{marginTop: 8}}>
                {translate('vehicle_brand')}
              </LatoRegular>
              <FlatList
                scrollEnabled={false}
                contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
                data={data.vehicles}
                keyExtractor={item => item}
                renderItem={({item, index}) => {
                  return <ListTag title={item} />;
                }}
              />
            </View>
            <Divider />

            <View
              style={{
                padding: 16,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <LatoBold style={{color: Colors.primary}}>
                {translate('installation_time_title')}
              </LatoBold>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('InstallationList', {
                    data: data.installation_schedule,
                  })
                }>
                <LatoBold
                  style={{
                    textDecorationLine: 'underline',
                    color: Colors.secondary,
                  }}>
                  {translate('see_all')}
                </LatoBold>
              </TouchableOpacity>
            </View>

            {data.installation_schedule &&
              data.installation_schedule.map((item, index) => {
                return (
                  <ListInstallationSchedule
                    data={item}
                    onPressMap={() =>
                      openMaps(Number(item.lat), Number(item.lng))
                    }
                  />
                );
              })}

            <LatoBold containerStyle={{paddingHorizontal: 16}}>
              {translate('company_detail')}
            </LatoBold>
            <LatoRegular
              containerStyle={{paddingHorizontal: 16, paddingVertical: 10}}>
              {data.description}
            </LatoRegular>
          </View>
        )}
      </ScrollView>

      {!isLoading && (
        <CustomButton
          containerStyle={{padding: 16}}
          types={'primary'}
          onPress={showConfirmationDialog}
          isLoading={isProcessing}
          title={translate('apply')}
          disabled={!data.is_available}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  primarySub: {
    color: Colors.primary,
    fontSize: 12,
  },
  primaryHead: {
    color: Colors.primary,
    fontSize: 14,
  },
});

export default OfferDetailScreen;
