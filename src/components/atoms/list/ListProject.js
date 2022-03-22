import React from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';
import Colors from '../../../constants/Colors';
import ProjectIcon from '../../../assets/images/ic_project.svg';
import HashtagIcon from '../../../assets/images/ic_hashtag.svg';
import {Desc1, Desc2, MainTitle, Subtitle2} from '../CustomText';
import translate from '../../../locales/translate';
import moment from 'moment';
import {TouchableOpacity} from '@gorhom/bottom-sheet';

const ListProject = ({item, onPress, isHome}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <HashtagIcon />
          <View style={{flex: 1, marginHorizontal: 5}}>
            <Desc2>{translate('project_number_title')}</Desc2>
            <Subtitle2 style={{fontFamily: 'Lato-Bold', marginTop: 5}}>
              {item.project_number ? item.project_number : '-'}
            </Subtitle2>
          </View>
          <View>

          {/* <Desc2>{translate('send_date')}<Desc2>{moment(item.created_at).format('DD MMM yyyy')}</Desc2></Desc2> */}
          {item.presentation_date ? 
          <Desc2>{moment(item.presentation_date).format('DD MMM yyyy')}</Desc2>
          : <View/>
          }
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 16}}>
          <ProjectIcon />
          <View style={{flex: 1, marginHorizontal: 5}}>
            <Desc2>{translate('project_name_title')}</Desc2>
            <Subtitle2 style={{fontFamily: 'Lato-Bold', marginTop: 5}}>
              {item.project_name ? item.project_name : '-'}
            </Subtitle2>
          </View>
          <View style={styles.pickProject}>
            <Desc1 style={{color: Colors.primary}}>
              {translate(isHome ? 'see_project' : 'pick_project')}
            </Desc1>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    marginHorizontal: 16,
    backgroundColor: 'white',
    padding: 16,
  },
  pickProject: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderColor: Colors.primary,
    borderWidth: 1,
    alignSelf: 'flex-end',
  },
});

export default ListProject;
