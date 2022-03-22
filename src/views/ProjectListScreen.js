import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {View} from 'react-native';
import {Subtitle1, Subtitle2} from '../components/atoms/CustomText';
import ListProject from '../components/atoms/list/ListProject';
import NavBar from '../components/atoms/NavBar';
import translate from '../locales/translate';
import NoProjectImage from '../assets/images/img_no_project';
import Colors from '../constants/Colors';
import CustomButton from '../components/atoms/CustomButton';
import CustomSheet from '../components/atoms/CustomSheet';

import ChevronRightIcon from '../assets/images/ic_chevron_right.svg';
import ExtendedIcon from '../assets/images/ic_extended_form.svg';
import SimpleIcon from '../assets/images/ic_simple_form.svg';
import {getProjectList} from '../services/project';
import {showDialog} from '../actions/commonActions';
import {ShimmerProjectList} from '../components/atoms/shimmer/Shimmer';
import {useIsFocused} from '@react-navigation/native';

const dummyProject = [
  {
    id: 1,
    project_number: 'PRYK.1241234',
    created_at: '2021-01-01',
    project_name: 'Proyek Jawa Bali',
  },
  {
    id: 2,
    project_number: 'PRYK.1241234',
    created_at: '2021-01-01',
    project_name: 'Proyek Jawa Bali',
  },
  {
    id: 3,
    project_number: 'PRYK.1241234',
    created_at: '2021-01-01',
    project_name: 'Proyek Jawa Bali',
  },
  {
    id: 4,
    project_number: 'PRYK.1241234',
    created_at: '2021-01-01',
    project_name: 'Proyek Jawa Bali',
  },
  {
    id: 5,
    project_number: 'PRYK.1241234',
    created_at: '2021-01-01',
    project_name: 'Proyek Jawa Bali',
  },
];

const ProjectListScreen = ({navigation, route}) => {
  const [data, setData] = useState(dummyProject);
  const {isProjectList} = route.params;
  const pbSavingModalRef = useRef(null);
  const [isLoading, setisLoading] = useState(true);
  var mounted = true;
  const isFocused = useIsFocused();

  const dismissFormPicker = () => {
    pbSavingModalRef.current.close();
  };

  const getProjectListApi = () => {
    getProjectList()
      .then(response => {
        setData(response);
        setisLoading(false);
        console.log('responsenya', response);
      })
      .catch(err => {
        setData([]);
        setisLoading(false);
        showDialog(err.message);
      });
  };

  // useEffect(() => {
  //   return () => {
  //     mounted = false;
  //   };
  // }, [route]);

  useEffect(() => {
    mounted = true;
    if (isFocused) {
      getProjectListApi();
    }

    return () => {
      mounted = false;
    };
  }, [isFocused]);

  const onPressList = item => {
    if (isProjectList) {
      if (item.is_full === 0) {
        navigateToDetail(item);
      } else {
        navigateToExtendedDetail(item);
      }
    } else {
      navigation.navigate('ScheduleForm', {data: item});
    }
  };

  const navigateToDetail = item => {
    navigation.navigate('PBDetail', {item: item});
  };

  const navigateToExtendedDetail = item => {
    navigation.navigate('PBExtendedDetail', {item: item});
  };

  const EmptyProject = () => {
    return (
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        <View style={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
          <NoProjectImage />
          <Subtitle1
            style={{
              textAlign: 'center',
              marginTop: 24,
              fontFamily: 'Lato-Bold',
            }}>
            {translate('no_project_title')}
          </Subtitle1>
          <Subtitle2
            style={{
              textAlign: 'center',
              marginTop: 10,
              marginHorizontal: 40,
              color: Colors.secondText,
            }}>
            {translate('no_project_desc')}
          </Subtitle2>
        </View>
        <CustomButton
          containerStyle={{padding: 16, marginTop: 24}}
          types={'primary'}
          title={translate('make_new_project')}
          onPress={() => pbSavingModalRef.current.expand()}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <NavBar
        title={translate('your_project_list')}
        navigation={navigation}
        shadowEnabled
      />
      {data.length <= 0 ? (
        <EmptyProject />
      ) : (
        <ScrollView style={{flex: 1}}>
          <View>
            {!isProjectList ? (
              <Subtitle1 style={{marginTop: 16, marginHorizontal: 16}}>
                {translate('choose_project')}
                <Subtitle1 style={{color: 'red'}}>*</Subtitle1>
              </Subtitle1>
            ) : (
              <View />
            )}
            <FlatList
              style={{marginTop: 16}}
              data={data}
              scrollEnabled={false}
              keyExtractor={item => item.id}
              renderItem={({index, item}) => {
                return !isLoading ? (
                  <ListProject
                    item={item}
                    onPress={() => onPressList(item)}
                    isHome={isProjectList}
                  />
                ) : (
                  <ShimmerProjectList isLoading={isLoading} />
                );
              }}
            />
          </View>
        </ScrollView>
      )}
      <CustomSheet ref={pbSavingModalRef}>
        <View style={{margin: 16}}>
          <Subtitle1 style={{marginTop: 10}}>
            {translate('form_pick_title')}
          </Subtitle1>
          <Subtitle2 style={{marginVertical: 10, color: Colors.secondText}}>
            {translate('form_pick_description')}
          </Subtitle2>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('PBForm');
              dismissFormPicker();
            }}
            style={[styles.bottomPickContainer]}>
            <SimpleIcon />
            <Subtitle2
              style={{
                fontFamily: 'Lato-Bold',
                flex: 1,
                marginHorizontal: 16,
              }}>
              {translate('pb_saving_form_simple')}
            </Subtitle2>
            <ChevronRightIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('PBFormExtended');
              dismissFormPicker();
            }}
            style={[styles.bottomPickContainer, {marginVertical: 16}]}>
            <ExtendedIcon />
            <Subtitle2
              style={{
                fontFamily: 'Lato-Bold',
                flex: 1,
                marginHorizontal: 16,
              }}>
              {translate('pb_saving_form_extended')}
            </Subtitle2>
            <ChevronRightIcon />
          </TouchableOpacity>
          <CustomButton
            containerStyle={{marginTop: 10}}
            types="primary"
            title={translate('cancel')}
            onPress={dismissFormPicker}
          />
        </View>
      </CustomSheet>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.primary,
  },
  mainContainer: {
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#F4F4F4',
  },
  divider: {
    marginTop: 16,
    backgroundColor: '#F4F4F4',
    height: 10,
  },
  bottomPickContainer: {
    borderColor: Colors.primary,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    backgroundColor: 'white',
  },
  topCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: '100%',
    backgroundColor: 'white',
    marginTop: 16,
  },
  startButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
    backgroundColor: Colors.primary,
    paddingVertical: 7,
    paddingHorizontal: 16,
  },
});

export default ProjectListScreen;
