import React from 'react'
import { View } from 'react-native'
import CustomCheckbox from '../atoms/Checkbox'
import { LatoRegular } from '../atoms/CustomText'


const StickerAreaCheckbox = ({id, title, isChecked, dispatch}) => {


    const onPress = () => {
        dispatch({
            type: 'input',
            id: id,
            input: !isChecked,
            isValid: isChecked
        })
    }

    return <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <LatoRegular>{title}</LatoRegular>
        <CustomCheckbox onPress={onPress}
        isChecked={isChecked}/>
    </View>
}

export default StickerAreaCheckbox