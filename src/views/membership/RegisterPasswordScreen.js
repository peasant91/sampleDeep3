import React, {useReducer, useState, useEffect} from 'react'
import { SafeAreaView, ScrollView,View } from 'react-native'
import Animated from 'react-native-reanimated';
import CustomCheckbox from '../../components/atoms/Checkbox';
import CustomButton from '../../components/atoms/CustomButton';
import CustomInput, {PasswordInput, PhoneInput} from '../../components/atoms/CustomInput';
import {LatoBold, LatoRegular} from '../../components/atoms/CustomText';
import NavBar from '../../components/atoms/NavBar';
import Colors from '../../constants/Colors';
import translate from '../../locales/translate';
import formReducer from '../../reducers/formReducer';


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

        if (!formState.formIsValid) {
            navigation.navigate('OtpScreen', {isRegister: true, data: formState.inputValues})
        }
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
              <LatoRegular>{translate('register_password_page_title')}</LatoRegular>
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
                id={'repassword'}
                title={translate('repassword_title')}
                placeholder={translate('password_placeholder')}
                error={''}
                match={formState.inputValues.password}
                value={formState.inputValues.repassword}
                containerStyle={{marginTop: 20}}
                isCheck={formState.isChecked}
                dispatcher={dispatch}
                keyboardType={'default'}
                required
              />
              <CustomInput  
                id={'referral_code'}
                title={translate('referral_code_title')}
                placeholder={translate('referral_code_placeholder')}
                error={''}
                value={formStateDetail.inputValues.referral_code}
                containerStyle={{marginTop: 20}}
                isCheck={formState.isChecked}
                dispatcher={dispatchDetail}
                keyboardType={'default'}
              />

              <CustomCheckbox isChecked={isChecked} title={<LatoRegular style={{paddingLeft: 16}}>{translate('i_have_read')} <LatoBold style={{paddingLeft: 16}}>{translate('term_and_condition')}</LatoBold></LatoRegular>} onPress={() => setisChecked(!isChecked)}/>
            </View>
          </ScrollView>
          <CustomButton  types='primary' containerStyle={{padding: 16}} title={translate('register')} onPress={goToOtp}/>
        </SafeAreaView>
      ;
}

export default RegisterPasswordScreen