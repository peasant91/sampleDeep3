import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements';
import { ActivityIndicator } from 'react-native';
import { Subtitle2, Subtitle1, Desc1, Desc2 } from '../CustomText';
import Colors from '../../../constants/Colors';
import translate from '../../../locales/translate';

const ListHomeNews = ({ item, onPress }) => {

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                <Image
                    style={styles.image}
                    source={ item.image? { uri: item.image } : require('../../../assets/images/img_empty.png')}
                    PlaceholderContent={<ActivityIndicator />}
                    resizeMode='contain'
                    
                />
                <Subtitle1 numOfLines={2} style={{ fontFamily: 'Lato-Bold', marginTop: 5 }}>{item.title}</Subtitle1>
                <Desc2
                    numberOfLines={3}
                    ellipsizeMode='tail'
                    style={{ marginTop: 5, lineHeight: 15 }}>{item.description}</Desc2>
                <Desc1 style={{ color: Colors.primary, marginTop: 5 }}>{translate('read_fully')}</Desc1>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 170,
        marginRight: 16,
        marginBottom: 16
    },
    image: {
        width: 170,
        height: 100,
        aspectRatio: 1.7,
        borderRadius: 10,
        resizeMode: 'cover'
    }
})

export default ListHomeNews