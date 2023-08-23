/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment'
import 'moment/locale/id';
import { LogBox } from 'react-native';
import ReactNativeForegroundService from "@supersami/rn-foreground-service";

messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
});
// LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs()

moment.locale()
ReactNativeForegroundService.register();

AppRegistry.registerComponent(appName, () => App);
