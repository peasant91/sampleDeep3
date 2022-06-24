import React,{useEffect, useState} from 'react'
import { View, FlatList, StyleSheet,Text } from 'react-native'
import LottieView from 'lottie-react-native';
import Colors from '../../constants/Colors';
import { dismissDialog } from '../../actions/commonActions';

const CustomUploadAlertComponent = (props) => {

    const piece = () => {
        let cutPiece = 100 / props.totalData //per piece percent
        return `${cutPiece * props.currentState}%`
    }

    return (
        <View {...props} style={styles.mainContainer}>
            <Text
                style={{
                    fontFamily: 'Lato-Bold',
                    marginTop: 10,
                    fontSize: 18,
                    alignSelf: 'center',
                    textAlign: 'center',
                    minWidth: '80%',
                    color: Colors.primary,
                    marginBottom:16
                }}>
                {props.dialogTitle+" ..."}
            </Text>
            <View style={{ justifyContent: 'center', width: '100%' }}>
                <View
                    style={{
                        width: '100%',
                        height: 20,
                        borderRadius: 5,
                        borderColor: Colors.primary,
                        borderWidth: 1,
                    }}
                />
                <View
                    style={{
                        width: piece(),
                        height: 20,
                        borderTopLeftRadius: 5,
                        borderBottomLeftRadius: 5,
                        backgroundColor: Colors.primary,
                        position: 'absolute'
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 16,
        marginVertical: 20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        minWidth: '80%',
        maxWidth: '80%',
        marginHorizontal: 16,
        backgroundColor: 'white',
        borderRadius: 5,
    },
})

export default CustomUploadAlertComponent;