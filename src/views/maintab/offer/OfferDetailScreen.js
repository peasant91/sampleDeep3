import React from 'react'
import { FlatList, ScrollView, View } from 'react-native'
import { Image } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../../components/atoms/CustomButton'
import { LatoBold, LatoRegular } from '../../../components/atoms/CustomText'
import NavBar from '../../../components/atoms/NavBar'
import Colors from '../../../constants/Colors'
import translate from '../../../locales/translate'

import IconLocation from '../../../assets/images/ic_home_location.svg';
import Divider from '../../../components/atoms/Divider'
import ListInstallationSchedule from '../../../components/atoms/list/ListInstallationSchedule'

const data = {
    imageUrl: 'https://picsum.photos/200/300',
    name: 'PT Bank Mega, Tbk',
    address: 'Prov. Jawa Tengah',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia quis vel eros donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus'
}

const dummyData = [
    {
        id: 1,
        title: 'Otongmedia',
        date: '14:00 - 17:00 WIB'
    },
    {
        id: 2,
        title: 'Otongmedia',
        date: '14:00 - 17:00 WIB'
    },
]

const OfferDetailScreen = ({navigation, route}) => {

    return <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <NavBar title={translate('offer_detail')} navigation={navigation} shadowEnabled/>
        <ScrollView style={{flex: 1}}>

            <View>

                <View style={{flexDirection: 'row', padding: 16}}>
                    <Image source={{uri: data.imageUrl}} style={{height: 64, width: 'auto', aspectRatio: 1}}/>

                    <View style={{paddingLeft: 16}}>
                        <LatoRegular>{data.name}</LatoRegular>
                        <LatoRegular 
                            containerStyle={{paddingVertical: 10}}
                            style={{color: Colors.primary, fontSize: 10}}
                            Icon={IconLocation}>{data.address}</LatoRegular>
                        <LatoRegular
                            style={{fontSize: 10}}
                        >{data.name}</LatoRegular>
                    </View>

                </View>

                <Divider/>

                <View style={{flexDirection: 'row', padding: 16, height: 120}}>
                    <View style={{flex:4, justifyContent: 'space-around'}}>
                        <LatoRegular>{translate('offer_type')}</LatoRegular>
                        <LatoRegular>{translate('contract_end')}</LatoRegular>
                        <LatoRegular>{translate('estimated_profit')}</LatoRegular>
                    </View>
                    <View style={{justifyContent: 'space-around'}}>
                        <LatoRegular>:</LatoRegular>
                        <LatoRegular>:</LatoRegular>
                        <LatoRegular>:</LatoRegular>
                    </View>
                    <View style={{flex:5, marginLeft: 10, justifyContent: 'space-around'}}>
                        <LatoRegular>Full Body</LatoRegular>
                        <LatoRegular>Full Body</LatoRegular>
                        <LatoRegular>Full Body</LatoRegular>
                    </View>
                    
                </View>

                <Divider/>

                <View style={{padding: 16, justifyContent: 'space-between', flexDirection: 'row'}}>
                    <LatoBold style={{color: Colors.primary}}>{translate('installation_time_title')}</LatoBold>
                    <LatoBold style={{textDecorationLine: 'underline', color: Colors.secondary}}>{translate('see_all')}</LatoBold>
                </View>

                <FlatList
                    scrollEnabled={false}
                    data={dummyData}
                    keyExtractor={item => item.id}
                    renderItem={({item, index}) => {
                        return <ListInstallationSchedule data={item}/>
                    }}
                />

                <LatoBold containerStyle={{paddingHorizontal: 16}}>{translate('company_detail')}</LatoBold>
                <LatoRegular containerStyle={{paddingHorizontal: 16, paddingVertical: 10}}>{data.desc}</LatoRegular>

            </View>
        </ScrollView>

        <CustomButton 
            containerStyle={{padding: 16}}
            types={'primary'}
            title={translate('apply')}/>
    </SafeAreaView>

}

export default OfferDetailScreen