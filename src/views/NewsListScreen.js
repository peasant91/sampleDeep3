import React, {useState, useEffect} from 'react';
import {SafeAreaView, FlatList, Text, StatusBar, View} from 'react-native';
import NavBar from '../components/atoms/NavBar';
import translate from '../locales/translate';
import {dummyNewsData} from '../data/dummy';
import ListNews from '../components/atoms/list/ListNews';
import {ShimmerNewsList} from '../components/atoms/shimmer/Shimmer';
import {getNews} from '../services/news';
import {showDialog} from '../actions/commonActions';
import {PasswordInput} from '../components/atoms/CustomInput';

const NewsListScreen = ({navigation, route}) => {
  const [data, setData] = useState([...dummyNewsData]);
  const [isLoading, setIsLoading] = useState(true);
  const [onRefresh, setOnRefresh] = useState(false);
  const [onEndReachedCalledDuringMomentum, setOnMomentum] = useState(true)
  let page = 1;
  let canLoadMore = true

  const onPressList = item => {
    navigation.navigate('NewsDetail', {data: item})
  };

  const doGetNews = () => {
    if (canLoadMore) {
      setIsLoading(true);
      if (page == 1) {
        setData([...dummyNewsData])
      }
      getNews({page: page})
        .then(response => {
          setIsLoading(false)
          setOnRefresh(false)
          setOnMomentum(true)

          if (page == 1) {
            setData(response);
          } else {
            setData([...data, response]);
          }

          page = page + 1;
          if (page !== 1 && response.length <= 0) {
            canLoadMore = false;
          } else if (page === 1 && response.length <= 0) {
            canLoadMore = false;
          } else {
            canLoadMore = true;
          }
        })
        .catch(err => {
          setIsLoading(false);
          setData([])
          showDialog(err.message, false);
        });
    }
  };

  const onLoadMore  = () => {
    if (!onEndReachedCalledDuringMomentum) {
      doGetNews()
    }
  }

  const handleRefresh = () => {
    setOnRefresh(true)
    canLoadMore = true
    page = 1;
    doGetNews();
  };

  useEffect(() => {
    doGetNews();
  }, [route, navigation]);

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar backgroundColor="white" barStyle={'dark-content'} />
      <View style={{flex: 1}}>
        <NavBar
          navigation={navigation}
          title={translate('monthly_news')}
          style={{padding: 10}}
        />
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          refreshing={onRefresh}
          onRefresh={handleRefresh}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.1}
          onMomentumScrollBegin={() => setOnMomentum(false)}
          renderItem={({item, index}) =>
            isLoading ? (
              <ShimmerNewsList isLoading={isLoading} />
            ) : (
              <ListNews item={item} onPress={() => onPressList(item)} />
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default NewsListScreen;
