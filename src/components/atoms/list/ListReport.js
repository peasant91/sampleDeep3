import React from 'react'
import { View } from 'react-native'
import { LatoBold } from '../CustomText'
import Divider from '../Divider'
import translate from '../../../locales/translate'

const ListReport = ({data}) => {

    return <View style={{padding: 16}}>
        <Divider/>
        <View style={{flexDirection: 'row'}}>
            <LatoBold>{data.start_date}</LatoBold>
            <LatoBold>{translate('see_report')}</LatoBold>
        </View>
    </View>
}

export default ListReport