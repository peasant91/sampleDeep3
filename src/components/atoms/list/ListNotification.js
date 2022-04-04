import React from 'react'
import { View } from 'react-native'
import { Image } from 'react-native-elements'
import Colors from '../../../constants/Colors'
import { LatoBold, LatoRegular } from '../CustomText'
import Divider from '../Divider'


const ListNotification = ({data}) => {
    return <View style={{backgroundColor: data.isRead ? 'white' : '#F4F5FF'}}>

    <View style={{flexDirection: 'row', padding: 16, flex: 1, alignItems: 'flex-start'}}>
        <Image
            source={{uri: data.imageUrl}}
            style={{width: 24, height: 24, borderRadius: 24, resizeMode: 'center'}}
        />

        <View style={{flex: 1, marginLeft: 10}}>
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
                <LatoBold style={{color: Colors.primary }}>{data.title}</LatoBold>
                <LatoRegular style={{fontSize: 10}}>{data.date}</LatoRegular>
            </View>

            <LatoRegular style={{color: Colors.secondText}}>{data.desc}</LatoRegular>
        </View>

    </View>
    <Divider/>
    </View>

}

export default ListNotification