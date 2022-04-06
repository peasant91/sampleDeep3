import { FlatList, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import NavBar from '../../../components/atoms/NavBar'
import translate from '../../../locales/translate'
import EmptyContract from '../../../components/atoms/EmptyContract'


const ContractHistoryScreen = ({navigation, route}) => {

    const [data, setdata] = useState()

    return <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <NavBar title={translate('offer_history')} navigation={navigation} shadowEnabled/>
        {data ? <FlatList/> : <EmptyContract desc={translate('no_history_contract')}/>}
    </SafeAreaView>
}

export default ContractHistoryScreen