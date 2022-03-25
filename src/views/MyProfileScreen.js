import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useReducer,
  useEffect,
} from 'react';

import { SafeAreaView, StyleSheet } from 'react-native'
import Colors from '../constants/Colors';


const MyProfileScreen = ({navigation, route}) => {



  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  subContainer: {
    backgroundColor: 'white',
    padding: 16,
  },
});

export default MyProfileScreen;
