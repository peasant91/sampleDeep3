import React from 'react'
import { View } from 'react-native'
import Colors from '../../constants/Colors'
import translate from '../../locales/translate'
import { LatoBold, LatoRegular } from './CustomText'

import IconEmpty from '../../assets/images/ic_empty_offer.svg';

const EmptySearch = ({title}) => {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 }}>
        <IconEmpty />
        <LatoBold containerStyle={{ marginVertical: 10 }}>{translate('empty_offer_title', {title: title})}</LatoBold>
        <LatoRegular style={{ textAlign: 'center', fontSize: 12, color: Colors.grey }}>{translate('empty_offer_desc', {title: title.toLowerCase()})}</LatoRegular>
    </View>
}

export default EmptySearch