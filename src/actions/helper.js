
export const getCurrentWeek = () => {
    currentdate = new Date();
    var oneJan = new Date(currentdate.getFullYear(),0,1);
    var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
    console.log(`The week number of the current date (${currentdate}) is ${result}.`);
    return result
}