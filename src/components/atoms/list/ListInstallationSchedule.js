import React from 'react'
import { StyleSheet, View } from 'react-native'
import Colors from '../../../constants/Colors'

import IconLocation from '../../../assets/images/ic_location_schedule.svg'
import { LatoBold, LatoRegular } from '../CustomText'
import translate from '../../../locales/translate'

const ListInstallationSchedule = ({data}) => {

    return <View style={styles.container}>
        <IconLocation/>
        <View style={{paddingLeft: 10, justifyContent: 'space-between'}}>
            <LatoBold style={{fontSize: 12}}>{data.title}</LatoBold>
            <LatoRegular style={{fontSize: 12}}>{data.date}</LatoRegular>
            <LatoRegular style={{color: Colors.secondary, textDecorationLine: 'underline', fontSize: 12}}>{translate('see_in_map')}</LatoRegular>
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
        height: 90
    }
})

export default ListInstallationSchedule