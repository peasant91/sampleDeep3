import React from 'react'
import { View } from 'react-native'
import Colors from '../../constants/Colors'

const Divider = ({style}) => {
    return <View style={[style, {height: 1, backgroundColor: Colors.divider}]}>

    </View>
}

export default Divider