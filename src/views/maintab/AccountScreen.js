import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import AccountTopHeader from '../../components/atoms/AccountTopHeader';
import AccountCardInfo from '../../components/atoms/AccountCardInfo';
import Divider from '../../components/atoms/Divider';
import InfoMenu from '../../components/atoms/InfoMenu';
import translate from '../../locales/translate';
import AccountMenu from '../../components/atoms/AccountMenu';

import IconMyContract from '../../assets/images/ic_account_contract.svg';
import IconLogout from '../../assets/images/ic_logout.svg';
import IconChangeProfile from '../../assets/images/ic_change_profile.svg';
import IconChangePassword from '../../assets/images/ic_change_password.svg';
import IconBank from '../../assets/images/ic_bank_account.svg';
import IconContactUs from '../../assets/images/ic_contact_us.svg';
import IconCar from '../../assets/images/ic_vehicle.svg';

import Colors from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from '../../constants/StorageKey';
import { AuthContext } from '../../../App';
import { showDialog } from '../../actions/commonActions';



const accountDummyData = {
  imageUrl:
    'https://static.republika.co.id/uploads/member/images/news/avwkgphlic.jpg',
  name: 'Vladimir Putin',
  isVerified: true,
};

const dummyCardData = {
  car: 'Kirov Airship',
  licensePlate: 'A 27 BLYAT',
  travelDistance: 14,
  todayTravel: 1,
};

const AccountScreen = ({navigation, route}) => {

  const [profileData, setprofileData] = useState({})
  const {signOut} = useContext(AuthContext);

  useEffect(async () => {
    AsyncStorage.getItem(StorageKey.KEY_USER_PROFILE).then(data => {
      setprofileData(JSON.parse(data))
    })
  
  }, [route.params])

  const logout = () => {
    showDialog(translate('logout_confirmation'), true, signOut, null, translate('yes'), translate('cancel'))
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <AccountTopHeader data={profileData} />
      <ScrollView>
        <View>
          {accountDummyData.isVerified ? (
            <View>
              <AccountCardInfo
                containerStyle={{margin: 16}}
                data={dummyCardData}
              />
              <InfoMenu
                containerStyle={{marginHorizontal: 16, marginBottom: 16}}
                text={translate('vehicle_can_be_change')}
              />
              <Divider />
            </View>
          ) : (
            <View>
              <AccountMenu
                Icon={IconCar}
                text={translate('vehicle')}
                containerStyle={{margin: 16}}
              />

              <InfoMenu
                containerStyle={{marginHorizontal: 16, marginBottom: 16}}
                text={translate('info_not_verified')}
              />
            </View>
          )}

          <Divider />

          <AccountMenu
            Icon={IconMyContract}
            text={translate('my_contract')}
            containerStyle={{margin: 16}}
          />

          <Divider />

          <View style={{margin: 16}}>
            <AccountMenu
              Icon={IconChangeProfile}
              text={translate('change_profile')}
            />
            <AccountMenu
              Icon={IconChangePassword}
              text={translate('change_password')}
              containerStyle={{marginTop: 16}}
            />
            <AccountMenu
              Icon={IconBank}
              text={translate('bank_account')}
              containerStyle={{marginTop: 16}}
            />
            <AccountMenu
              Icon={IconContactUs}
              text={translate('contact_us')}
              containerStyle={{marginTop: 16}}
            />
          </View>

          <Divider />

          <AccountMenu
            Icon={IconLogout}
            text={translate('logout')}
            containerStyle={{margin: 16}}
            onPress={logout}
            tintColor={'red'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default AccountScreen;
