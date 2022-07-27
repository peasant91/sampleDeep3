import React from 'react'
import { View } from 'react-native'
import { LatoBold, LatoRegular } from './CustomText'


const KeyValueComponent = ({ title, value, isBold, style, containerStyle }) => {

    return <View style={containerStyle}>
        {
            !isBold ? <View style={{ flexDirection: 'row', marginTop: 10,alignItems:'flex-start' }}>

                <LatoRegular containerStyle={{ flex: 3 }} style={style}>{title}</LatoRegular>
                <LatoRegular style={style}>:</LatoRegular>
                <LatoRegular containerStyle={{ flex: 4, marginLeft: 10 }} style={style}>{value}</LatoRegular>
            </View>
                :
                <View style={{ flexDirection: 'row' }}>
                    <LatoBold containerStyle={{ flex: 3 }} style={style}>{title}</LatoBold>
                    <LatoBold style={style}>:</LatoBold>
                    <LatoBold containerStyle={{ flex: 4, marginLeft: 10 }} style={style}>{value}</LatoBold>
                </View>
        }

    </View>
}

export default KeyValueComponent