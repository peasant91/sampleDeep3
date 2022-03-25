import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { StyleSheet } from 'react-native'
import { LatoRegular } from '../CustomText'


import IconCheckmark from '../../../assets/images/ic_checkmark.svg'
import Colors from '../../../constants/Colors'

const ListArea = ({selectedId, onPress, data, pickerId}) => {
    return <TouchableOpacity onPress={() => onPress(data.id, data.name)}>

    <View style={{backgroundColor: selectedId == data.id ? '#EEEEFF' : 'white'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 16}}>
            <LatoRegular>{data.name}</LatoRegular>
            {selectedId == data.id &&
            <IconCheckmark/>}
        </View>
        <View style={{height: 1, backgroundColor: Colors.divider}}/>
    </View>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container: {

    }
})

export default ListArea