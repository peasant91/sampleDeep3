/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {Freshchat} from 'react-native-freshchat-sdk';
import moment from 'moment'
import 'moment/locale/id';
import { LogBox } from 'react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  Freshchat.isFreshchatNotification(remoteMessage.data, freshchatNotification => {
    if (freshchatNotification) {
      Freshchat.handlePushNotification(remoteMessage.data);
      console.log('freshchate notif background', remoteMessage)
    } else {
      console.log('Message handled in the background!', remoteMessage);
    }
  });
});
// LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs()

moment.locale('id')

AppRegistry.registerComponent(appName, () => App);
