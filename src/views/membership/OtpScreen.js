import OTPInputView from '@twotalltotems/react-native-otp-input'
import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import CountdownOtp from '../../components/atoms/CountdownOtp'
import CustomButton from '../../components/atoms/CustomButton'
import CustomInput from '../../components/atoms/CustomInput'
import { LatoBold, LatoRegular } from '../../components/atoms/CustomText'
import NavBar from '../../components/atoms/NavBar'
import Colors from '../../constants/Colors'
import translate from '../../locales/translate'
import { register, sendOtp, verifyOtp} from '../../services/auth'




const OtpScreen = ({ navigation, route }) => {

  const { data, isRegister } = route.params

  const [otpId, setotpId] = useState()
  const [otpCode, setotpCode] = useState()

  const sendOtpApi = async () => {
    sendOtp({
      address: data.email,
      type: 'email',
      otp_id: otpId
    }).then(response => {
      setotpId(response.id)
    })
  }
  

  const onValidate = () => {
    if (isRegister) {
      if (otpCode && otpCode.length > 5) {
        verifyOtp({
          code: otpCode,
          otp_id: otpId
        }).then(() => {
          doRegister()
        }).catch(error => {

        })
      }
    }
  }

  const doRegister = () => {
        register({
          ...data,
          otp_id: ot
        })
  }

  useEffect(() => {
    sendOtpApi()
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
          containerStyle={{paddingTop: 40}}
          types={'primary'}
          title={translate('validate')}
          onPress={onValidate}
        />


      </View>

    </ScrollView>
    <CountdownOtp onPress={sendOtpApi}/>
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