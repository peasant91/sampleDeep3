import React, {useReducer, useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native';
import NavBar from '../components/atoms/NavBar';
import translate from '../locales/translate';
import {MainTitle, Subtitle1} from '../components/atoms/CustomText';
import CustomInput, {PickerInput} from '../components/atoms/CustomInput';
import CustomButton from '../components/atoms/CustomButton';
import DateIcon from '../assets/images/ic_date.svg';
import DateTimePicker from 'react-native-modal-datetime-picker';
import formReducer from '../reducers/formReducer';
import moment from 'moment';
import {sendSchedule} from '../services/forms';
import {showDialog} from '../actions/commonActions';
import {Modal, ModalContent} from 'react-native-modals';
import {getCurrentWeek} from '../actions/helper';
import {getCalendarWeek} from '../data/dummy';
import Colors from '../constants/Colors';
import {dummyCalendar} from '../data/dummy';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import ListDate from '../components/atoms/list/ListDate';
import {getMeetingDate} from '../services/utilities';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { Platform } from 'react-native';

const ScheduleFormScreen = ({navigation, route}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dates, setDates] = useState([]);
  const sheetRef = useRef(null);
  const {bottom: safeBottomArea} = useSafeAreaInsets();
  const snapPoints = useMemo(() => ['1%','60%'], []);  

  const [formState, dispatch] = useReducer(formReducer, {
    inputValues: {
      project_number: route.params.data.project_number,
      project_name: route.params.data.project_name,
      presentation_date: route.params.data.presentation_date ?? '',
    },
    inputValidities: {
      project_number: route.params.data.project_number ? true : false,
      project_name: route.params.data.project_name ? true : false,
      presentation_date: route.params.data.presentation_date ? true : false,
    },
    isChecked: false,
    formIsValid: route.params.data.presentation_date ? true : false,
  });

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
      />
    ),
    []
  );

  const showDatePicker = () => {
    // setDatePickerVisibility(true);
    // setCalendarShow(true)
      sheetRef.current.expand();
  };

  const hideDatePicker = () => {
    // setDatePickerVisibility(false);
    // setCalendarShow(false)
    sheetRef.current.close();
  };
  
  const hideSchedulePicker = () => {
    sheetRef.current.close();
  };

  const handleConfirm = date => {
    hideDatePicker();

    console.log(date);

    setTimeout(() => {
      dispatch({
        type: 'input',
        id: 'presentation_date',
        input: `${date.date}`,
        isValid: true,
      });
    }, 500);
  };

  const sendForm = () => {
    console.log(formState.formIsValid, formState.inputValidities, formState.isChecked)
    dispatch({
      type: 'check',
    });

    if (formState.formIsValid) {
      setIsLoading(true);
      sendSchedule(formState.inputValues)
        .then(response => {
          setIsLoading(false);
          goToSuccess();
        })
        .catch(err => {
          setIsLoading(false);
          showDialog(err.message, false);
        });
    }
  };

  const goToSuccess = () => {
    navigation.replace('Success', {
      title: translate('presentation_success_title'),
      desc: translate('presentation_success_desc'),
      image: require('../assets/images/img_success_schedule.png'),
      buttonTitle: translate('back_to_home'),
      onPress: () => {
        navigation.pop();
      },
    });
  };

  const onChangeText = (id, text, isValid) => {};

  const getMeetingDates = () => {
    getMeetingDate()
      .then(response => setDates(response))
      .catch(err => {
        showDialog(err.message, true, getMeetingDates, dismissDialog);
      });
  };

  useEffect(() => {
    getMeetingDates();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <NavBar
        title={translate('presentation_schedule')}
        navigation={navigation}
        style={{padding: 10}}
      />
      <KeyboardAvoidingView 
        style={{flex: 1}} 
        behavior="padding" 
        enabled={Platform.OS == 'ios' ? true : false}>
        <ScrollView style={styles.container}>
          <View>
            <Subtitle1>
              {translate('pb_saving_extended_title')}
              <Subtitle1 style={{color: 'red'}}>*</Subtitle1>
            </Subtitle1>
            <CustomInput
              id="project_number"
              value={formState.inputValues.project_number}
              isCheck={formState.isChecked}
              dispatcher={dispatch}
              containerStyle={{marginTop: 16}}
              title={translate('project_number_title')}
              placeholder={translate('project_number_placeholder')}
              onChangeText={onChangeText}
              viewOnly
              
            />
            <CustomInput
              id="project_name"
              value={formState.inputValues.project_name}
              isCheck={formState.isChecked}
              dispatcher={dispatch}
              containerStyle={{marginTop: 16}}
              title={translate('project_name_title')}
              placeholder={translate('project_name_placeholder')}
              onChangeText={onChangeText}
              viewOnly
            />
            <PickerInput
              id="presentation_date"
              value={
                formState.inputValues.presentation_date != ''
                  ? moment(formState.inputValues.presentation_date).format(
                      'DD MMMM yyyy',
                    )
                  : ''
              }
              containerStyle={{marginTop: 16}}
              isCheck={formState.isChecked}
              title={translate('presentation_date_title')}
              placeholder={translate('presentation_date_placeholder')}
              Icon={DateIcon}
              onPress={showDatePicker}
            />
          </View>
        </ScrollView>
        <CustomButton
          containerStyle={{margin: 16}}
          types="primary"
          title={translate('send')}
          onPress={sendForm}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>
      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />
      <BottomSheet
        style={styles.sheetContainerStyle}
        ref={sheetRef}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        snapPoints={snapPoints}
        animateOnMount={false}
        animatedIndex={-1}
        index={-1}
        >
        <MainTitle style={{margin: 16}}>
          {translate('presentation_date')}
        </MainTitle>
        <BottomSheetFlatList
          data={dates}
          keyExtractor={item => item.id}
          renderItem={({index, item}) => (
            <ListDate
              data={item}
              onPress={() => {
                handleConfirm(item);
              }}
            />
          )}
        />
        <CustomButton
          title={translate('cancel')}
          onPress={hideSchedulePicker}
          containerStyle={{margin: 16, paddingBottom: safeBottomArea}}
          types="primary"
        />
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  selectedWeek: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  sheetContainerStyle: {
    marginBottom: 16,
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
});

export default ScheduleFormScreen;
