import React, {useState, useMemo, useCallback, useRef} from 'react';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';

const CustomSheet = React.forwardRef(({children, onChange, snapPoints}, ref) => {
  const {bottom: safeBottomArea} = useSafeAreaInsets();

  const initialSnapPoints = useMemo(() => ['1%','1%','CONTENT_HEIGHT','CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheet
      style={styles.contentContainerStyle}
      ref={ref}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints ?? animatedSnapPoints}
      handleHeight={snapPoints ? null : animatedHandleHeight}
      contentHeight={snapPoints ? null : animatedContentHeight}
      enablePanDownToClose={true}
      // keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      animateOnMount={false}
      onChange={onChange}
      animatedIndex={-1}
      index={-1}>
      <BottomSheetView
        onLayout={handleContentLayout}
        style={{paddingBottom: safeBottomArea + 16}}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  contentContainerStyle: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.33,
    shadowRadius: 10,
    elevation: 40,
    marginTop: 5,
    backgroundColor: 'white',
    overflow: 'visible',
  },
  startButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
    backgroundColor: Colors.primary,
    paddingVertical: 7,
    paddingHorizontal: 16,
  },
  shadowTopBottomSheet: {
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 20,
    padding: 16,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CustomSheet;
