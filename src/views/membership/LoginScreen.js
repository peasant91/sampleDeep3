import React, {useState, useReducer, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import CustomText, {
  LatoRegular,
} from '../../components/atoms/CustomText';
import CustomButton from '../../components/atoms/CustomButton';
import Colors from '../../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {showDialog, dismissDialog} from '../../actions/commonActions';
import CustomInput, {
  PasswordInput,
  PhoneInput,
} from '../../components/atoms/CustomInput';
import {LatoBold} from '../../components/atoms/CustomText';
import {login} from '../../services/auth';
import formReducer from '../../reducers/formReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from '../../constants/StorageKey';
import {getProfile} from '../../services/user';
import {AuthContext} from '../../../App';
import {getFreshchat} from '../../services/freshchat';
import {Freshchat, FreshchatConfig} from 'react-native-freshchat-sdk';
import {useKeyboard} from '@react-native-community/hooks';
import translate from '../../locales/translate';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const LoginScreen = ({navigation, route}) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputValues: {
      phone: '',
      password: '',
    },
    inputValidities: {
      phone: false,
      password: false,
    },
    formIsValid: false,
    isChecked: false,
  });

  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {signIn} = useContext(AuthContext);

  const onChangeText = (id, text, isValid) => {
    dispatch({
      type: 'input',
      id: id,
      input: text,
      isValid: isValid,
    });
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  const goToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const seeTerm = () => {
    navigation.navigate('SingleWeb', {url: 'https://www.facebook.com'})
  }

  const doLogin = () => {
    console.log('do login')
    dispatch({
      type: 'check',
    });

    if (formState.formIsValid) {
      setIsLoading(true);
      login(formState.inputValues)
        .then(response => {
          setIsLoading(false);
          saveToken(response);
          console.log('login success');
        })
        .catch(err => {
          setIsLoading(false);
          showDialog(err.message, false);
        });
    }
  };

  const saveToken = data => {
    AsyncStorage.setItem(StorageKey.KEY_ACCESS_TOKEN, data.access_token)
      .then(() => {
        saveProfile(data)
      })
      .catch(err => {
        console.log(err);
      });
  };

  const saveProfile = data => {
    AsyncStorage.setItem(StorageKey.KEY_USER_PROFILE, JSON.stringify(data.user))
      .then(() => {
        signIn();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const doGetProfile = () => {
    getProfile()
      .then(response => {
        saveProfile(response);
        restoreFreshchat(response.employee_id);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const restoreFreshchat = id => {
    getFreshchat()
      .then(response => {
        console.log(
          `restoring freshchat id ${id} fresh id ${response.freshchat_id}`,
        );
        Freshchat.identifyUser(id, response.freshchat_id, error =>
          console.log(`fresh restore: ${error}`),
        );
      })
      .catch(err => showDialog(err.message, false));
  };

  const goToHome = () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
      console.log('pisang');
    });
    Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', () => setKeyboardOpen(true));
      Keyboard.removeListener('keyboardDidHide', () => setKeyboardOpen(false));
    };
  }, []);

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{flexGrow: 1, flexShrink: 0}}>
            <View style={style.container}>
              <View style={{flex: 1}}>
                <Image
                  source={require('../../assets/images/ic_login.png')}
                  style={{
                    width: '100%',
                    height: undefined,
                    aspectRatio: 1.8,
                    resizeMode: 'cover',
                  }}
                />

                <View style={{padding: 16}}>
                  <PhoneInput
                  id="phone"
                  value={formState.inputValues.credential}
                  placeholder={translate('phone_placeholder')}
                  title={translate('phone_title')}
                  // onChangeText={onChangeText}
                  containerStyle={{marginTop: 40}}
                  isCheck={formState.isChecked}
                  dispatcher={dispatch}
                  error={''}
                  keyboardType={'default'}
                />
                <PasswordInput
                  id="password"
                  value={formState.inputValues.password}
                  placeholder={translate('password_placeholder')}
                  title={translate('password_title')}
                  // onChangeText={onChangeText}
                  containerStyle={{marginTop: 24}}
                  isCheck={formState.isChecked}
                  dispatcher={dispatch}
                  error={''}
                  keyboardType={'default'}
                  match={''}
                />
                  <View style={{alignSelf: 'center', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={goToForgotPassword} style={{flexDirection: 'row', marginTop: 32}}>
                      <LatoBold>
                        {translate('forgot_password')}{' '}
                      </LatoBold>
                        <LatoBold
                          style={{
                            color: Colors.secondary,
                            fontWeight: '700',
                            textDecorationLine: 'underline',
                          }}>
                          {translate('tap_here') }
                        </LatoBold>
                    </TouchableOpacity>
                  </View>

                  <CustomButton
                    types="primary"
                    title={translate('login')}
                    containerStyle={{marginTop: 30}}
                    onPress={doLogin}
                    isLoading={isLoading}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              backgroundColor: Colors.divider,
              marginTop: 30,
              padding: 16,
              justifyContent: 'center',
            }}>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <LatoBold>{translate('wanna_join')}</LatoBold>
              <TouchableOpacity onPress={goToRegister}>
                <LatoBold
                  style={{
                    color: Colors.primary,
                    marginLeft: 5,
                  }}>
                  {translate('oto_media_member')}
                </LatoBold>
              </TouchableOpacity>
            </View>

            <LatoRegular style={{marginVertical: 10}}>{translate('login_desc')}</LatoRegular>

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity onPress={seeTerm}>

              <LatoBold style={{
                    color: Colors.secondary,
                    textDecorationLine: 'underline',
              }}>{translate('see_term_and_condition')}</LatoBold>
              </TouchableOpacity>
              <TouchableOpacity onPress={goToRegister}>
              <LatoBold style={{
                    color: Colors.secondary,
                    textDecorationLine: 'underline',
              }}>{translate('register_here')}</LatoBold>
              </TouchableOpacity>
            </View>

          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: 'white',
  },
  searchButton: {
    margin: 16,
  },
});

export default LoginScreen;