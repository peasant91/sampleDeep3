import React, {
    useState,
    useMemo,
    useRef,
    useCallback,
    useReducer,
    useEffect,
} from 'react';
import {
    View,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    TouchableOpacity,
} from 'react-native';
import CustomText, {
    LatoBold,
    LatoRegular,
} from '../../components/atoms/CustomText';
import translate from '../../locales/translate';
import CustomButton from '../../components/atoms/CustomButton';
import CustomInput, {
    PhoneInput,
    PickerInput,
    PasswordInput,
} from '../../components/atoms/CustomInput';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import formReducer from '../../reducers/formReducer.js';
import {
    showDialog,
    dismissDialog, useCommonAction,
} from '../../actions/commonActions';
import {register, updateProfile, validateRegister} from '../../services/auth';
import NavBar from '../../components/atoms/NavBar';
import {Image} from 'react-native-elements';
import DatePicker from 'react-native-date-picker';
import CustomSheet from '../../components/atoms/CustomSheet';

import IconProfilePlaceholder from '../../assets/images/ic_profile_placeholder.svg';
import IconProfileAddImage from '../../assets/images/ic_profile_add_image.svg';
import IconGallery from '../../assets/images/ic_gallery_picker.svg';
import IconCamera from '../../assets/images/ic_camera_picker.svg';
import IconDelete from '../../assets/images/ic_trash_black.svg';
import IconCalendar from '../../assets/images/ic_calendar.svg';

import GenderComponents from '../../components/molecules/GenderComponents';
import IDCard from '../../components/atoms/IDCard';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from '../../constants/StorageKey';
import {
    getCity,
    getDistrict,
    getProvince,
    getVillage,
    getDriverRekanan,
} from '../../services/utilities';
import moment from 'moment';
import Colors from '../../constants/Colors';
import Config from '../../constants/Config';
import {getFullLink, getImageBase64FromUrl} from '../../actions/helper';
import {getUserBank} from '../../services/user';
import InfoMenu from '../../components/atoms/InfoMenu';
import {
    check,
    openSettings,
    PERMISSIONS,
    request,
    RESULTS,
} from 'react-native-permissions';
import {useToast} from 'react-native-toast-notifications';
import ImageResizer from 'react-native-image-resizer';
import ImgToBase64 from 'react-native-image-base64';
import ModalActivityIndicator from '../../components/molecules/ModalActivityIndicator';
import CustomCheckbox from "../../components/atoms/Checkbox";
import {checkGalleryPermission, requestGalleryPermission} from "../../actions/permissionAction";
import {AccountTypeEnum} from "../../data/enums/AccountTypeEnum";
import {useDeepEffect} from "../../hooks/useDeepEffect";
import CustomRegisterImagePickerBS from "../../components/molecules/CustomRegisterImagePickerBS";

const dummyDivision = [
    {
        id: 1,
        title: 'Marketing',
    },
    {
        id: 2,
        title: 'Marketing',
    },
    {
        id: 3,
        title: 'Marketing',
    },
];

