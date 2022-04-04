import React, { useReducer } from 'react'
import { SafeAreaView, View } from 'react-native'
import CustomButton from '../../components/atoms/CustomButton'
import CustomInput from '../../components/atoms/CustomInput'
import NavBar from '../../components/atoms/NavBar'
import translate from '../../locales/translate'
import formReducer from '../../reducers/formReducer'


const ResetPasswordScreen = ({navigation, route}) => {

    const [formState, dispatch] = useReducer(formReducer, {
        inputValues: {},
        inputValidities: {},
        formIsValid: false,
        isChecked: false
    })

    const doResetPassword = () => {

    }

    return <SafeAreaView>
        <NavBar title={translate('reset_password')}/>
        <View>
            <CustomInput
            title={translate('new_password_title')}
            password={translate('password_placeholder')}
            dispatcher={dispatch}
            />
            <CustomInput
            title={translate('confirm_password_title')}
            password={translate('password_placeholder')}
            dispatcher={dispatch}
            />
        </View>
        <CustomButton types={'primary'} title={translate('reset_password')}/>
    </SafeAreaView>

}

export default ResetPasswordScreen