import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useReducer,
  useEffect,
} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import NavBar from '../components/atoms/NavBar';
import translate from '../locales/translate';
import CustomText, {
  Headline1,
  Subtitle2,
  Subtitle1,
} from '../components/atoms/CustomText';
import CustomInput, {
  PickerInput,
  PhoneInput,
} from '../components/atoms/CustomInput';
import CustomButton from '../components/atoms/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import LockIcon from '../assets/images/ic_lock.svg';
import ChevronRightIcon from '../assets/images/ic_chevron_right.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import StorageKey from '../constants/StorageKey';
import formReducer from '../reducers/formReducer';
import {updateProfile} from '../services/user';
import {showDialog} from '../actions/commonActions';
import {useToast} from 'react-native-toast-notifications';
import ListDivision from '../components/atoms/list/ListDivision';
import CustomBackdrop from '../components/atoms/CustomBackdrop';
import {FlatList} from 'react-native';

const MyProfileScreen = ({navigation, route}) => {
  const [division, setDivision] = useState([]);
  const [contentHeight, setContentHeight] = useState(0);
  const [tempDivision, setTempDivision] = useState({});
  const snapPoints = useMemo(() => [0, contentHeight], [contentHeight]);
  const bottomSheetModalRef = useRef(null);
  const {bottom: safeBottomArea} = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const profile = route.params.profile;
  const toast = useToast();
  var mounted = false;

  const [formState, dispatch] = useReducer(formReducer, {
    inputValues: {
      name: profile.name,
      email: profile.email,
      employee_id: profile.employee_id,
      phone: profile.phone,
      phone_code: profile.phone_code,
      division_id: profile.division_id,
      division_name: profile.divisionName
    },
    inputValidities: {
      name: true,
      email: true,
      employee_id: true,
      phone: true,
      phone_code: true,
      division_id: true,
    },
    isChecked: true,
    formIsValid: true,
  });

  const goToChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleOnLayout = useCallback(
    ({
      nativeEvent: {
        layout: {height},
      },
    }) => {
      setContentHeight(height);
    },
    [],
  );

  const doUpdateProfile = () => {
    if (formState.formIsValid) {
      Keyboard.dismiss();
      setIsLoading(true);
      updateProfile(formState.inputValues)
        .then(response => {
          setIsLoading(false);
          showSuccess();
        })
        .catch(err => {
          setIsLoading(false);
          showDialog(err.message, false);
        });
    }
  };

  const showSuccess = () => {
    toast.show(translate('update_profile_success'), {
      type: 'custom',
      placement: 'bottom',
      duration: 1000,
      offset: 30,
      animationType: 'slide-in',
    });
    navigation.pop();
  };

  const openDivision = () => {
    bottomSheetModalRef.current.expand();
  };

  const closeDivision = () => {
    bottomSheetModalRef.current.close();
  };

  const getDivision = async id => {
    console.log(id);
    const divisionJSON = await AsyncStorage.getItem(StorageKey.KEY_DIVISION);
      const division = JSON.parse(divisionJSON);
      const selectedDivision = division.find(item => item.id == id);

    if (mounted) {
      setDivision(division);
      console.log(divisionJSON);

      if (selectedDivision) {
        setTempDivision(selectedDivision);

        dispatch({
          id: 'division_name',
          type: 'input',
          input: selectedDivision.name,
          isValid: true,
        });
      }
    }
  };

  const onSaveDivision = () => {
    closeDivision();

    dispatch({
      type: 'input',
      id: 'division_id',
      input: tempDivision.id,
      isValid: true,
    });
    dispatch({
      type: 'input',
      id: 'division_name',
      input: tempDivision.name,
      isValid: true,
    });
  };

  useEffect(() => {
    mounted = true;
    // getDivision(profile != undefined ? profile.division_id : 0);
    return () => {
      mounted = false;
    };
  }, [navigation, route]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <NavBar
        title={translate('my_profile')}
        navigation={navigation}
        style={{padding: 10}}
      />
      <ScrollView style={styles.container}>
        <View>
          <View style={styles.subContainer}>
            <Subtitle1>
              {translate('general_information')}
              <Subtitle1 style={{color: 'red'}}>*</Subtitle1>
            </Subtitle1>
            <CustomInput
              id="name"
              value={formState.inputValues.name}
              containerStyle={{marginTop: 16}}
              title={translate('fullname_title')}
              placeholder={translate('fullname_placeholder')}
              isCheck={formState.isChecked}
              dispatcher={dispatch}
              viewOnly
            />
            <CustomInput
              id="employee_id"
              value={formState.inputValues.employee_id}
              title={translate('employee_id_title')}
              placeholder={translate('employee_id_placeholder')}
              containerStyle={{marginTop: 16}}
              isCheck={formState.isChecked}
              dispatcher={dispatch}
              viewOnly
            />
            <CustomInput
              id="email"
              value={formState.inputValues.email}
              title={translate('email_title')}
              placeholder={translate('email_placeholder')}
              containerStyle={{marginTop: 16}}
              isCheck={formState.isChecked}
              dispatcher={dispatch}
              viewOnly
            />
            <PhoneInput
              id="phone"
              value={formState.inputValues.phone}
              title={translate('phone_title')}
              placeholder={translate('phone_placeholder')}
              containerStyle={{marginTop: 16}}
              isCheck={formState.isChecked}
              dispatcher={dispatch}
              viewOnly
            />
            <PickerInput
              id="employee_id"
              value={formState.inputValues.division_name}
              title={translate('division_title')}
              placeholder={translate('division_placeholder')}
              containerStyle={{marginTop: 16}}
              // onPress={openDivision}
              viewOnly
            />
          </View>
          <TouchableOpacity
            style={{marginTop: 10}}
            onPress={goToChangePassword}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                padding: 16,
              }}>
              <LockIcon />
              <Subtitle1 style={{flex: 1, marginHorizontal: 10}}>
                {translate('change_password')}
              </Subtitle1>
              <ChevronRightIcon />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* <CustomButton
        isLoading={isLoading}
        containerStyle={{ margin: 16 }}
        types="primary"
        title={translate('edit_profile')}
        onPress={doUpdateProfile}
      /> */}

      <BottomSheet
        style={styles.contentContainerStyle}
        ref={bottomSheetModalRef}
        snapPoints={['1%', '80%']}
        enablePanDownToClose={true}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop
            {...backdropProps}
            closeOnPress={true}
            disappearsOnIndex={0}
          />
        )}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        index={-1}>
        <Subtitle1 style={{paddingHorizontal: 16}}>
          {translate('pick_division')}
        </Subtitle1>
        <BottomSheetFlatList
          data={division}
          keyExtractor={item => item.id}
          renderItem={({index, item}) => (
            <ListDivision
              selectedId={tempDivision.id}
              item={item}
              onPress={() => setTempDivision(item)}
            />
          )}
        />
        <CustomButton
          containerStyle={{padding: 16}}
          types="primary"
          title={translate('save')}
          onPress={onSaveDivision}
        />
      </BottomSheet>
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