const RegisterScreen = ({navigation, route}) => {
    const {showErrorDialog} = useCommonAction()
    const [companyData, setcompanyData] = useState();
    const [provinceData, setprovinceData] = useState();
    const [cityData, setcityData] = useState();
    const [districtData, setdistrictData] = useState();
    const [villageData, setvillageData] = useState();
    const [bankData, setbankData] = useState();
    const [partnerData, setPartnerData] = useState();
    const [selectedPicker, setselectedPicker] = useState();
    const [imagePickerId, setimagePickerId] = useState(99);
    const [preloading, setpreloading] = useState(true);
    //
    const [isLoading, setIsLoading] = useState(false);
    const [openDate, setopenDate] = useState(false);
    const [isEdited, setisEdited] = useState(false);
    //
    const {isEdit, data, isVerified} = route.params;
    const toast = useToast();
    const toastMessage = useRef(translate('please_select_province'));
    const [isOpenImagePicker, setIsOpenImagePicker] = useState(false);
    const handleCloseImagePicker = useCallback(() => {
        setIsOpenImagePicker(false);
    }, []);
    //
    const pickerSheet = useRef();
    //
    const [formStateBank, dispatchBank] = useReducer(formReducer, {
        inputValues: {},
        inputValidities: {},
        formIsValid: isEdit,
    });
    //
    const [formStateAddress, dispatchAddress] = useReducer(formReducer, {
        inputValues: {},
        inputValidities: {},
        formIsValid: isEdit,
    });
    //
    const [formStateCard, dispatchCard] = useReducer(formReducer, {
        inputValues: {},
        inputValidities: {
            ktp_image: isEdit,
            ktp: isEdit,
            sim_a: isEdit,
            sim_a_image: isEdit,
            sim_b: formStateCard?.inputValues?.sim_b_image?.length <= 0,
            sim_b_image:
                formStateCard?.inputValues?.sim_b?.length == undefined ||
                formStateCard?.inputValues?.sim_b?.length <= 0,
            sim_c: isEdit,
            sim_c_image: isEdit,
        },
        formIsValid: isEdit,
    });
    //
    const [formStateDetail, dispatchDetail] = useReducer(formReducer, {
        inputValues: {
            gender: '',
        },
        inputValidities: {
            gender: isEdit,
        },
        formIsValid: isEdit,
    });
    //
    const [formState, dispatch] = useReducer(formReducer, {
        inputValues: {},
        inputValidities: {},
        formIsValid: isEdit,
        isChecked: false,
    });
    //
    const showBackPrompt = () => {
        if (isEdited) {
            showDialog(
                translate('edit_confirm_desc'),
                true,
                () => dismissDialog(),
                () => navigation.pop(),
                translate('cancel_short'),
                translate('sure'),
            );
            return;
        }

        navigation?.pop();
    };
    //
    const checkEdited = () => {
        if (isEdit && !isEdited) {
            setisEdited(true);
        }
    };
    //
    const doRegister = () => {
        dispatch({
            type: 'check',
        });

        if (isAllFormValid()) {
            buildForm(formState);
        }
    };
    //
    const isAllFormValid = () => {
        console.log('sim b input', formStateCard?.inputValues?.sim_b?.length);
        console.log(
            formState.formIsValid,
            formStateCard.inputValidities,
            formStateCard?.inputValues?.sim_b?.length,
        );

        return (
            formState.formIsValid &&
            formStateCard.formIsValid &&
            formStateDetail.formIsValid &&
            formStateAddress.formIsValid &&
            (formStateBank.formIsValid ||
                formStateDetail.inputValues.driver_company_id != null)
        );
    };
    //
    // //translate form into input state if edit profile
    const translateForm = async () => {
        console.log('translateForm', JSON.stringify(data, null, 2));
        const state = {
            inputValues: {
                name: data.name,
                email: data.email,
                phone1: data.phone1,
                phone2: data.phone2,
            },
            formIsValid: true,
        };

        const stateDetail = {
            inputValues: {
                birth_date: data.birth_date,
                driver_company_id: data.driver_company?.id,
                driver_company_id_value: data.driver_company?.name,
                driver_partner_id: data.driver_partner?.id,
                driver_partner_id_value: data.driver_partner?.name,
                profile_image: data.profile_image ? await getImageBase64FromUrl(
                    data.profile_image,
                ) : null,
                profile_image_uri: data.profile_image,
                gender: data.gender,
                is_company: ((data?.account_type === AccountTypeEnum.COMPANY) || !!data?.account_type),
                account_type: data?.account_type,
                driver_company_request: data?.driver_company_request
            },
            formIsValid: true,
        };

        console.log("state detail value", JSON.stringify(stateDetail, null, 2))

        const stateAddress = {
            inputValues: {
                address: data.address,
                postal_code: data.postal_code,
                province_id: data.province.id,
                province_id_value: data.province.name,
                city_id: data.city.id,
                city_id_value: data.city.name,
                district_id: data.district.id,
                district_id_value: data.district.name,
                village_id: data.village.id,
                village_id_value: data.village.name,
            },
            formIsValid: true,
        };

        const stateCard = {
            inputValues: {
                ktp: data.ktp.number,
                ktp_image: data.ktp.image ? await getImageBase64FromUrl(
                    data.ktp.image,
                ) : null,
                ktp_image_uri: data.ktp.image,
                sim_a: data.sim_a.number,
                sim_a_image: data.sim_a.image ? await getImageBase64FromUrl(
                    data.sim_a.image,
                ) : null,
                sim_a_image_uri: data.sim_a.image,
                sim_b: data.sim_b?.number,
                sim_b_image_uri: data.sim_b?.image,
                sim_c: data.sim_c.number,
                sim_c_image: data.sim_c.image ? await getImageBase64FromUrl(
                    data.sim_c.image,
                ) : null,
                sim_c_image_uri: data.sim_c.image,
            },
            formIsValid: true,
        };

        console.log("state detail", stateDetail);

        dispatchDetail({
            type: 'update',
            state: stateDetail,
        });

        dispatchAddress({
            type: 'update',
            state: stateAddress,
        });

        dispatchCard({
            type: 'update',
            state: stateCard,
        });

        dispatch({
            type: 'update',
            state: state,
        });

        //console.log('detail form', stateDetail);

        onPickDate(data.birth_date);
    };
    //
    const buildCardForm = () => {
        //console.log('cardform', formStateCard.inputValues)
        var card = [];
        for (let item in Config.cardList) {
            if (
                formStateCard.inputValues[Config.cardList[item]] &&
                formStateCard.inputValues[`${Config.cardList[item]}_image`]
            ) {
                // console.log('push', Config.cardList[item])
                card.push({
                    type: Config.cardList[item],
                    number: formStateCard.inputValues[Config.cardList[item]] ?? null,
                    image:
                        formStateCard.inputValues[`${Config.cardList[item]}_image`] ?? null,
                });
            }
        }

        return card;
    };
    //
    // //delete village_id if manual input
    const getFormAddress = () => {
        if (formStateAddress.inputValues.village_name) {
            const {village_id, ...object} = formStateAddress.inputValues;
            return object;
        } else {
            return formStateAddress.inputValues;
        }
    };
    //
    const buildForm = formState => {
        const detail = {
            ...formStateDetail.inputValues,
            bank: formStateDetail.inputValues.driver_company_id
                ? null
                : formStateBank.inputValues,
            address: getFormAddress(),
            card: buildCardForm(),
        };

        const data = {
            ...formState.inputValues,
            password: 'thisisdummypassword',
            detail: detail,
        };

        if (isEdit) {
            setIsLoading(true);
            updateProfile(data)
                .then(() => {
                    setIsLoading(false);
                    navigation.navigate('Account', {isChangeProfile: true}, true);
                })
                .catch(err => {
                    setIsLoading(false);
                    showErrorDialog({
                        error: err
                    })
                });
        } else {
            // console.log("data", JSON.stringify(data, null, 2))
            validate(data);
        }
    };
    //
    const validate = data => {
        setIsLoading(true);
        validateRegister(data)
            .then(response => {
                setIsLoading(false);
                data.password = '';
                navigation.navigate('RegisterPassword', {data: data});
            })
            .catch(error => {
                setIsLoading(false);
                showErrorDialog({
                    error: error,
                })
            });
    };

    const onGenderPicked = value => {
        dispatchDetail({
            id: 'gender',
            type: 'input',
            input: value,
            isValid: true,
        });
    };

    const onPickDate = date => {
        console.log(moment(date).format('YYYY-MM-DD'));
        setopenDate(false);
        dispatchDetail({
            type: 'picker',
            id: 'birth_date',
            input: moment(date).format('YYYY-MM-DD'),
            desc: moment(date).format('DD MMMM YYYY'),
            isValid: true,
        });
    };
    //
    useDeepEffect(() => {
        // pickerSheet?.current?.close();
        setTimeout(() => {
            if (imagePickerId == 0) {
                openCameraPicker(selectedPicker);
            } else if (imagePickerId == 1) {
                openGalleryPicker(selectedPicker);
            } else if (imagePickerId == 2) {
                deleteImage(selectedPicker);
            }

            setimagePickerId(99);
        }, 500);
    }, [imagePickerId]);
    //
    const deleteImage = selectedPicker => {
        console.log(selectedPicker.id);
        selectedPicker.dispatch({
            type: 'image',
            id: selectedPicker.id,
            input: null,
            uri: undefined,
            isValid:
                selectedPicker.id == 'profile_image' ||
                selectedPicker.id == 'sim_b_image'
                    ? true
                    : false,
        });
    };
    //
    const openCameraPicker = async () => {
        launchCamera(
            {
                quality: 0.5,
                includeBase64: true,
                mediaType: 'photo',
            },
            result => {
                processResult(result);
            },
        );
    };
    //
    const openGalleryPicker = async () => {
        if (Platform.OS == 'android') {
            const permission = await checkGalleryPermission();
            console.log(permission);
            if (permission == RESULTS.BLOCKED) {
                showDialog(
                    translate('please_allow_storage'),
                    false,
                    openSettings,
                    () => navigation.pop(),
                    translate('open_setting'),
                    null,
                    false,
                );
                return;
            }

            if (permission == RESULTS.DENIED) {
                const result = await requestGalleryPermission();
                console.log(result);
                if (result != RESULTS.GRANTED) {
                    showDialog(
                        translate('please_allow_storage'),
                        false,
                        openSettings,
                        () => navigation.pop(),
                        translate('open_setting'),
                        null,
                        false,
                    );
                    return;
                }
            }
        }
        const result = await launchImageLibrary({
            quality: 0.5,
            includeBase64: true,
            mediaType: 'photo',
        });
        processResult(result);
    };

    const processResult = async result => {
        if (result == null || result == undefined || result.assets == undefined) {
            return;
        }
        const uri = result.assets[0].uri;
        const resizeImage = await ImageResizer.createResizedImage(
            uri,
            1024,
            720,
            'JPEG',
            30,
            undefined,
            undefined,
            false,
            {
                onlyScaleDown: true,
            },
        );
        if (resizeImage) {
            const base64String = await ImgToBase64.getBase64String(resizeImage.uri);

            if (base64String) {
                selectedPicker.dispatch({
                    type: 'input',
                    id: selectedPicker.id,
                    input: 'data:image/png;base64,' + base64String,
                    isValid: true,
                });
                selectedPicker.dispatch({
                    type: 'input',
                    id: selectedPicker.id + '_uri',
                    input: resizeImage.uri,
                    isValid: true,
                });
            }
        }
    };

    const openImagePicker = useCallback(async (id, location, dispatch) => {
        setselectedPicker({
            id,
            location,
            dispatch,
        });
        setTimeout(() => {
            setIsOpenImagePicker(true);
        }, 100);
    }, [])
    // const openImagePicker = async (id, location, dispatch) => {
    //     setselectedPicker({
    //         id,
    //         location,
    //         dispatch,
    //     });
    //     setTimeout(() => {
    //         pickerSheet.current.expand();
    //     }, 100);
    // };

    const isPickedImageEmpty = () => {
        if (selectedPicker) {
            if (selectedPicker.location == 'card') {
                return (
                    formStateCard.inputValues[selectedPicker.id + '_uri'] == '' ||
                    formStateCard.inputValues[selectedPicker.id + '_uri'] == undefined
                );
            } else {
                return (
                    formStateDetail.inputValues[selectedPicker.id + '_uri'] == '' ||
                    formStateDetail.inputValues[selectedPicker.id + '_uri'] == undefined
                );
            }
        } else {
            return false;
        }
    };

    const openPicker = (id, title, data, dispatch) => {
        let selectedId;
        if (id == "driver_company_id") {
            selectedId = formStateDetail.inputValues[id];
            navigation.navigate('PickerCompany', {
                pickerId: id,
                data: data,
                selectedId: selectedId,
                isEdit: isEdit,
                previousRoute: !isEdit ? 'Register' : 'EditProfile',
                driver_company_request: formStateDetail?.inputValues?.driver_company_request,
                dispatch: dispatch,
                onSubmit: ({
                               new_company,
                           }) => {
                    console.log("new company", new_company);
                    dispatchDetail({
                        type: "update",
                        state: {
                            ...formStateDetail,
                            inputValues: {
                                ...formStateDetail.inputValues,

                                account_type: AccountTypeEnum.INDIVIDUAL,
                                driver_company_request: new_company,
                                driver_company_id: null,
                                driver_company_value: null
                            }

                        }
                    })
                }
            });
        } else {
            if (id == 'driver_company_id' || id == 'driver_partner_id') {
                selectedId = formStateDetail.inputValues[id];
            } else if (id == 'bank_id') {
                selectedId = formStateBank.inputValues[id];
            } else {
                selectedId = formStateAddress.inputValues[id];
            }
            console.log("selected id", selectedId);
            navigation.navigate('Picker', {
                pickerId: id,
                title: title,
                data: data,
                selectedId: selectedId,
                isEdit: isEdit,
                previousRoute: !isEdit ? 'Register' : 'EditProfile',
                dispatch: dispatch,
            });
        }
    };

    useDeepEffect(async () => {
        AsyncStorage.getItem(StorageKey.KEY_COMPANY).then(company => {
            setcompanyData(JSON.parse(company));
        });
        AsyncStorage.getItem(StorageKey.KEY_PROVINCE).then(province => {
            setprovinceData(JSON.parse(province));
        });
        AsyncStorage.getItem(StorageKey.KEY_BANK).then(bank => {
            setbankData(JSON.parse(bank));
        });

        translateForm();
    }, []);

    const getRekanan = async () => {
        const partner = await getDriverRekanan();
        setPartnerData(partner);
    }

    const fetchPreloadData = async () => {
        try {
            console.log("preloading data");
            getRekanan()
            const city = await getCity(data.province.id)
            setcityData(city)
            const district = await getDistrict(data.city.id)
            setdistrictData(district)
            const village = await getVillage(data.district.id)
            setvillageData(village)
            setpreloading(false);
        } catch (e) {
            showDialog(e)
        }
    }
    //
    useDeepEffect(() => {
        console.log("parames", route.params);

        if (route.params?.pickerId) {
            const id = route.params.pickerId;
            const dispatch = route.params.dispatch;
            console.log("picker id", id);
            dispatch({
                type: 'picker',
                id: id,
                input: route.params.id,
                desc: route.params.name,
                isValid: true,
            });

            if (id == 'driver_company_id') {
                //set account type to company
                dispatchDetail({
                    type: 'update',
                    state: {
                        ...formStateDetail,
                        inputValues: {
                            ...formStateDetail.inputValues,
                            account_type: AccountTypeEnum.COMPANY,
                            driver_company_request: null,
                            driver_company_id: route.params.id,
                            driver_company_id_value: route.params.name,
                        },
                    },
                })

                //make bank null if company is picked
                dispatch({
                    type: 'input',
                    id: 'bank',
                    input: null,
                    isValid: true,
                });

                getUserBank(route.params.id).then(response => {
                    const state = {
                        inputValues: {
                            bank_id: response.id,
                            bank_id_value: response.bank_name,
                            ...response,
                        },
                        formIsValid: true,
                    };
                    dispatchBank({
                        type: 'update',
                        state: state,
                    });
                });
            } else if (id == 'driver_partner_id') {
            } else if (id == 'bank_id') {
                return;
            } else {
                if (id == 'province_id') {
                    toastMessage.current = translate('please_wait');
                    setcityData();
                    setdistrictData();
                    setvillageData();
                    getCity(route.params.id)
                        .then(cityData => {
                            setcityData(cityData);
                        })
                        .catch(err => {
                            toastMessage.current = translate('reselect_province');
                            toast.show(toastMessage.current, {
                                type: 'custom',
                                placement: 'bottom',
                                duration: 5000,
                                offset: 30,
                                animationType: 'slide-in',
                            });
                        });
                } else if (id == 'city_id') {
                    toastMessage.current = translate('please_wait');
                    setdistrictData();
                    setvillageData();
                    getDistrict(route.params.id)
                        .then(districtData => {
                            setdistrictData(districtData);
                        })
                        .catch(err => {
                            toastMessage.current = translate('reselect_city');
                            toast.show(toastMessage.current, {
                                type: 'custom',
                                placement: 'bottom',
                                duration: 5000,
                                offset: 30,
                                animationType: 'slide-in',
                            });
                        });
                } else if (id == 'district_id') {
                    toastMessage.current = translate('please_wait');
                    setvillageData();
                    getVillage(route.params.id)
                        .then(villageData => {
                            setvillageData(villageData);
                        })
                        .catch(err => {
                            toastMessage.current = translate('reselect_district');
                            toast.show(toastMessage.current, {
                                type: 'custom',
                                placement: 'bottom',
                                duration: 5000,
                                offset: 30,
                                animationType: 'slide-in',
                            });
                        });
                }
            }
        }
    }, [route.params]);

    //preload region
    useDeepEffect(() => {
        if (isEdit) {
            console.log('data', data);
            fetchPreloadData()
        } else {
            getRekanan()
            setpreloading(false)
        }
    }, []);

    //reset if region changed
    useDeepEffect(() => {
        if (!isEdit || !preloading) {
            dispatchAddress({
                type: 'picker',
                id: 'city_id',
                input: null,
                desc: null,
                isValid: false,
            });
        }
    }, [cityData]);

    useDeepEffect(() => {
        if (!isEdit || !preloading) {
            dispatchAddress({
                type: 'picker',
                id: 'district_id',
                input: null,
                desc: null,
                isValid: false,
            });
        }
    }, [cityData, districtData]);


    useDeepEffect(() => {
        if (!isEdit || !preloading) {
            dispatchAddress({
                type: 'picker',
                id: 'village_id',
                input: null,
                desc: null,
                isValid: false,
            });
        }
    }, [cityData, districtData, villageData]);

    useDeepEffect(() => {
        if (isEdit && !preloading) checkEdited();
    }, [
        formState,
        formStateDetail,
        formStateAddress,
        formStateCard,
        formStateBank,
    ]);

    return (
        <>
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                <StatusBar backgroundColor="white" barStyle="dark-content"/>
                <NavBar
                    navigation={navigation}
                    title={isEdit ? translate('edit_profile') : translate('register_form')}
                    shadowEnabled={true}
                    onBackPress={showBackPrompt}
                />
                <KeyboardAvoidingView
                    style={{flex: 1, zIndex: -1}}
                    behavior={Platform.OS == 'android' ? 'none' : 'padding'}>
                    <ScrollView style={styles.container}>
                        <View style={{paddingBottom: 40}}>

                            {!isEdit ? (
                                <View>
                                    <LatoBold>{translate('register_form_title')}</LatoBold>
                                    <LatoRegular containerStyle={{marginTop: 5}}>
                                        {translate('register_form_desc')}
                                    </LatoRegular>
                                </View>
                            ) : <></>}

                            <TouchableOpacity
                                style={{alignItems: 'center', margin: 16}}
                                onPress={() => {
                                    !isVerified
                                        ? openImagePicker('profile_image', 'Detail', dispatchDetail)
                                        : null;
                                }}>
                                <View>
                                    {formStateDetail.inputValues.profile_image_uri ? (
                                        <Image
                                            source={{
                                                uri: formStateDetail.inputValues.profile_image_uri
                                                    ? formStateDetail.inputValues.profile_image_uri
                                                    : getFullLink(
                                                        formStateDetail.inputValues.profile_image_uri,
                                                    ),
                                            }}
                                            style={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 50,
                                                resizeMode: 'cover',
                                            }}
                                        />
                                    ) : (
                                        <IconProfilePlaceholder/>
                                    )}
                                    {!isVerified ? (
                                        <IconProfileAddImage
                                            style={{position: 'absolute', bottom: 0, right: 0}}
                                        />
                                    ) : null}
                                </View>
                            </TouchableOpacity>

                            <CustomInput
                                id={'name'}
                                title={translate('name_title')}
                                placeholder={translate('name_placeholder')}
                                value={formState.inputValues.name}
                                dispatcher={dispatch}
                                isCheck={formState.isChecked}
                                required
                                viewOnly={isVerified}
                            />

                            <PhoneInput
                                id={'phone1'}
                                title={translate('phone_title')}
                                placeholder={translate('phone_placeholder')}
                                dispatcher={dispatch}
                                containerStyle={{marginVertical: 16}}
                                value={formState.inputValues.phone1}
                                isCheck={formState.isChecked}
                                viewOnly={isVerified}
                            />

                            <PhoneInput
                                id={'phone2'}
                                title={translate('phone_title2')}
                                placeholder={translate('phone_placeholder')}
                                dispatcher={dispatch}
                                value={formState.inputValues.phone2}
                                isCheck={formState.isChecked}
                                optional
                                isUnique={true}
                                isUniqueWith={formState.inputValues.phone1}
                                viewOnly={isVerified}
                            />

                            <CustomInput
                                id={'email'}
                                title={translate('email_title')}
                                placeholder={translate('email_placeholder')}
                                containerStyle={{marginVertical: 16}}
                                dispatcher={dispatch}
                                value={formState.inputValues.email}
                                isCheck={formState.isChecked}
                                required
                                viewOnly={isVerified}
                            />

                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <LatoBold>Anda tergabung di perusahaan?</LatoBold>
                                <CustomCheckbox
                                    disabled={isVerified}
                                    onPress={() => {
                                        dispatchDetail({
                                            type: "update",
                                            state: {
                                                ...formStateDetail,
                                                inputValues: {
                                                    ...formStateDetail.inputValues,
                                                    is_company: !formStateDetail.inputValues.is_company
                                                }
                                            }
                                        })
                                    }}
                                    isChecked={formStateDetail?.inputValues?.is_company}/>
                            </View>

                            {
                                formStateDetail?.inputValues?.is_company
                                    ? <>
                                        {
                                            formStateDetail?.inputValues?.driver_company_request
                                                ? <View style={{}}>
                                                    <PickerInput
                                                        onPress={() => {
                                                            openPicker(
                                                                'driver_company_id',
                                                                'company_title',
                                                                companyData,
                                                                dispatchDetail,
                                                            );
                                                        }}
                                                        viewOnly={isVerified}
                                                        disabled={isVerified}
                                                        title={translate('company_title')}
                                                        value={formStateDetail?.inputValues?.driver_company_request}
                                                    />
                                                </View>
                                                : <>
                                                    <PickerInput
                                                        id={'driver_company_id'}
                                                        title={translate('company_title')}
                                                        placeholder={translate('company_placeholder')}
                                                        value={formStateDetail.inputValues.driver_company_id_value}
                                                        viewOnly={isVerified}
                                                        disabled={isVerified}
                                                        onPress={() => {
                                                            openPicker(
                                                                'driver_company_id',
                                                                'company_title',
                                                                companyData,
                                                                dispatchDetail,
                                                            );
                                                        }}
                                                        isCheck={formState.isChecked}
                                                    />
                                                </>
                                        }
                                    </>
                                    : <></>
                            }


                            <InfoMenu
                                text={translate('company_bank_info')}
                                containerStyle={{marginTop: 16}}
                            />

                            <PickerInput
                                id={'driver_partner_id'}
                                title={translate('partner_title')}
                                placeholder={translate('partner_placeholder')}
                                value={formStateDetail.inputValues.driver_partner_id_value}
                                viewOnly={isVerified}
                                containerStyle={{marginTop: 16}}
                                disabled={isVerified}
                                onPress={() => {
                                    openPicker(
                                        'driver_partner_id',
                                        'partner_title',
                                        partnerData,
                                        dispatchDetail,
                                    );
                                }}
                                isCheck={formState.isChecked}
                            />

                            <CustomInput
                                id={'address'}
                                title={translate('address_title')}
                                placeholder={translate('address_placeholder')}
                                value={formStateAddress.inputValues.address}
                                containerStyle={{marginVertical: 16}}
                                dispatcher={dispatchAddress}
                                isCheck={formState.isChecked}
                                required
                                viewOnly={isVerified}
                            />

                            <PickerInput
                                id={'province_id'}
                                title={translate('province_title')}
                                placeholder={translate('province_placeholder')}
                                value={formStateAddress.inputValues.province_id_value}
                                isCheck={formState.isChecked}
                                viewOnly={isVerified}
                                disabled={isVerified}
                                onPress={() =>
                                    openPicker(
                                        'province_id',
                                        'province_title',
                                        provinceData,
                                        dispatchAddress,
                                    )
                                }
                                required
                            />

                            <PickerInput
                                id={'city_id'}
                                title={translate('city_title')}
                                containerStyle={{paddingVertical: 16}}
                                placeholder={translate('city_placeholder')}
                                value={formStateAddress.inputValues.city_id_value}
                                isCheck={formState.isChecked}
                                viewOnly={isVerified}
                                disabled={isVerified}
                                //disabled={formStateAddress.inputValues.province_id == null && cityData == null}
                                onPress={() =>
                                    cityData == null
                                        ? toast.show(toastMessage.current, {
                                            type: 'custom',
                                            placement: 'bottom',
                                            duration: 2000,
                                            offset: 30,
                                            animationType: 'slide-in',
                                        })
                                        : openPicker(
                                            'city_id',
                                            'city_title',
                                            cityData,
                                            dispatchAddress,
                                        )
                                }
                                required
                            />

                            <PickerInput
                                id={'district_id'}
                                title={translate('district_title')}
                                placeholder={translate('district_placeholder')}
                                value={formStateAddress.inputValues.district_id_value}
                                isCheck={formState.isChecked}
                                viewOnly={isVerified}
                                disabled={isVerified}
                                //disabled={formStateAddress.inputValues.city_id == null }
                                onPress={() =>
                                    districtData == null
                                        ? toast.show(toastMessage.current, {
                                            type: 'custom',
                                            placement: 'bottom',
                                            duration: 2000,
                                            offset: 30,
                                            animationType: 'slide-in',
                                        })
                                        : openPicker(
                                            'district_id',
                                            'district_title',
                                            districtData,
                                            dispatchAddress,
                                        )
                                }
                                required
                            />

                            <PickerInput
                                id={'village_id'}
                                title={translate('village_title')}
                                containerStyle={{paddingVertical: 16}}
                                placeholder={translate('village_placeholder')}
                                value={formStateAddress.inputValues.village_id_value}
                                isCheck={formState.isChecked}
                                viewOnly={isVerified}
                                disabled={isVerified}
                                //disabled={formStateAddress.inputValues.district_id == null}
                                onPress={() =>
                                    villageData == null
                                        ? toast.show(toastMessage.current, {
                                            type: 'custom',
                                            placement: 'bottom',
                                            duration: 2000,
                                            offset: 30,
                                            animationType: 'slide-in',
                                        })
                                        : openPicker(
                                            'village_id',
                                            'village_title',
                                            villageData,
                                            dispatchAddress,
                                        )
                                }
                                required
                            />

                            {formStateAddress.inputValues.village_id == -99 ?
                                formStateAddress.inputValues.village_id_value != null && (
                                    <CustomInput
                                        id={'village_name'}
                                        title={translate('manual_input')}
                                        containerStyle={{paddingBottom: 16}}
                                        placeholder={translate('village_placeholder')}
                                        value={formStateAddress.inputValues.village_name}
                                        isCheck={formState.isChecked}
                                        viewOnly={isVerified}
                                        dispatcher={dispatchAddress}
                                        required
                                    />
                                ) : null}

                            <CustomInput
                                id={'postal_code'}
                                title={translate('postal_code_title')}
                                placeholder={translate('postal_code_placeholder')}
                                value={formStateAddress.inputValues.postal_code}
                                dispatcher={dispatchAddress}
                                isCheck={formState.isChecked}
                                viewOnly={isVerified}
                                keyboardType={'number-pad'}
                                required
                            />

                            <GenderComponents
                                containerStyle={{paddingVertical: 16}}
                                selectedId={formStateDetail.inputValues.gender}
                                isCheck={formState.isChecked}
                                disabled={isVerified}
                                onPress={onGenderPicked}
                            />

                            <PickerInput
                                id={'birth_date'}
                                title={translate('birthdate_title')}
                                placeholder={translate('birthdate_placeholder')}
                                value={formStateDetail.inputValues.birth_date_value}
                                isCheck={formState.isChecked}
                                Icon={IconCalendar}
                                viewOnly={isVerified}
                                disabled={isVerified}
                                required
                                onPress={() => setopenDate(true)}
                            />
                            {!isEdit ? (
                                <View>
                                    <PickerInput
                                        id={'bank_id'}
                                        title={translate('bank_title')}
                                        placeholder={translate('bank_placeholder')}
                                        containerStyle={{paddingVertical: 16}}
                                        value={formStateBank.inputValues.bank_id_value}
                                        isCheck={formState.isChecked}
                                        required
                                        disabled={formStateDetail.inputValues.driver_company_id}
                                        onPress={() =>
                                            openPicker('bank_id', 'bank_title', bankData, dispatchBank)
                                        }
                                    />

                                    <CustomInput
                                        id={'number'}
                                        title={translate('bank_no_title')}
                                        placeholder={translate('bank_no_placeholder')}
                                        value={formStateBank.inputValues.number}
                                        dispatcher={dispatchBank}
                                        isCheck={formState.isChecked}
                                        disabled={formStateDetail.inputValues.driver_company_id}
                                        keyboardType={'number-pad'}
                                        required
                                    />

                                    <CustomInput
                                        id={'branch'}
                                        title={translate('branch_title')}
                                        placeholder={translate('branch_placeholder')}
                                        containerStyle={{paddingVertical: 16}}
                                        value={formStateBank.inputValues.branch}
                                        dispatcher={dispatchBank}
                                        isCheck={formState.isChecked}
                                        disabled={formStateDetail.inputValues.driver_company_id}
                                        required
                                    />

                                    <CustomInput
                                        id={'name'}
                                        title={translate('bank_owner_title')}
                                        placeholder={translate('bank_owner_placeholder')}
                                        value={formStateBank.inputValues.name}
                                        dispatcher={dispatchBank}
                                        isCheck={formState.isChecked}
                                        disabled={formStateDetail.inputValues.driver_company_id}
                                        required
                                    />
                                </View>
                            ) : null}

                            <CustomInput
                                id={'ktp'}
                                title={translate('number', {string: translate('ktp')})}
                                placeholder={translate('ktp_placeholder')}
                                containerStyle={{paddingVertical: 16}}
                                value={formStateCard.inputValues.ktp}
                                dispatcher={dispatchCard}
                                viewOnly={isVerified}
                                isCheck={formState.isChecked}
                                keyboardType={'number-pad'}
                                required
                            />

                            <IDCard
                                title={translate('ktp')}
                                navigation={navigation}
                                onPress={
                                    !isVerified
                                        ? () => {
                                            openImagePicker('ktp_image', 'card', dispatchCard)
                                        }
                                        : undefined
                                }
                                imageUri={formStateCard.inputValues.ktp_image_uri}
                                isCheck={formState.isChecked}
                                required
                            />

                            <CustomInput
                                id={'sim_a'}
                                title={translate('number', {string: translate('sim_a')})}
                                placeholder={translate('sim_placeholder')}
                                containerStyle={{paddingVertical: 16}}
                                value={formStateCard.inputValues.sim_a}
                                dispatcher={dispatchCard}
                                viewOnly={isVerified}
                                isCheck={formState.isChecked}
                                keyboardType={'number-pad'}
                                required
                            />

                            <IDCard
                                title={translate('sim_a')}
                                navigation={navigation}
                                onPress={!isVerified
                                    ? () => {
                                        openImagePicker('sim_a_image', 'card', dispatchCard)
                                    }
                                    : undefined
                                }
                                imageUri={formStateCard.inputValues.sim_a_image_uri}
                                isCheck={formState.isChecked}
                                required
                            />

                            <CustomInput
                                id={'sim_b'}
                                title={translate('number', {string: translate('sim_b')})}
                                placeholder={translate('sim_placeholder')}
                                containerStyle={{paddingVertical: 16}}
                                value={formStateCard.inputValues.sim_b}
                                dispatcher={dispatchCard}
                                viewOnly={isVerified}
                                keyboardType={'number-pad'}
                                isCheck={formState.isChecked}
                                required={formStateCard.inputValues.sim_b_image?.length > 0}
                            />

                            <IDCard
                                navigation={navigation}
                                title={translate('sim_b')}
                                onPress={!isVerified
                                    ? () => {
                                        openImagePicker('sim_b_image', 'card', dispatchCard)
                                    }
                                    : undefined
                                }
                                imageUri={formStateCard.inputValues.sim_b_image_uri}
                                isCheck={formState.isChecked}
                                required={formStateCard.inputValues.sim_b?.length > 0}
                            />

                            <CustomInput
                                id={'sim_c'}
                                title={translate('number', {string: translate('sim_c')})}
                                placeholder={translate('sim_placeholder')}
                                containerStyle={{paddingVertical: 16}}
                                value={formStateCard.inputValues.sim_c}
                                dispatcher={dispatchCard}
                                viewOnly={isVerified}
                                isCheck={formState.isChecked}
                                keyboardType={'number-pad'}
                                required
                            />


                            <IDCard
                                title={translate('sim_c')}
                                navigation={navigation}
                                onPress={!isVerified
                                    ? () => {
                                        openImagePicker('sim_c_image', 'card', dispatchCard)
                                    }
                                    : undefined
                                }
                                imageUri={formStateCard.inputValues.sim_c_image_uri}
                                isCheck={formState.isChecked}
                                required
                            />


                            {!isVerified && (
                                <CustomButton
                                    types="primary"
                                    title={translate('next')}
                                    containerStyle={{marginTop: 16}}
                                    onPress={doRegister}
                                    isLoading={isLoading}
                                />
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                <DatePicker
                    open={openDate}
                    mode="date"
                    modal
                    androidVariant="iosClone"
                    date={new Date()}
                    maximumDate={new Date()}
                    onConfirm={onPickDate}
                    onCancel={() => setopenDate(false)}
                />

                <ModalActivityIndicator show={preloading}/>
            </SafeAreaView>


            <CustomRegisterImagePickerBS
                open={isOpenImagePicker}
                onClose={() => {
                    setIsOpenImagePicker(false)
                }}
                onCamera={() => {
                    handleCloseImagePicker()
                    setimagePickerId(0)
                }}
                onGallery={() => {
                    handleCloseImagePicker()
                    setimagePickerId(1)
                }}
                onDelete={() => {
                    handleCloseImagePicker()
                    setimagePickerId(2)
                }}
                isImageEmpty={isPickedImageEmpty()}
            />


        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    shadowTop: {
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: -8,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 0,
        padding: 16,
    },
    contentContainerStyle: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.33,
        shadowRadius: 10,
        elevation: 10,
        backgroundColor: 'white',
    },
});

export default RegisterScreen;
