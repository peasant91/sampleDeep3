import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Subtitle1, Desc1 } from '../CustomText';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const ListMenu = ({item}) => {
    return (
        <TouchableWithoutFeedback 
            onPress={item.onPress}>
            <View style={styles.container}>
                <item.Image />
                <View style={{ padding: 16 }}>
                    <Subtitle1 style={{fontFamily: 'Lato-Bold'}}>{item.title}</Subtitle1>
                    <Desc1 style={{ marginTop: 5, flexWrap: 'wrap', flex: 1 }}>{item.desc}</Desc1>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}


const styles = StyleSheet.create({
    container: {
        margin:1,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderColor: 'white',
        shadowOffset: {
            width: 1,
            height: 2
        },
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        backgroundColor: 'white'
    }
})

export default ListMenu