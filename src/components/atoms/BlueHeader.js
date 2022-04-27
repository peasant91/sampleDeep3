import React from 'react'
import { View } from 'react-native'
import Colors from '../../constants/Colors'
import { LatoBold, LatoRegular } from './CustomText'


const BlueHeader = ({ title, sub }) => {

    return <View style={{
        marginTop: 16,
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: Colors.primary,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <LatoBold style={{color: 'white', fontSize: 24}}>{title}</LatoBold>
        <LatoRegular style={{color: 'white', fontSize: 10, marginTop: 10}}>{sub}</LatoRegular>
    </View>
}

export default BlueHeader