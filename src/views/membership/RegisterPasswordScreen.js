import React, {useReducer, useState, useEffect} from 'react'
import { Platform, SafeAreaView, ScrollView,View } from 'react-native'
import Animated from 'react-native-reanimated';
import { showDialog } from '../../actions/commonActions';
import CustomCheckbox from '../../components/atoms/Checkbox';
import CustomButton from '../../components/atoms/CustomButton';
import CustomInput, {PasswordInput, PhoneInput} from '../../components/atoms/CustomInput';
import {LatoBold, LatoRegular} from '../../components/atoms/CustomText';
import NavBar from '../../components/atoms/NavBar';
import Colors from '../../constants/Colors';
import translate from '../../locales/translate';
import formReducer from '../../reducers/formReducer';
import { validateRegister } from '../../services/auth';


const RegisterPasswordScreen = ({navigation, route}) => {

    const [formState, dispatch] = useReducer(formReducer, {
        inputValues: route.params.data,
        inputValidities: {

        },
        formIsValid: false,
        isCheck: false
    })

    const [formStateDetail, dispatchDetail] = useReducer(formReducer, {
        inputValues: route.params.data.detail,
        inputValidities: {

        },
        formIsValid: false,
    })

    const [isChecked, setisChecked] = useState(false)

    useEffect(() => {
        dispatch({
            type: 'input',
            input: formStateDetail.inputValues,
            id: 'detail',
            isValid: true
        })
      
    
    }, [formStateDetail])

    const goToOtp = () => {
        dispatch({
            type: 'check'
        })

        if (formState.formIsValid && isChecked) {
          validate()
        }
    }

    const validate = () => {
      validateRegister(formState.inputValues).then(response => {
            navigation.navigate('OtpScreen', {isRegister: true, data: formState.inputValues})
      }
      ).catch(error => {
        showDialog(error.message)
      })
    }
    

    return <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <NavBar navigation={navigation} title={translate('password_title')} />
          <Animated.View
            style={{
              height: 2,
              backgroundColor: Colors.primary,
              width: '50%',
            }}
          />
          <ScrollView style={{padding: 16}}>
            <View>
              <PasswordInput
                id={'password'}
                title={translate('password_title')}
                placeholder={translate('password_placeholder')}
                error={''}
                value={formState.inputValues.password}
                containerStyle={{marginTop: 20}}
                isCheck={formState.isChecked}
                dispatcher={dispatch}
                keyboardType={'default'}
                required
              />
              <PasswordInput
                id={'password_confirmation'}
                title={translate('confirm_password_title')}
                placeholder={translate('password_placeholder')}
                error={''}
                match={formState.inputValues.password}
                value={formState.inputValues.password_confirmation}
                containerStyle={{marginTop: 20}}
                isCheck={formState.isChecked}
                dispatcher={dispatch}
                keyboardType={'default'}
                required
              />

              <CustomCheckbox isChecked={isChecked} title={<LatoRegular style={{paddingLeft: 16}}>{translate('i_have_read')} <LatoBold style={{paddingLeft: Platform.OS === 'ios' ? 16 : 0}}>{translate('term_and_condition')}</LatoBold></LatoRegular>} onPress={() => setisChecked(!isChecked)}/>
            </View>
          </ScrollView>
          <CustomButton  types='primary' containerStyle={{padding: 16}} title={translate('register')} onPress={goToOtp}/>
        </SafeAreaView>
      ;
}

export default RegisterPasswordScreen