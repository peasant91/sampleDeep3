import React from 'react'
import { View } from 'react-native'
import { Image } from 'react-native-elements'
import translate from '../../locales/translate'
import CustomButton from './CustomButton'
import { LatoRegular } from './CustomText'


const EmptyContract = ({ desc, onPress, onPressTitle }) => {

    return <View style={{ flex: 1 }} >
        <View style={{ flex: 1, justifyContent: 'center' }}>

            <Image source={require('../../assets/images/ic_car_empty.png')} style={{ width: '100%', height: undefined, aspectRatio: 2.8 }} resizeMode={'cover'} />
            <LatoRegular containerStyle={{ paddingHorizontal: 60, paddingVertical: 30 }} style={{ textAlign: 'center' }}>{desc}</LatoRegular>
        </View>
        {
            onPress && <CustomButton title={translate('see_offer').toUpperCase()} types='primary' containerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }} onPress={onPress} />
        }
    </View>
}

export default EmptyContract