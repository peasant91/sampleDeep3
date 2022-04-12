import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LatoBold } from '../../../components/atoms/CustomText'
import Divider from '../../../components/atoms/Divider'
import NavBar from '../../../components/atoms/NavBar'
import Colors from '../../../constants/Colors'
import translate from '../../../locales/translate'

const JobScreen = ({navigation, route}) => {

    const [time, settime] = useState(['00','01','50'])

    return <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <NavBar title={translate('do_job')} navigation={navigation}/>
        <View style={{flex: 1}}>
            <View style={{padding: 16, justifyContent: 'center', alignItems: 'center', flex: 2}}>
                <LatoBold style={{fontSize: 18}}>{translate('time')}</LatoBold>
                <View style={{flexDirection: 'row', padding: 10}}>
                    <LatoBold containerStyle={styles.time} style={{fontSize: 38}}>{time[0]}</LatoBold>
                    <LatoBold containerStyle={{padding: 5}} style={{fontSize: 38}}>:</LatoBold>
                    <LatoBold containerStyle={styles.time} style={{fontSize: 38}}>{time[1]}</LatoBold>
                    <LatoBold containerStyle={{padding: 5}} style={{fontSize: 38}}>:</LatoBold>
                    <LatoBold containerStyle={styles.time} style={{fontSize: 38}}>{time[2]}</LatoBold>
                </View>
            </View>

            <Divider/>

            <View style={{padding: 16, justifyContent: 'center', alignItems: 'center', flex: 3}}>
                <LatoBold style={{fontSize: 18}}>{translate('average_speed')}</LatoBold>
                <LatoBold style={{fontSize: 48, marginTop: 24}}>20</LatoBold>
                <LatoBold style={{fontSize: 18}}>Km/s</LatoBold>
            </View>

            <Divider/>

            <View style={{padding: 16, justifyContent: 'center', alignItems: 'center', flex: 3}}>
                <LatoBold style={{fontSize: 18}}>{translate('distance')}</LatoBold>
                <LatoBold style={{fontSize: 48, marginTop: 24}}>20</LatoBold>
                <LatoBold style={{fontSize: 18}}>Km/s</LatoBold>
            </View>
        </View>
    </SafeAreaView>

}

const styles = StyleSheet.create({
    time: {
        backgroundColor: Colors.divider, 
        padding: 5,
        borderRadius: 10
    }
})

export default JobScreen