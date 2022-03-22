import moment from 'moment';
import React from 'react'
import { StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import Colors from '../../../constants/Colors';
import { Subtitle1, Subtitle2, Desc2 } from '../CustomText';

const ListNews = ({ item, onPress }) => {

    return (
        <TouchableOpacity onPress={onPress}>
            <View>
                <View style={{ flexDirection: 'row', margin: 16 }}>
                    <View style={{ flex: 1, marginRight: 16 }}>
                        <Subtitle2 style={{ fontWeight: '700' }}>{item.title}</Subtitle2>
                        <Desc2 numberOfLines={3} style={{ marginTop: 10 }}>{item.description}</Desc2>
                        <Desc2 style={{ color: Colors.secondText, marginTop: 10 }}>{moment(item.created_at).format('DD MMMM yyyy')}</Desc2>
                    </View>
                    <Image
                        source={item.image ? { uri: item.image  } : require('../../../assets/images/img_empty.png')}
                        style={{ width: 82, height: 82, borderRadius: 12 }} />
                </View>
                <View style={{ height: 1, backgroundColor: Colors.divider }} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

})

export default ListNews