import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Colors from '../../../constants/Colors';
import { Subtitle2 } from '../CustomText';
import IconCheckmark from '../../../assets/images/ic_checkmark_blue';

const ListAnswers = ({ item, onPress, questionId, isSelected, index }) => {

    const alphabhet = ['a. ', 'b. ', 'c. ', 'd. ', 'e. ']

    return (

        <View style={isSelected ? styles.containerSelected : styles.container}>
            <TouchableOpacity onPress={() => onPress(questionId, item.id)}>
                <View style={styles.innerContainer}>
                    <Subtitle2 style={{ padding: 10 }}>{`${alphabhet[index]}${item.answer}`}</Subtitle2>
                    {isSelected ? <IconCheckmark /> : <View />}
                </View>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.divider,
    },
    containerSelected: {
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#D7E3FF',
        borderColor: Colors.primary,
    },
    innerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 16
    }
})

export default ListAnswers