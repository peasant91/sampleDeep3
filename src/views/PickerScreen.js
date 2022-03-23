import React from 'react'
import { SafeAreaView } from 'react-native'
import CustomInput from '../components/atoms/CustomInput'

import IconSearch from '../../assets/images/ic_search_offer.svg';
import { Input } from 'react-native-elements';
import { translate } from 'i18n-js';

const PickerScreen = ({navigation, route}) => {

    const { id, title } = route.params

    return <SafeAreaView> 
        <View>

        <Input
            rightIcon={IconSearch}
            placeholder={translate('title')}
        />
        </View>
    </SafeAreaView>
}

export default PickerScreen