import React from 'react'
import { StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { Button } from 'react-native-elements'
import Colors from '../../constants/Colors'

const GenderButton = ({isSelected, title, onPress}) => {

    return <View style={[{width: 120, paddingRight: 16, height: 40}]} >
      <TouchableOpacity>
        <View >
          <Button
            title={title}
            onPress={onPress}
            pointer
            TouchableComponent={TouchableWithoutFeedback}
            titleStyle={{color: Colors.primary}}
            buttonStyle={[
              isSelected ? styles.selected : styles.unselected,
              {borderRadius: 50, borderColor: Colors.primary, borderWidth: 1}
            ]}
          />
        </View>
      </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    selected: {
        backgroundColor: Colors.lightPrimary
    },
    unselected: {
        backgroundColor: 'white'
    }
})

export default GenderButton