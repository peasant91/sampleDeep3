import Config from "../constants/Config";
import Constant from "../constants/Constant";

export const getCurrentWeek = () => {
    currentdate = new Date();
    var oneJan = new Date(currentdate.getFullYear(),0,1);
    var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
    console.log(`The week number of the current date (${currentdate}) is ${result}.`);
    return result
}

export const getFullLink = (text) => {
    return Constant[Config.developmentMode].DOMAIN + text
}

export const isEmpty = (obj) => {
    for(var prop in obj) {
      if(Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
  
    return JSON.stringify(obj) === JSON.stringify({});
  }