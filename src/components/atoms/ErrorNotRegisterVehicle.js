import React from 'react'
import { View } from 'react-native'
import { Image } from 'react-native-elements'
import translate from '../../locales/translate'
import { LatoRegular } from './CustomText'



const ErrorNotRegisterVehicle = () => {

    return <View style={{flex: 1, justifyContent: 'center'}}>
        <Image source={require('../../assets/images/ic_car_empty.png')} style={{width: '100%', aspectRatio: 3}}/>
        <LatoRegular containerStyle={{paddingVertical: 24, paddingHorizontal: 32}} style={{textAlign: 'center'}}>{translate('error_vehicle_not_registered')}</LatoRegular>
    </View>

}

export default ErrorNotRegisterVehicle