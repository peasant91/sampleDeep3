import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar, View} from 'react-native';
import NavBar from '../components/atoms/NavBar';
import EmailIcon from '../assets/images/ic_big_email.svg';
import CustomButton from '../components/atoms/CustomButton';
import translate from '../locales/translate';
import {Subtitle1, Subtitle2} from '../components/atoms/CustomText';
import Colors from '../constants/Colors';

const ForgotPasswordSentScreen = ({navigation, route}) => {
  const email = route.params.email;

  const goToLogin = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backroundColor="white" barStyle="dark-content" />
      <NavBar navigation={navigation} />
      <View style={styles.container}>
        <View
          style={[
            styles.container,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <EmailIcon />
          <Subtitle1 style={{marginTop: 24}}>
            {translate('link_verification_sent')}
          </Subtitle1>
          <Subtitle2
            style={{
              textAlign: 'center',
              marginTop: 16,
              color: Colors.secondText,
            }}>
            {translate('link_verification_sent_desc', {email: email})}
          </Subtitle2>
        </View>
        <CustomButton
          types="primary"
          title={translate('back_to_login')}
          onPress={goToLogin}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
});

export default ForgotPasswordSentScreen;
