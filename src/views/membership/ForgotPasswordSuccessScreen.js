import React from 'react'
import { SafeAreaView, View } from 'react-native'

import Icon from '../../assets/images/ic_forgot_password_success.svg'
import CustomButton from '../../components/atoms/CustomButton'
import { LatoBold } from '../../components/atoms/CustomText'
import translate from '../../locales/translate'


const ForgotPasswordSuccessScreen = ({navigation, route}) => {

    return <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1, justifyContent: 'center'}}>
        <Icon/>
        <LatoBold containerStyle={{padding: 16, marginTop: 50}} style={{textAlign: 'center', fontSize: 18}}>{translate('forgot_password_success')}</LatoBold>
        </View>
        <CustomButton containerStyle={{padding: 16}} types={'primary'} onPress={() => navigation.pop()} title={translate('back')}/>
    </SafeAreaView>

}

export default ForgotPasswordSuccessScreen