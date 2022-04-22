import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {ListItem, Image} from 'react-native-elements';
import {Touchable} from 'react-native';
import {TouchableOpacity} from 'react-native';
import CustomButton from '../atoms/CustomButton';
import translate from '../../locales/translate';
import Colors from '../../constants/Colors';

const GenericCustomAlertComponents = props => {
  const data = props.listData;
  return (
    <View {...props} style={styles.mainContainer}>
      <Text
        style={{
          fontFamily: 'Lato-Bold',
          marginTop: 10,
          fontSize: 18,
          marginBottom: 16,
          alignSelf: 'center',
          textAlign: 'center',
          minWidth: '80%',
          color: Colors.primary
        }}>
        {props.dialogTitle}
      </Text>
      {props.isDoubleButton ? (
        <View
          style={{
            flexDirection: 'row',
            display: 'flex',
            marginTop: 10,
            marginBottom: 10,
          }}>
          <View style={{flex: 1}}>
            <CustomButton
              types="secondary"
              onPress={props.onNegativePress}
              style={{height: 40, marginHorizontal: 2}}
              title={
                props.negativeTitle ? props.negativeTitle : translate('cancel')
              }
            />
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <CustomButton
              types="primary"
              onPress={props.onPositivePress}
              style={{height: 40, marginHorizontal: 2}}
              title={
                props.positiveTitle ? props.positiveTitle : translate('retry')
              }
            />
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            display: 'flex',
            marginTop: 10,
            marginBottom: 10,
          }}>
          <View style={{flex: 1}}>
            <CustomButton
              types="primary"
              onPress={props.onPositivePress}
              title={
                props.positiveTitle ? props.positiveTitle : translate('ok')
              }
            />
          </View>
        </View>
      )}
    </View>
  );
};

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
});

export default GenericCustomAlertComponents;
