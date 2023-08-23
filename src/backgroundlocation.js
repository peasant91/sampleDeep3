import ReactNativeForegroundService from '@supersami/rn-foreground-service';
// import RNLocation from 'react-native-location';
import GetLocation, {
  Location,
  LocationErrorCode,
  isLocationError,
} from 'react-native-get-location';
import { calcDistance, sum } from './actions/helper';
import { DistanceSchema, SpeedSchema } from './data/realm/speed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendDistance } from './services/contract';
import StorageKey from './constants/StorageKey';

let locationSubscription = null;
let locationTimeout = null;

  var lastSendTraffic = 0;
  var lastSendTrafficTime = "";
  var lastSendDistance = 0;
    var currentPosition = {
        latitude: 0,
        longitude: 0,
    };

ReactNativeForegroundService.add_task(
  () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
      rationale: {
        title: 'Location permission',
        message: 'The app needs the permission to request your location.',
        buttonPositive: 'Ok',
      },
    })
      .then(newLocation => {
        console.log("NEW LOCATION", newLocation)
        onLocationChange(newLocation)
        // setLoading(false);
        // setLocation(newLocation);
      })
      .catch(ex => {
        if (isLocationError(ex)) {
          const {code, message} = ex;
          console.warn(code, message);
          // setError(code);
        } else {
          console.warn(ex);
        }
        // setLoading(false);
        // setLocation(null);
      });
    },
  {
    delay: 5000,
    onLoop: true,
    taskId: "taskid",
    onError: (e) => console.log('Error logging:', e),
  },
);

  const onLocationChange = async location => {
    console.log(currentPosition.latitude);
    const distance = currentPosition?.latitude == 0 ? 0 : calcDistance(location.latitude, location.longitude, currentPosition?.latitude, currentPosition?.longitude);

    const schema = [SpeedSchema, DistanceSchema];
    try {
      const realm = await Realm.open({
        path: 'otomedia',
        schema: schema,
      });
      realm.write(() => {
        realm.create('Speed', {
          date: Date(),
          speed: location.speed,
        });
        realm.create('Distance', {
          date: Date(),
          lat: location.latitude,
          lng: location.longitude,
          distance: distance,
        });
      });
    } catch (err) {
      console.log(err);
    }
    currentPosition = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    sendLocation(location);
  };

  const sendLocation = async location => {
    Realm.open({
      path: 'otomedia',
      schema: [SpeedSchema, DistanceSchema],
    }).then(async realm => {
      const distances = realm.objects('Distance');
      if (distances.length > 0) {
        const sums = sum(distances.map(item => item.distance));
        const sumsInMeters = (sums * 1000).toFixed(2)

        console.log("sums in meters", sumsInMeters);
        console.log("last send distance", lastSendDistance);
        console.log("distance diff", sumsInMeters - lastSendDistance);

        if ((sumsInMeters - lastSendDistance < 5)) {
          return
        }
        var isTraffic = false
        if (sumsInMeters - lastSendTraffic >= 500) {
          isTraffic = true
        }
        console.log("last sent time", lastSendTrafficTime);
        AsyncStorage.getItem(StorageKey.KEY_ACTIVE_CONTRACT).then(id => {
          sendDistance({
            lat: location.latitude,
            lng: location.longitude,
            distance: sumsInMeters, //in meter
            contract_id: id,
            last_distance: isTraffic == false ? null : lastSendDistance,
            last_date: isTraffic == false ? null : lastSendTrafficTime
          })
            .then(response => {
              console.log("response send data", response);
              if (!lastSendTrafficTime) {
                lastSendTrafficTime = response.date
              }
              if (isTraffic == true) {
                lastSendTraffic = sumsInMeters
                lastSendTrafficTime = response.date
              }
              lastSendDistance = sumsInMeters
            })
            .catch(err => { });
        });
      }
    });
  };