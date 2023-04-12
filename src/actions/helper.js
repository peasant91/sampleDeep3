import Config from '../constants/Config';
import Constant from '../constants/Constant';
import moment from 'moment';
import translate from '../locales/translate';
import {FormatMoney} from 'format-money-js';
import openMap from 'react-native-open-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageKey from '../constants/StorageKey';
import Realm from 'realm';
import messaging, {firebase} from '@react-native-firebase/messaging';
import {Linking, Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {check, PERMISSIONS} from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";

export const getCurrentWeek = () => {
  currentdate = new Date();
  var oneJan = new Date(currentdate.getFullYear(), 0, 1);
  var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
  var result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
  console.log(
    `The week number of the current date (${currentdate}) is ${result}.`,
  );
  return result;
};

export const getFullLink = text => {
  return Constant[Config.developmentMode].DOMAIN + '/' + text;
};

export const openMaps = (lat, lng) => {
  openMap({
    latitude: lat,
    longitude: lng,
    end: `${lat},${lng}`,
    query: `${lat},${lng}`,
  });
};

export const momentx = (date) => {
  return moment(date).utc()
}

export const getPostTime = date => {
  const utc = moment.utc('2022-04-19T02:20:33.000Z');
  const now = moment(Date());
  if (utc.diff(now, 'days') == 0) {
    return 'Sekitar ' + moment(utc).local().fromNow();
  } else {
    return moment(date).format('DD MMMM YYYY');
  }
};

export const isBeforeDate = (firstDate, secondDate) => {
  //first date is current date, secondDate is compared date
  return firstDate <= secondDate;
};

export const displayProvince = province => {
  if (province && province.length > 1) {
    return translate('province_count', {count: province.length});
  } else {
    return province;
  }
};

export const isEmpty = obj => {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
};

export const toCurrency = number => {
  if (number) {
    const fm = new FormatMoney({
      decimals: 0,
      separator: '.',
      symbol: 'Rp. ',
    });
    return fm.from(number);
  } else {
    return 'Rp. 0';
  }
};

export const mapStickerArea = stickerArea =>
  new Promise((resolve, reject) => {
    var stickers = [];
    AsyncStorage.getItem(StorageKey.KEY_VEHICLE_STICKER).then(response => {
      const stickerData = JSON.parse(response);
      for (index in stickerArea) {
        const sticker = stickerData.filter(
          item => item.value == stickerArea[index].value,
        );
        if (sticker.length == 1) {
          sticker[0].images = Array(sticker[0].image_report).fill(' ');
          stickers.push(sticker[0]);
        }
      }
      resolve(stickers);
    });
  });

export const mapReportImages = stickerImages =>
  new Promise((resolve, reject) => {
    var stickers = [];
    AsyncStorage.getItem(StorageKey.KEY_VEHICLE_STICKER).then(response => {
      const stickerData = JSON.parse(response);
      for (index in stickerData) {
        const stickerList = stickerImages.filter(
          item => item.sticker_area == stickerData[index].value,
        );
        console.log('sticker listnya', stickerList);
        if (stickerList.length > 0) {
          const data = {
            name: stickerData[index].name,
            value: stickerData[index].name,
            images: stickerList.map(item => item.image),
          };
          stickers.push(data);
        }
      }
      resolve(stickers);
    });
  });

export const range = (min, max) => {
  var len = max - min + 1;
  var arr = new Array(len);
  for (var i = 0; i < len; i++) {
    arr[i] = min + i;
  }
  return arr;
};

export const getRealm = schema => {
  return Realm.open({
    path: 'otomedia',
    schema: [schema],
  });
};

export const average = array => array.reduce((a, b) => a + b) / array.length;
export const sum = array => array.reduce((a, b) => a + b);

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
//poin 1 is location before
//poin 2 is current location
export const calcDistance = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

// Converts numeric degrees to radians
const toRad = Value => {
  return (Value * Math.PI) / 180;
};

export const openWhatsapp = () => {
  let phoneWithCountryCode = Constant.PHONE_NUMBER;

  let mobile =
    Platform.OS == 'ios' ? phoneWithCountryCode : '+' + phoneWithCountryCode;
  if (mobile) {
    let url = 'whatsapp://send?phone=' + mobile;
    Linking.openURL(url)
      .then(() => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        if (Platform.OS == 'android') {
          Linking.openURL(`market://details?id=${Constant.PACKAGE_ID}`);
          return;
        }

        alert('Make sure WhatsApp installed on your device');
      });
  } else {
    alert('Please insert mobile no');
  }
};

export const getFirebaseToken = new Promise(async (reject, resolve) => {
  const authStatus = await messaging().requestPermission();
  const fMessagging = firebase.messaging();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    fMessagging
      .getToken()
      .then(token => {
        AsyncStorage.setItem(StorageKey.KEY_FIREBASE_TOKEN, token);
        resolve(token);
      })
      .catch(err => {
        reject(err.message);
      });
  }
});

export const getImageBase64FromUrl = url =>
  new Promise((resolve, reject) => {
    let imagePath = null;
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', url)
      // the image is now dowloaded to device's storage
      .then(response => {
        // the image path you can use it directly with Image component
        return response.readFile('base64');
      })
      .then(base64Data => {
        // here's base64 encoded image
        //console.log('base64', base64Data);
        resolve('data:image/jpeg;base64,' + base64Data);
        // remove the file from storage
      })
      .catch(err => {
        reject(err);
      });
  });

export const checkIsFakeGPS = async (onLoad) => {
  const isPermissionLocationGranted = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION) === "granted" && await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION) === "granted"
      if(isPermissionLocationGranted){
        Geolocation.getCurrentPosition(
            (position) => {
              console.log(position)
              if(position?.mocked){
                onLoad(true)
              }else{
                onLoad(false)
              }
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
              onLoad(false)
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }else{
        console.log("permission not granted yet")
        onLoad(false)
      }
};
