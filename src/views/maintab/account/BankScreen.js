import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useReducer, useState, useEffect } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import { showDialog } from '../../../actions/commonActions'
import CustomButton from '../../../components/atoms/CustomButton'
import CustomInput, { PickerInput } from '../../../components/atoms/CustomInput'
import NavBar from '../../../components/atoms/NavBar'
import StorageKey from '../../../constants/StorageKey'
import translate from '../../../locales/translate'
import formReducer from '../../../reducers/formReducer'
import { updateBank } from '../../../services/user'


const BankScreen = ({ navigation, route }) => {

    const { isReadOnly, prevData } = route.params
    const [bankData, setbankData] = useState()

    const [formState, dispatch] = useReducer(formReducer, {
        inputValues: {
            ...prevData,
            bank_id_value: prevData?.bank_name
        },
        inputValidities: {},
        formIsValid: true,
        isChecked: false
    })

    const updateBankAPI = () => {
        dispatch({
            type: 'check'
        })

        if (formState.formIsValid) {
            updateBank(formState.inputValues)
                .then(response => {
                    showDialog(translate('update_bank_account_success'), false,() => navigation.navigate('Account',{isUpdate: true}, true))
                }).catch(err => {
                    showDialog(err.message)
                })
        }
    }

  const openPicker = (id, title, data) => {
    var selectedId = formState.inputValues.bank_id
    navigation.navigate('Picker', {
      pickerId: id,
      title: title,
      data: data,
      selectedId: selectedId,
      isEdit: !isReadOnly,
      previousRoute: 'Bank'
    });
  };

    useEffect(() => {
        AsyncStorage.getItem(StorageKey.KEY_BANK).then(data => {
            const bankData = JSON.parse(data)
            setbankData(bankData)
            // console.log('bank', bankData.filter(item => item.short_name == prevData?.bank_name))
            dispatch({
                type: 'input',
                id: 'bank_id',
                input: JSON.parse(data).filter(item => item.short_name == prevData?.bank_name)[0].id,
                isValid: true
            })
        }).catch(err => {
            showDialog(err.message)
        })
    }, [])

    useEffect(() => {
        const id = route.params?.pickerId
        if (route.params?.id) {
            dispatch({
          type: 'picker',
          id: id,
          input: route.params.id,
          desc: route.params.name,
          isValid: true,
            })
        }
    }, [route.params])
    

    return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

        <NavBar title={translate('bank_account')} navigation={navigation} />

        <ScrollView style={{ padding: 16 }}>

            <PickerInput
                id={'bank_id'}
                title={translate('bank_title')}
                placeholder={translate('bank_placeholder')}
                viewOnly={isReadOnly}
                value={formState.inputValues.bank_id_value}
                isCheck={formState.isChecked}
                onPress={() => openPicker('bank_id', 'bank_account', bankData)}
                required
            />

            <CustomInput
                id={'number'}
                containerStyle={{ paddingVertical: 16 }}
                title={translate('bank_no_title')}
                placeholder={translate('bank_no_placeholder')}
                dispatcher={dispatch}
                viewOnly={isReadOnly}
                value={formState.inputValues.number}
                isCheck={formState.isChecked}
                keyboardType={'number-pad'}
                required
            />

            <CustomInput
                id={'branch'}
                title={translate('branch_title')}
                placeholder={translate('branch_placeholder')}
                dispatcher={dispatch}
                viewOnly={isReadOnly}
                value={formState.inputValues.branch}
                isCheck={formState.isChecked}
                required
            />

            <CustomInput
                id={'name'}
                containerStyle={{ paddingVertical: 16 }}
                title={translate('bank_owner_title')}
                placeholder={translate('bank_owner_placeholder')}
                viewOnly={isReadOnly}
                dispatcher={dispatch}
                value={formState.inputValues.name}
                isCheck={formState.isChecked}
                required
            />

        </ScrollView>

        {
            !isReadOnly && <CustomButton containerStyle={{ padding: 16 }} types={'primary'} title={translate('save')} onPress={updateBankAPI} />
        }

    </SafeAreaView>

}

export default BankScreen