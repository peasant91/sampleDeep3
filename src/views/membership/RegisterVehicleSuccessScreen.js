import AnimatedLottieView from 'lottie-react-native'
import React, { useContext } from 'react'
import { SafeAreaView, View } from 'react-native'

import CustomButton from '../../components/atoms/CustomButton'
import { LatoBold, LatoRegular } from '../../components/atoms/CustomText'
import translate from '../../locales/translate'

import { AuthContext } from '../../../App'

const RegisterVehicleSuccessScreen = ({navigation, route}) => {

    const { signIn } = useContext(AuthContext)

    return <SafeAreaView style={{ flex: 1, backgroundColor: 'white', }}>
        <AnimatedLottieView
            source={require('../../assets/lottie/register_vehicle_success.json')}
            autoPlay
            loop
            style={{ width: '100%', marginTop: 16 }}
        />

        <View style={{ flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' }}>
            <LatoBold style={{ fontSize: 18, paddingBottom: 16 }}>{translate('register_vehicle_success')}</LatoBold>
            <LatoRegular style={{ textAlign: 'center' }}>{translate('register_vehicle_success_desc')}</LatoRegular>
        </View>


        <View style={{ padding: 16 }}>
            <CustomButton title={translate('go_to_home')} onPress={signIn} />
        </View>

    </SafeAreaView>
}

export default RegisterVehicleSuccessScreen