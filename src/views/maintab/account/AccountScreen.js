import {RefreshControl, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import AccountTopHeader from '../../../components/atoms/AccountTopHeader';
import AccountCardInfo from '../../../components/atoms/AccountCardInfo';
import Divider from '../../../components/atoms/Divider';
import InfoMenu from '../../../components/atoms/InfoMenu';
import translate from '../../../locales/translate';
import AccountMenu from '../../../components/atoms/AccountMenu';

import IconMyContract from '../../../assets/images/ic_account_contract.svg';
import IconLogout from '../../../assets/images/ic_logout.svg';
import IconChangeProfile from '../../../assets/images/ic_change_profile.svg';
import IconChangePassword from '../../../assets/images/ic_change_password.svg';
import IconBank from '../../../assets/images/ic_bank_account.svg';
import IconContactUs from '../../../assets/images/ic_contact_us.svg';
import IconCar from '../../../assets/images/ic_vehicle.svg';

import Colors from '../../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from '../../../constants/StorageKey';
import { AuthContext } from '../../../../App';
import { showDialog } from '../../../actions/commonActions';
import { getProfile } from '../../../services/user';
import { getDriverVehicle, getVehicleRoute } from '../../../services/utilities';
import { isEmpty } from '../../../actions/helper';
import axios from 'axios';
import { ShimmerPlaceholder } from '../../../components/atoms/shimmer/Shimmer';
import { getHome } from '../../../services/home';



// const profileData = {
//   imageUrl:
//     'https://static.republika.co.id/uploads/member/images/news/avwkgphlic.jpg',
//   name: 'Vladimir Putin',
//   isVerified: true,
// };

// const dummyCardData = {
//   car: 'Kirov Airship',
//   licensePlate: 'A 27 BLYAT',
//   travelDistance: 14,
//   todayTravel: 1,
// };

const AccountScreen = ({navigation, route}) => {

  const [profileData, setprofileData] = useState({})
  const [vehicleRute, setvehicleRute] = useState({})
  const [contractData, setContractData] = useState({})
  const [isLoading, setisLoading] = useState(true)
  const [refreshing, setrefreshing] = useState(false)
  const {signOut} = useContext(AuthContext);

  const getProfileApi = () => {
    setisLoading(true)
    axios.all([
      getProfile(),
      getVehicleRoute(),
      getHome()
    ]).then(axios.spread((profile, vehicleRoute, contract) => {
      AsyncStorage.setItem(StorageKey.KEY_USER_PROFILE, JSON.stringify(profile))
      setprofileData(profile)
      setvehicleRute(vehicleRoute)
      setContractData(contract)
      setrefreshing(false)
      setisLoading(false)
    })).catch(err => {
      setrefreshing(false)
      setisLoading(false)
      showDialog(error.message)
    })
  }

  useEffect( () => {

    getProfileApi()
  
  }, [route.params])

  const goToEdit = () => {
    navigation.navigate('Register', { isEdit: true, data: profileData})
  }

  const goToContract = () => {
    navigation.navigate('CurrentContract', { id: contractData?.active_contract.contract_id, isEmpty: contractData.active_contract == null})
  }

  const logout = () => {
    showDialog(translate('logout_confirmation'), true, signOut, null, translate('yes'), translate('cancel'))
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <AccountTopHeader data={profileData} isLoading={isLoading}/>
      <ScrollView
        style={{zIndex: -1}}
       refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={getProfileApi}
        />
      }
      >
        <View>
          { isLoading ? <View style={{margin: 16}}><ShimmerPlaceholder style={{width: '100%', height: 100, }} /></View> : (!isEmpty(vehicleRute) ? (
            <View>
              <AccountCardInfo
                containerStyle={{margin: 16}}
                data={vehicleRute}
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
                onPress={() => navigation.navigate('RegisterVehicle', {isRegister: false})}
              />

              <InfoMenu
                containerStyle={{marginHorizontal: 16, marginBottom: 16}}
                text={translate('info_not_verified')}
              />
            </View>
          ))}

          <Divider />

            <View style={{margin: 12}}>

            <ShimmerPlaceholder
            isLoading={isLoading}
            height={40}
            style={{width: '100%'}}
            >
          <AccountMenu
            Icon={IconMyContract}
            text={translate('my_contract')}
            containerStyle={{margin: 4}}
            onPress={goToContract}
          />
            </ShimmerPlaceholder>
            </View>

          <Divider />

          <View style={{margin: 16}}>
            <AccountMenu
              Icon={IconChangeProfile}
              text={translate('change_profile')}
              onPress={goToEdit}
            />
            <AccountMenu
              Icon={IconChangePassword}
              text={translate('change_password')}
              containerStyle={{marginTop: 16}}
              onPress={() => navigation.navigate('ChangePassword')}
            />
            <AccountMenu
              Icon={IconBank}
              text={translate('bank_account')}
              containerStyle={{marginTop: 16}}
              onPress={() => navigation.navigate('Bank')}
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
