import React, {useEffect, useReducer, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';

import IconSearch from '../assets/images/ic_search_offer.svg';
import translate from '../locales/translate';
import ListCompany from '../components/atoms/list/ListCompany';

import IconBack from '../assets/images/ic_arrow_back.svg';

import {Icon, Input} from 'react-native-elements';
import {LatoBold, LatoRegular} from '../components/atoms/CustomText';
import Colors from '../constants/Colors';
import {Shadow} from 'react-native-shadow-2';
import EmptySearch from '../components/atoms/EmptySearch';
import CustomButton from "../components/atoms/CustomButton";
import Divider from "../components/atoms/Divider";
import CustomInput from "../components/atoms/CustomInput";
import formReducer from "../reducers/formReducer";

const PickerCompanyScreen = ({navigation, route}) => {

    const {
        pickerId,
        data,
        selectedId,
        isEdit,
        dispatch,
        isRegister,
        driver_company_request,
        onSubmit,
        onSelectedList
    } = route.params;

    const [filteredData, setfilteredData] = useState(data ? data : [])

    const [formState, dispatchForm] = useReducer(formReducer, {
        inputValues: {
            company: driver_company_request,
            isNewCompany: !!driver_company_request,
            selectedId: selectedId
        },
        inputValidities: {
            // company: formState?.inputValues?.selectedId ? true : !!formState?.inputValues?.company?.length,
            selectedId: true,
        },
        formIsValid: false,
        isChecked: isEdit,
    });
    const manualInputId = -99

    const onPressList = (id, name) => {
        console.log(isEdit)
        onSelectedList({
            id,
            name
        })
        navigation?.goBack()
        
        // navigation.navigate(route.params.previousRoute, {
        //     pickerId: pickerId,
        //     id: id,
        //     name: name,
        //     isEdit: isEdit,
        //     dispatch: dispatch,
        //     isRegister: isRegister
        // }, true)
    }

    const handleSubmit = () => {
        if (formState?.inputValues?.isNewCompany) {
            onSubmit({
                new_company: formState?.inputValues?.company,
            })
            navigation?.goBack()
        } else {
            navigation?.goBack()
        }
    }

    const onPressReset = () => {
        // navigation.navigate(route.params.previousRoute, {
        //     pickerId: pickerId,
        //     id: undefined,
        //     name: undefined,
        //     isEdit: isEdit,
        //     dispatch: dispatch,
        //     isRegister: isRegister
        // }, true)
    }


    const onChangeText = (text) => {
        console.log(data)
        if (text) {

        }
        setfilteredData(data.filter(item => item.name.toLowerCase().includes(text.toLowerCase()) || item.address?.toLowerCase().includes(text.toLowerCase())))
    }

    useEffect(() => {
        if (selectedId) {
            dispatchForm({
                type: "input",
                id: "selectedId",
                input: selectedId,
                isValid: !!selectedId
            })
        }
    }, [selectedId]);


    console.log(formState)


    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: Colors.white
        }}>

            <Shadow viewStyle={{width: '100%'}} offset={[0, 5]} distance={5} startColor={Colors.divider}>
                <View style={style.header}>
                    <TouchableOpacity onPress={() => navigation.pop()}>
                        <IconBack onPress={() => navigation.pop()}/>
                    </TouchableOpacity>
                    <Input
                        onChangeText={onChangeText}
                        rightIcon={IconSearch}
                        rightIconContainerStyle={{marginVertical: 0}}
                        placeholder={translate('find_picker', {title: "Perusahaan"})}
                        style={{flex: 1}}
                        containerStyle={{flex: 1, marginBottom: -15}}/>
                </View>
            </Shadow>

            <View style={{
                flex: 1,
                backgroundColor: Colors.white
            }}>
                <View style={{
                    padding: 16,
                    marginTop: 8,
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            dispatchForm({
                                type: "update",
                                state: {
                                    ...formState,
                                    inputValues: {
                                        ...formState?.inputValues,
                                        isNewCompany: !formState?.inputValues?.isNewCompany,
                                        selectedId: undefined,
                                    },
                                }
                            })
                        }}
                        style={{
                            borderWidth: 1,
                            borderColor: Colors.lightestPrimary,
                            borderRadius: 8,
                            padding: 16,
                            flexDirection: "row",
                            backgroundColor: formState?.inputValues?.isNewCompany ? Colors.lightestPrimary : Colors.white
                        }}>
                        <View>
                            <Icon name={"help-circle-outline"} type={"ionicon"} color={Colors.primary}/>
                        </View>
                        <View style={{
                            flex: 1,
                            marginLeft: 8
                        }}>
                            <LatoBold>Tidak menemukan perusahaan anda?</LatoBold>
                            <LatoRegular style={{
                                marginTop: 4
                            }}>Tulis manual dengan memilih opsi ini</LatoRegular>
                        </View>
                        {
                            formState?.inputValues?.isNewCompany
                                ?
                                <View>
                                    <Icon name={"check"} color={Colors.primary}/>
                                </View>
                                : <></>
                        }

                    </TouchableOpacity>

                    {
                        formState?.inputValues?.isNewCompany
                            ? <>
                                <CustomInput
                                    containerStyle={{marginTop: 8, height: 56}}
                                    id={'company'}
                                    title={"Perusahaan"}
                                    placeholder={"Tulis nama perusahaan disini"}
                                    value={formState?.inputValues?.company}
                                    dispatcher={dispatchForm}
                                    isCheck={formState?.isChecked}
                                    required
                                    viewOnly={false}
                                />
                            </>
                            : <></>

                    }

                </View>
                <Divider/>
                {filteredData.length <= 0 ? <EmptySearch title={"Perusahaan"}/> :
                    <FlatList
                        contentContainerStyle={{paddingTop: 16}}
                        style={{flex: 0, flexShrink: 1}}
                        data={[...filteredData]}
                        keyExtractor={item => item.id}
                        renderItem={({item, index}) => {
                            return <ListCompany data={item} onPress={onPressList}
                                                selectedId={formState?.inputValues?.selectedId}/>
                        }}
                    />}

            </View>
            {
                <CustomButton
                    disabled={!formState.formIsValid}
                    types="primary"
                    title='Simpan'
                    containerStyle={{margin: 16}}
                    onPress={handleSubmit}
                    // onPress={onPressReset}
                />
            }

        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        paddingHorizontal: 10,
        shadowColor: '#000',
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 2.22,

        elevation: 3,
        zIndex: 1
    },
});

export default PickerCompanyScreen;
