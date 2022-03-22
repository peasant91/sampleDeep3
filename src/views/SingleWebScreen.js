import React, {useState} from 'react';
import {ActivityIndicator, SafeAreaView, View} from 'react-native';
import WebView from 'react-native-webview';
import NavBar from '../components/atoms/NavBar';

const SingleWebScreen = ({navigation, route}) => {
  const {url} = route.params;
  const [isLoading, setisLoading] = useState(true);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <NavBar navigation={navigation} shadowEnabled={true} />
      {isLoading && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator style={{flex: 1}}/>
        </View>
      )}
      <WebView
        style={{display: isLoading ? 'none' : 'flex'}}
        source={{uri: url}}
        onLoadEnd={() => setisLoading(false)}></WebView>
    </SafeAreaView>
  );
};

export default SingleWebScreen;
