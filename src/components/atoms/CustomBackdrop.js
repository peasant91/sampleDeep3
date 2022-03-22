import React, {useMemo, useEffect} from 'react';
import { View, TouchableOpacity } from 'react-native';
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/core';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

const CustomBackdrop = ({animatedIndex, style}) => {
  const navigation = useNavigation();
  // animated variable
  useEffect(() => {
    console.log(animatedIndex);
  }, [animatedIndex.value]);
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value + 1,
      [0, 0.5],
      [0, 0.5],
      Extrapolate.CLAMP,
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: '#000000',
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle],
  );

  return (
      <Animated.View style={containerStyle} pointerEvents={animatedIndex.value != -1 ? 'auto' : 'none'}>

        <TouchableOpacity style={{width: '100%', height: '100%'}} onPress={() => console.log('auoooo')}></TouchableOpacity>
      </Animated.View>
  );
};

export default CustomBackdrop;
