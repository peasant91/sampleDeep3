import OTPInputView from '@twotalltotems/react-native-otp-input'
import React from 'react'
import { View, SafeAreaView, ScrollView } from 'react-native'
import { LatoBold, LatoRegular } from '../../components/atoms/CustomText'
import NavBar from '../../components/atoms/NavBar'
import Colors from '../../constants/Colors'
import translate from '../../locales/translate'



const OtpScreen = ({navigation, route}) => {

    return <SafeAreaView>
        <NavBar title={translate('otp_code')} />
        <ScrollView style={{flex: 1}}>
            <OTPInputView pinCount={5}/>

        </ScrollView>
        <View style={{padding: 16, backgroundColor: Colors.divider}}>
            <LatoBold>{translate('resend_otp_code_in', {string: '30'})}</LatoBold>
        </View>
    </SafeAreaView>
}

export default OtpScreen