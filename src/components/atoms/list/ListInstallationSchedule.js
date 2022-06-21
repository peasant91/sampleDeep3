import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Colors from '../../../constants/Colors'

import IconLocation from '../../../assets/images/ic_location_schedule.svg'
import { LatoBold, LatoRegular } from '../CustomText'
import translate from '../../../locales/translate'
import {momentx} from '../../../actions/helper'
import moment from 'moment'

const ListInstallationSchedule = ({data, onPressMap}) => {


    const getDate = () => {
        const start = momentx(data.start_date)
        const end = momentx(data.start_date)
        if (start.format('YYYY') != end.format('YYYY')) {
            return start.format('DD MMMM YYYY') + ' - ' + end.format('DD MMMM YYYY')
        } else if (start.format('MM') != end.format('MM')) {
            return start.format('DD MMMM') + ' - ' + end.format('DD MMMM YYYY')
        } else {
            return start.format('DD') + ' - ' + end.format('DD MMMM YYYY')
        }
    }

    const getTime = () => {
        const startTime = momentx(data.start_date).format('HH:mm')
        const endTime = momentx(data.end_date).format('HH:mm')
        console.log(`tanggalnya nih ${getDate() + ', ' + startTime + ' - '  +endTime + ' WIB'}`);
        return getDate() + ', ' + startTime + ' - '  +endTime + ' WIB'
    }

    return <View style={styles.container}>
        <IconLocation/>
        <View style={{paddingLeft: 10, justifyContent: 'space-between'}}>
            <LatoBold style={{fontSize: 12, color: Colors.primary}}>{data.location}</LatoBold>
            <LatoRegular style={{fontSize: 12}}>{getTime()}</LatoRegular>
            <TouchableOpacity onPress={onPressMap}>
            <LatoRegular style={{color: Colors.secondary, textDecorationLine: 'underline', fontSize: 12}}>{translate('see_in_map')}</LatoRegular>
            </TouchableOpacity>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: Colors.divider,
        borderRadius: 10,
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16, 
        height: 90,
        backgroundColor: 'white'
    }
})

export default ListInstallationSchedule