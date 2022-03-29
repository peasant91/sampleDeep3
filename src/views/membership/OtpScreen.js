import OTPInputView from '@twotalltotems/react-native-otp-input'
import React from 'react'
import { View, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { LatoBold, LatoRegular } from '../../components/atoms/CustomText'
import NavBar from '../../components/atoms/NavBar'
import Colors from '../../constants/Colors'
import translate from '../../locales/translate'



const OtpScreen = ({navigation, route}) => {

    return <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        <NavBar title={translate('otp_code')} navigation={navigation} />
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{padding: 16}}>
            <LatoRegular>{translate('please_enter_otp')}</LatoRegular>
            <OTPInputView 
             style={{width: '80%', height: 200, alignSelf: 'center'}}
            pinCount={5}
               autoFocusOnLoad
                   codeInputFieldStyle={styles.underlineStyleBase}
    codeInputHighlightStyle={styles.underlineStyleHighLighted}
    onCodeFilled = {(code) => {
        console.log(`Code is ${code}, you are good to go!`)
    }}
            />
            <LatoRegular style={{textAlign: 'center'}} containerStyle={{alignSelf: 'center'}}>{translate('otp_desc', {email: 'email'})}</LatoRegular>

            </View>

        </ScrollView>
        <View style={{padding: 16, backgroundColor: Colors.divider}}>
            <LatoBold style={{color: Colors.primary}} containerStyle={{alignSelf: 'center'}}>{translate('resend_otp_code_id', {string: '30'})}</LatoBold>
        </View>
    </SafeAreaView>
}

const styles = StyleSheet.create({
  borderStyleBase: {
    width: 50,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: "black",
  },

  underlineStyleBase: {
    width: 50,
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