import React, { useReducer } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import CustomButton from '../../../components/atoms/CustomButton'
import CustomInput, { PickerInput } from '../../../components/atoms/CustomInput'
import NavBar from '../../../components/atoms/NavBar'
import translate from '../../../locales/translate'
import formReducer from '../../../reducers/formReducer'


const BankScreen = ({navigation, route}) => {

    const [formState, dispatch] = useReducer(formReducer, {
        inputValues: {},
        inputValidities: {},
        formIsValid: false,
        isChecked: false
    })

    return <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <NavBar title={translate('bank_account')} navigation={navigation}/>
        <ScrollView style={{padding: 16}}>
            <PickerInput
                title={translate('bank_title')}
                placeholder={translate('bank_placeholder')}
            />

            <CustomInput
                containerStyle={{paddingVertical: 16}}
                title={translate('bank_no_title')}
                placeholder={translate('bank_no_placeholder')}
                dispatcher={dispatch}
            />

            <CustomInput
                title={translate('branch_title')}
                placeholder={translate('branch_placeholder')}
                dispatcher={dispatch}
            />

            <CustomInput
                containerStyle={{paddingVertical: 16}}
                title={translate('bank_owner_title')}
                placeholder={translate('bank_owner_placeholder')}
                dispatcher={dispatch}
            />

        </ScrollView>
        <CustomButton containerStyle={{padding: 16}} types={'primary'} title={translate('save')}/>
    </SafeAreaView>

}

export default BankScreen