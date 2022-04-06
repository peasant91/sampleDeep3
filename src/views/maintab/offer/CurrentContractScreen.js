import React, { useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyContract from '../../../components/atoms/EmptyContract'
import NavBar from '../../../components/atoms/NavBar'
import translate from '../../../locales/translate'

import IconHistory from '../../../assets/images/ic_contract_history.svg'

const CurrentContractScreen = ({navigation, route}) => {

    const [data, setdata] = useState()

    const seeOffer = () => {
        navigation.navigate('Offer')
    }

    return <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <NavBar 
            title={translate('active_contract')} 
            navigation={navigation} 
            shadowEnabled 
            RightView={
                <TouchableOpacity onPress={() => navigation.navigate('ContractHistory')}>
                    <IconHistory/>
                </TouchableOpacity>
            } />
        {data ? 
            <ScrollView>

            </ScrollView> :
            <EmptyContract desc={translate('no_active_contract')} onPress={seeOffer}/>
        }
    </SafeAreaView>
}

export default CurrentContractScreen