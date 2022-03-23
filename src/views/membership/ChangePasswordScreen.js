import React, { useReducer, useState } from 'react'
import { SafeAreaView, StyleSheet, ScrollView, View, Keyboard } from 'react-native';
import Colors from '../../constants/Colors';
import NavBar from '../../components/atoms/NavBar';
import translate from '../../locales/translate';
import CustomButton from '../../components/atoms/CustomButton';
import { Subtitle1 } from '../../components/atoms/CustomText';
import { PasswordInput } from '../../components/atoms/CustomInput';
import formReducer from '../../reducers/formReducer';
import { changePassword } from '../../services/user';
import { useToast } from 'react-native-toast-notifications';
import { showDialog } from '../../actions/commonActions';

const ChangePasswordScreen = ({ navigation, route }) => {

    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [formState, dispatch] = useReducer(formReducer, {
        inputValues: {
            old_password: '',
            new_password: '',
            repassword: ''
        },
        inputValidities: {
            old_password: false,
            new_password: false,
            repassword: false
        },
        formIsValid: false,
        isChecked: false
    })

    const doChangePassword = () => {
        Keyboard.dismiss()
        dispatch({
            type: 'check'
        })

        if (formState.formIsValid) {
            setIsLoading(true)
            changePassword(formState.inputValues)
            .then(response => {
                setIsLoading(false)
                showSuccessToast()
            })
            .catch(err => {
                setIsLoading(false)
                showDialog(err.message, false)
            })
        }
    }

    const showSuccessToast = () => {
        toast.show(translate('change_password_success'), {
            animationType: 'slide-in',
            duration: 1000,
            type: 'custom',
            placement: 'bottom'
        })
        navigation.pop()
    }

    return (
        <SafeAreaView style={styles.container}>
            <NavBar title={translate('change_password')} navigation={navigation} style={{padding: 10}}/>
            <ScrollView style={styles.scrollView}>
                <View style={{ backgroundColor: 'white', padding: 16 }}>
                    <Subtitle1>{translate('password_setting')}<Subtitle1 style={{ color: 'red' }}>*</Subtitle1></Subtitle1>
                    <PasswordInput
                        id='old_password'
                        title={translate('old_password_title')}
                        placeholder={translate('password_placeholder')}
                        containerStyle={{ marginVertical: 16 }}
                        isCheck={formState.isChecked}
                        value={formState.inputValues.old_password}
                        dispatcher={dispatch}
                    />
                    <PasswordInput
                        id='new_password'
                        value={formState.inputValues.new_password}
                        title={translate('new_password_title')}
                        placeholder={translate('password_placeholder')}
                        containerStyle={{ marginVertical: 16 }}
                        isCheck={formState.isChecked}
                        dispatcher={dispatch}
                    />
                    <PasswordInput
                        id='repassword'
                        value={formState.inputValues.repassword}
                        title={translate('re_password_title')}
                        placeholder={translate('password_placeholder')}
                        containerStyle={{ marginVertical: 16 }}
                        isCheck={formState.isChecked}
                        match={formState.inputValues.new_password}
                        dispatcher={dispatch}
                    />
                </View>

            </ScrollView>
            <CustomButton
                containerStyle={{ margin: 16 }}
                types='primary'
                title={translate('change_password')}
                onPress={doChangePassword}
                isLoading={isLoading}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    scrollView: {
        backgroundColor: Colors.backgroundColor,
        flex: 1
    }
})
export default ChangePasswordScreen