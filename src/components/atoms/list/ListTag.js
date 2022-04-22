import React from 'react'
import { View } from 'react-native'
import Colors from '../../../constants/Colors'
import { LatoRegular } from '../CustomText'

const ListTag = ({title}) => {

    return <View style={{backgroundColor: Colors.divider, borderRadius: 50, paddingHorizontal: 10, paddingVertical: 5, marginRight: 5, marginTop: 10}}>
        <LatoRegular style={{fontSize: 12, color: Colors.primary}}>{title}</LatoRegular>
    </View>
}

export default ListTag