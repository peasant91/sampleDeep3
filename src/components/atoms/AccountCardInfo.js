import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Colors from '../../constants/Colors'
import translate from '../../locales/translate'
import { LatoBold, LatoRegular } from './CustomText'

import IconCar from '../../assets/images/ic_home_car.svg'
import IconVerified from '../../assets/images/ic_home_verified.svg';


const AccountCardInfo = ({ data, containerStyle, onPress }) => {

    return <View style={[containerStyle, styles.container]}>

        <View style={{ backgroundColor: '#F5F6FF', padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <LatoRegular style={{ color: Colors.primary }} Icon={IconCar}>{data.plate_model}</LatoRegular>
            <IconVerified
                color={data.status.includes('Lulus') ? Colors.secondary : Colors.grey}
            />
        </View>

        <View style={{ flexDirection: 'row', height: 95, padding: 10 }}>
            <View style={{ justifyContent: 'space-around', flex: 1.2 }}>
                <LatoRegular style={{ color: Colors.primary }}>{translate('status')}</LatoRegular>
                <LatoRegular style={{ color: Colors.primary }}>{translate('travel_total')}</LatoRegular>
                <LatoRegular style={{ color: Colors.primary }}>{translate('travel_today')}</LatoRegular>
            </View>
            <View style={{ justifyContent: 'space-around', marginHorizontal: 10 }}>
                <LatoRegular>:</LatoRegular>
                <LatoRegular>:</LatoRegular>
                <LatoRegular>:</LatoRegular>
            </View>
            <View style={{ justifyContent: 'space-around', flex: 1 }}>
                <LatoRegular style={{ color: Colors.primary }}>{data.status}</LatoRegular>
                <LatoRegular style={{ color: Colors.primary }}>{data.total_rute_distances + 'Km'}</LatoRegular>
                <LatoRegular style={{ color: Colors.primary }}>{data.day_rute_distance + 'Km'}</LatoRegular>
            </View>
        </View>

        {!data.status.includes('Lulus') &&
            <TouchableOpacity onPress={onPress}>
                <LatoBold containerStyle={{ alignSelf: 'center' }} style={{ textDecorationLine: 'underline', color: Colors.grey, fontSize: 10, padding: 10, textAlign: 'center' }}>{translate('change_vehicle')}</LatoBold>
            </TouchableOpacity>
        }

    </View>
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    }
})

export default AccountCardInfo