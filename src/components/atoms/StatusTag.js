import React from 'react'
import { View } from 'react-native'
import Colors from '../../constants/Colors'
import { LatoRegular } from './CustomText'


const StatusTag = ({text, containerStyle}) => {
    return <View style={[containerStyle, {backgroundColor: Colors.lightPrimary, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 2, alignSelf: 'baseline' }]}>
        <LatoRegular style={{color: Colors.primary, fontSize: 10}}>{text}</LatoRegular>
    </View>
} 

export default StatusTag