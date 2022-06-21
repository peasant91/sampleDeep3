import moment from 'moment'
import { momentx } from '../../../actions/helper'
import React from 'react'
import { View } from 'react-native'
import { Image } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getFullLink } from '../../../actions/helper'
import Colors from '../../../constants/Colors'
import { LatoBold, LatoRegular } from '../CustomText'
import Divider from '../Divider'


const ListNotification = ({data, onPress}) => {
    
    return <TouchableOpacity style={{backgroundColor: data.read_at ? 'white' : '#F4F5FF'}} onPress={onPress}>

    <View style={{flexDirection: 'row', padding: 16, flex: 1, alignItems: 'flex-start'}}>
        <Image
            source={{uri: getFullLink(data.icon)}}
            style={{width: 24, height: 24, borderRadius: 24, resizeMode: 'cover'}}
        />

        <View style={{flex: 1, marginLeft: 10}}>
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
                <LatoBold style={{color: Colors.primary }}>{data.title}</LatoBold>
                <LatoRegular style={{fontSize: 10}}>{momentx(data.date).format('DD MMM yyyy')}</LatoRegular>
            </View>

            <LatoRegular style={{color: Colors.secondText}}>{data.body}</LatoRegular>
        </View>

    </View>
    <Divider/>
    </TouchableOpacity>

}

export default ListNotification