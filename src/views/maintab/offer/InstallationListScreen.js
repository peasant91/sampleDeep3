import React from 'react'
import { FlatList, View } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { openMaps } from '../../../actions/helper'
import ListInstallationSchedule from '../../../components/atoms/list/ListInstallationSchedule'
import NavBar from '../../../components/atoms/NavBar'
import translate from '../../../locales/translate'

const InstallationListScreen = ({navigation, route}) => {

    const {data} = route.params

    return <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>   
        <NavBar title={translate('installation_location')} navigation={navigation} shadowEnabled />
        <View style={{backgroundColor: '#FAFAFA', flex: 1}}>
            <FlatList
                contentContainerStyle={{paddingVertical: 16}}
                data={data}
                keyExtractor={item => item.id}
                renderItem={({item, index}) => {
                    return <ListInstallationSchedule data={item} onPressMap={() => openMaps(Number(item.lat), Number(item.lng))}/>
                }}
            />
        </View>
    </SafeAreaView>

}

export default InstallationListScreen