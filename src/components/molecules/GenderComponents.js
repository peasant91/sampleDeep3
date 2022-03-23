import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useEffect } from 'react'
import { FlatList, View } from 'react-native'
import StorageKey from '../../constants/StorageKey'
import translate from '../../locales/translate'
import { LatoBold } from '../atoms/CustomText'
import GenderButton from '../atoms/GenderButton'

const GenderComponents = ({selectedId, onPress, containerStyle, isCheck}) => {

    const [gender, setgender] = useState({})

    useEffect(async() => {
      AsyncStorage.getItem(StorageKey.KEY_GENDER).then(value => {
          console.log(value)
          setgender(JSON.parse(value))
      })
    
    }, [])
    

    return <View style={containerStyle}>
        <LatoBold>{translate('gender')}</LatoBold>
        <FlatList
        style={{paddingTop: 10}}
        horizontal={true}
        scrollEnabled={false}
        data={gender}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
            console.log(item)
            return <GenderButton title={translate(item.value)} onPress={() => onPress(item.id)} isSelected={selectedId == item.value}/>
        }}
        />
        {isCheck && selectedId == '' && <LatoBold style={{color: 'red', marginTop: 5}}>{translate('error_pick_one')}</LatoBold>}
    </View>
}

export default GenderComponents