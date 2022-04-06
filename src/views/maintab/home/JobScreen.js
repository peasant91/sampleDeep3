import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LatoBold } from '../../../components/atoms/CustomText'
import NavBar from '../../../components/atoms/NavBar'
import translate from '../../../locales/translate'

const JobScreen = ({navigation, route}) => {

    return <SafeAreaView>
        <NavBar title={translate('doing_job_title')} navigation={navigation}/>
        <View>
            <View>
                <LatoBold>{translate('time')}</LatoBold>
            </View>
        </View>
    </SafeAreaView>

}

export default JobScreen