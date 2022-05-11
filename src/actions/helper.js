import Config from "../constants/Config";
import Constant from "../constants/Constant";
import moment from "moment";
import translate from "../locales/translate";
import { FormatMoney } from "format-money-js";
import openMap from 'react-native-open-maps'
import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageKey from "../constants/StorageKey";
import Realm from 'realm'

export const getCurrentWeek = () => {
  currentdate = new Date();
  var oneJan = new Date(currentdate.getFullYear(), 0, 1);
  var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
  var result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
  console.log(`The week number of the current date (${currentdate}) is ${result}.`);
  return result
}

export const getFullLink = (text) => {
  return Constant[Config.developmentMode].DOMAIN + '/' + text
}

export const openMaps = (lat, lng) => {
  openMap({ latitude: lat, longitude: lng, end: `${lat},${lng}`, query: `${lat},${lng}` })
}

export const getPostTime = (date) => {
  const utc = moment.utc('2022-04-19T02:20:33.000Z')
  const now = moment(Date())
  if (utc.diff(now, 'days') == 0) {
    return 'Sekitar ' + moment(utc).local().fromNow()
  } else {
    return moment(date).format('DD MMMM YYYY')
  }
}

export const displayProvince = (province) => {
  if (province && province.length > 1) {
    return translate('province_count', { count: province.length })
  } else {
    return province
  }
}

export const isEmpty = (obj) => {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

export const toCurrency = (number) => {

  if (number) {
    const fm = new FormatMoney({
      decimals: 0,
      separator: '.',
      symbol: 'Rp. '
    });
    return fm.from(number)
  } else {
    return ''
  }

}

export const mapStickerArea = (stickerArea) => new Promise((resolve, reject) => {

  var stickers = []
  AsyncStorage.getItem(StorageKey.KEY_VEHICLE_STICKER).then(response => {
    const stickerData = JSON.parse(response)
    for (index in stickerArea) {
      const sticker = stickerData.filter(item => item.value == stickerArea[index].value)
      if (sticker.length == 1) {
        sticker[0].images = Array(sticker[0].image_report).fill(' ')
        stickers.push(sticker[0])
      }
    }
    resolve(stickers)
  })
})

export const mapReportImages = (stickerImages) => new Promise((resolve, reject) => {

  var stickers = []
  AsyncStorage.getItem(StorageKey.KEY_VEHICLE_STICKER).then(response => {
    const stickerData = JSON.parse(response)
    for (index in stickerData) {
      const stickerList = stickerImages.filter(item => item.sticker_area == stickerData[index].value)
      console.log('sticker listnya', stickerList)
      if (stickerList.length > 0) {
        const data = {
          name: stickerData[index].name,
          value: stickerData[index].name,
          images: stickerList.map(item => item.image)
        }
        stickers.push(data)
      }
    }
    resolve(stickers)
  })
})

export const range = (min, max) => {
  var len = max - min + 1;
  var arr = new Array(len);
  for (var i=0; i<len; i++) {
    arr[i] = min + i;
  }
  return arr;
}

export const getRealm = (schema) => {
  return Realm.open({
    path: 'otomedia',
    schema: [schema]
  })
}