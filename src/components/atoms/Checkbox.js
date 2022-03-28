import React from 'react'
import {  } from 'react-native'
import { CheckBox } from 'react-native-elements'

import IconChecked from '../../assets/images/ic_checked_box.svg'
import IconUnchecked from '../../assets/images/ic_unchecked_box.svg'

const CustomCheckbox = ({isChecked, title, onPress}) => {

    return <CheckBox
    checkedIcon={<IconChecked/>}
    uncheckedIcon={<IconUnchecked/>}
    checked={isChecked}
    title={title}
    onPress={onPress}
    containerStyle={{backgroundColor: 'white', borderWidth: 0, marginLeft: 0, paddingLeft: 0}}
    />
}

export default CustomCheckbox