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
import { isEmpty, openWhatsapp } from '../../../actions/helper';
import axios from 'axios';
import { ShimmerPlaceholder } from '../../../components/atoms/shimmer/Shimmer';
import { getHome } from '../../../services/home';
import moment from 'moment';
import { getIncomeList } from '../../../services/transaction';
import IncomeProfile from '../../../components/atoms/IncomeProfile';



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
  const [incomeData, setincomeData] = useState({})
  const {signOut} = useContext(AuthContext);

  const getProfileApi = () => {
    setisLoading(true)
    getProfile().then(Response=> {
      AsyncStorage.setItem(StorageKey.KEY_USER_PROFILE, JSON.stringify(Response))
      setprofileData(Response)
    }).catch(err=>{
      setrefreshing(false)
      setisLoading(false)
      showDialog(err.message)
    })
    getVehicleRoute().then(Response=> {
      setvehicleRute(Response)
    }).catch(err=>{
      setrefreshing(false)
      setisLoading(false)
      showDialog(err.message)
    })
    getHome().then(Response=> {
      setContractData(Response)
    }).catch(err=>{
      setrefreshing(false)
      setisLoading(false)
      showDialog(err.message)
    })
    getIncomeList({
      year: moment(Date()).format('yyyy')
  }).then(Response=> {
      setincomeData(Response)
      setrefreshing(false)
      setisLoading(false)
    }).catch(err=>{
      setrefreshing(false)
      setisLoading(false)
      showDialog(error.message)
    })
    // axios.all([
    //   getProfile(),
    //   getVehicleRoute(),
    //   getHome(),
    //   getIncomeList({
    //     year: moment(Date()).format('yyyy')
    //   })
    // ]).then(axios.spread((profile, vehicleRoute, contract, income) => {
    //   AsyncStorage.setItem(StorageKey.KEY_USER_PROFILE, JSON.stringify(profile))
    //   setprofileData(profile)
    //   setvehicleRute(vehicleRoute)
    //   setContractData(contract)
    //   setincomeData(income)
    //   setrefreshing(false)
    //   setisLoading(false)
    // })).catch(err => {
    //   setrefreshing(false)
    //   setisLoading(false)
    //   showDialog(error.message)
    // })
  }

  useEffect( () => {

    getProfileApi()
  
  }, [route.params])

  const goToEdit = () => {
    console.log("data",profileData);
    if (profileData) {
      navigation.navigate('EditProfile', { isEdit: true, data: profileData,isVerified: profileData.status == 'verified' ? true : false})
    }
  }

  const goToEditVehicle = () => {
    navigation.navigate('RegisterVehicleMain', {isRegister: false, isEdit: true})
  }

  const goToAddVehicle = () => {
    navigation.navigate('RegisterVehicleMain', {isRegister: false, isEdit: false})
  }

  const goToContract = () => {
    navigation.navigate('CurrentContract', { id: contractData?.active_contract?.contract_id, isEmpty: contractData.active_contract == null, isCurrent: true})
  }

  const goToBank = () => {
    navigation.navigate('Bank', {isReadOnly: profileData.account_bank ? profileData.status === 'verified' ? true : false : true, prevData: profileData.account_bank ? profileData.account_bank : profileData.driver_company.account_bank})
  }

  const logout = () => {
    showDialog(translate('logout_confirmation'), true, signOut, null, translate('yes'), translate('cancel'), true)
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <AccountTopHeader data={profileData} isLoading={isLoading}/>

      <ScrollView
        style={{zIndex: -99,}}
       refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={getProfileApi}
        />
      }
      >

        <View>
          { isLoading ? <View style={{margin: 16}}><ShimmerPlaceholder style={{width: '100%', height: 100, }} /></View> : (!isEmpty(vehicleRute) ? (
            <View style={{zIndex: -1}}>
              <AccountCardInfo
                containerStyle={{margin: 8, zIndex: -1}}
                data={vehicleRute}
                onPress={goToEditVehicle}
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
                onPress={goToAddVehicle}
              />

              <InfoMenu
                containerStyle={{marginHorizontal: 16, marginBottom: 16}}
                text={translate('info_not_verified')}
              />

            </View>
          ))}

          <Divider />

            <View style={{margin: 12}}>

              {!isEmpty(incomeData) && <IncomeProfile data={incomeData} onPress={() => navigation.navigate('IncomeDetail')} />}

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
              onPress={goToBank}
            />

            <AccountMenu
              Icon={IconContactUs}
              text={translate('contact_us')}
              containerStyle={{marginTop: 16}}
              onPress={openWhatsapp}
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
