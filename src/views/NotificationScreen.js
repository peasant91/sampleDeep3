import React, {useEffect, useRef, useState} from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';
import ListNotification from '../components/atoms/list/ListNotification';
import NavBar from '../components/atoms/NavBar';
import translate from '../locales/translate';
import {
  getNotification,
  readAllNotif,
  readNotif,
} from '../services/notification';

import IconEmpty from '../assets/images/ic_empty_notification';
import {LatoBold, LatoRegular} from '../components/atoms/CustomText';
import Colors from '../constants/Colors';
import {showDialog} from '../actions/commonActions';
import {ShimmerNotifContainer} from '../components/atoms/shimmer/Shimmer';
import {useIsFocused} from '@react-navigation/native';

const NotificationScreen = ({navigation, route}) => {
  const page = useRef(1);

  const [canLoadMore, setcanLoadMore] = useState(true);
  const [data, setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocus = useIsFocused();

  const navigateNotification = item => {
    switch (item.notif_type) {
      case 'App\\Models\\User\\Driver':
        navigation.navigate('Account');
        break;
      case 'App\\Models\\Vehicle\\Vehicle':
        navigation.navigate('Account');
        break;
      case 'App\\Models\\User\\User':
        navigation.navigate('Account');
        break;
    }
  };

  const readNotification = item => {
    readNotif()
      .then(() => {})
      .catch(err => {
        showDialog(err.message);
      });
  };

  const getNotificationAPI = () => {
    if (page.current == 1) {
      setIsLoading(true);
    }

    if (canLoadMore) {
      getNotification({
        page: page.current,
      })
        .then(response => {
          if (response.length <= 0) {
            setcanLoadMore(false);
          }

          if (page.current == 1) {
            setIsLoading(false);
            setdata(response);
          } else {
            setdata([...data, ...response]);
          }
          page.current += 1;
          readAllNotif()
            .then(response => {
              console.log('success read all notif');
            })
            .catch(err => {
              setIsLoading(false);
              showDialog(err.message);
            });
        })
        .catch(err => {
          setIsLoading(false);
          showDialog(err.message);
        });
    }
  };

  useEffect(() => {
    if (isFocus) {
      getNotificationAPI();
      readNotification();
    }
  }, [isFocus]);

  const EmptyNotif = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 30,
        }}>
        <IconEmpty />
        <LatoBold containerStyle={{marginVertical: 10}}>
          {translate('empty_notif_title')}
        </LatoBold>
        <LatoRegular
          style={{textAlign: 'center', fontSize: 12, color: Colors.grey}}>
          {translate('empty_notif_desc')}
        </LatoRegular>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <NavBar
        title={translate('notification')}
        shadowEnabled
        navigation={navigation}
      />
      {isLoading ? (
        <ShimmerNotifContainer containerStyle={{marginHorizontal: 16}} />
      ) : data.length == 0 ? (
        <EmptyNotif />
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          onEndReached={getNotificationAPI}
          onEndReachedThreshold={0.5}
          renderItem={({item, index}) => {
            return (
              <ListNotification
                data={item}
                onPress={() => navigateNotification(item)}
              />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;
