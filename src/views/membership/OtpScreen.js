import AsyncStorage from '@react-native-async-storage/async-storage'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, BackHandler } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { showDialog } from '../../actions/commonActions'
import CountdownOtp from '../../components/atoms/CountdownOtp'
import CustomButton from '../../components/atoms/CustomButton'
import CustomInput from '../../components/atoms/CustomInput'
import { LatoBold, LatoRegular } from '../../components/atoms/CustomText'
import NavBar from '../../components/atoms/NavBar'
import Colors from '../../constants/Colors'
import StorageKey from '../../constants/StorageKey'
import translate from '../../locales/translate'
import { forgotPassword, register, sendOtp, verifyForgotPassword, verifyOtp } from '../../services/auth'




const OtpScreen = ({ navigation, route }) => {

  const { isRegister } = route.params

  const [otpId, setotpId] = useState(route.params.data.otpId)
  const [otpCode, setotpCode] = useState()
  const [data, setData] = useState(route.params.data)
  const [isLoading, setisLoading] = useState(false)

  const sendOtpApi = async () => {
    if (isRegister) {
    sendOtp({
      address: data.email,
      type: 'email',
      otp_id: otpId
    }).then(response => {
      console.log(response)
      setotpId(response.id)
    }).catch(error => {
      console.log(error)
      showDialog(error.message)
    })
    } else {
    setisLoading(true)
      forgotPassword({
        address: data.phone,
        otp_id: otpId
      }).then(response => {
        setisLoading(false)
        setotpId(response.id)
      }).catch(error => {
        setisLoading(false)
        showDialog(error.message)
        console.log(error)
      })
    }
  }



  const onValidate = () => {
    if (otpCode && otpCode.length > 5) {
      setisLoading(true)
      if (isRegister) {
        verifyOtp({
          code: otpCode,
          otp_id: otpId
        }).then(() => {
          setisLoading(false)
          doRegister()
        }).catch(error => {
          setisLoading(false)
          showDialog(error.message)
        })
      } else {
        verifyForgotPassword({
          code: otpCode,
          otp_id: otpId
        }).then(() => {
          setisLoading(false)
          goToForgotPassword()
        }).catch(error => {
          setisLoading(false)
          showDialog(error.message)
        })
      }
    } 
  }

  const goToForgotPassword = () => {
    navigation.navigate('ResetPassword', {otpId: otpId})
  }

  const doRegister = () => {
    setisLoading(true)
    register({
      ...data,
      otp_id: otpId
    }).then((response) => {
      setisLoading(false)
      AsyncStorage.setItem(StorageKey.KEY_ACCESS_TOKEN, response.access_token)
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'RegisterSuccess' }],
      // });
      navigation.navigate('RegisterSuccess')
    }).catch(error => {
      setisLoading(false)
      showDialog(error.message)
      console.log(error)
    })
  }

  useEffect(() => {
    if (isRegister) {
      sendOtpApi()
    }
  }, [])

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
      }, [])


  return <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
    <NavBar title={translate('otp_code')} navigation={navigation} />
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ padding: 16 }}>
        <LatoRegular>{translate('please_enter_otp')}</LatoRegular>
        <OTPInputView
          style={{ width: '85%', height: 100, alignSelf: 'center', marginTop: 50 }}
          pinCount={6}
          autoFocusOnLoad={false}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={(code) => {
            console.log(`Code is ${code.length}, you are good to go!`)
            setotpCode(code)
          }}
        />
        <LatoRegular style={{ textAlign: 'center' }} containerStyle={{ alignSelf: 'center' }}>{translate('otp_desc', { email: data.email })}</LatoRegular>

        <CustomButton
          containerStyle={{ paddingTop: 40 }}
          types={'primary'}
          title={translate('validate')}
          onPress={onValidate}
          isLoading={isLoading}
        />


      </View>

    </ScrollView>
    <CountdownOtp onPress={sendOtpApi} />
  </SafeAreaView>
}

const styles = StyleSheet.create({
  borderStyleBase: {
    width: 40,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: "black",
  },

  underlineStyleBase: {
    width: 40,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: 'black',
    fontSize: 18,
    fontFamily: 'Lato-Bold'
  },

  underlineStyleHighLighted: {
    borderColor: Colors.primary,
    color: 'black',
    fontSize: 18,
    fontFamily: 'Lato-Bold'
  },
});

export default OtpScreen