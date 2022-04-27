import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { LatoRegular } from './CustomText'
import Colors from '../../constants/Colors'

const PeriodStrip = ({text, isSelected, onPress}) => {
    return <TouchableOpacity onPress={onPress}>
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <LatoRegular style={{color: Colors.primary, fontFamily: isSelected ? 'Lato-Bold' : 'Lato-Regular'}} containerStyle={{flex: 1, marginHorizontal: 16}}>{text}</LatoRegular>
        {isSelected && <View style={{height: 2, backgroundColor: Colors.primary, width: '100%'}}/> }
    </View>
    </TouchableOpacity> 
}

export default PeriodStrip