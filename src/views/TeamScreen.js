import React, {useReducer, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native';
import {} from 'react-native';
import CustomButton from '../components/atoms/CustomButton';
import CustomInput, {MemberInput} from '../components/atoms/CustomInput';
import {Subtitle1} from '../components/atoms/CustomText';
import ListMember from '../components/atoms/list/ListMember';
import NavBar from '../components/atoms/NavBar';
import Colors from '../constants/Colors';
import translate from '../locales/translate';
import memberReducer from '../reducers/memberReducer';

const dummyData = [
  {
    name: '',
    nrp: '',
  },
  {
    name: '',
    nrp: '',
  },
  {
    name: '',
    nrp: '',
  },
  {
    name: '',
    nrp: '',
  },
];

const TeamScreen = ({navigation, route}) => {
  const {prevState} = route.params;
  const [memberData, setMemberData] = useState(
    prevState ? prevState.inputValues.members : dummyData,
  );
  const [formState, dispatch] = useReducer(
    memberReducer,
    prevState
      ? prevState
      : {
          inputValues: {
            members: [
              {
                name: '',
                nrp: '',
              },
            ],
          },
          inputValidities: {
            members: [false, true, true, true, true],
          },
          isChecked: false,
          formIsValid: false,
        },
  );

  const onSaveMember = () => {
    dispatch({
      type: 'check',
    });

    console.log('states', formState);
    if (formState.formIsValid) {
      navigation.navigate({
        name: 'PBFormExtended',
        params: {membersState: formState},
        merge: true,
      });
    }
  };

  const addMember = () => {
    if (memberData.length < 12) {
      setMemberData([
        ...memberData,
        {
          name: '',
          nrp: '',
        },
      ]);
    }
  };

  return (
    <SafeAreaView>
      <NavBar
        title={translate('team_structure')}
        navigation={navigation}
        shadowEnabled
      />
      <ScrollView style={{backgroundColor: 'white', flexGrow: 1}}>
        <View style={{backgroundColor: 'white'}}>
          <Subtitle1 style={{padding: 16}}>
            {translate('pb_saving_extended_title')}
            <Subtitle1 style={{color: 'red'}}>*</Subtitle1>
          </Subtitle1>

          <MemberInput
            id={'leader_name'}
            containerStyle={{paddingHorizontal: 16}}
            nameTitle={translate('project_leader_title')}
            namePlaceholder={translate('team_placeholder')}
            nameValue={formState.inputValues.members[0].name}
            nrpTitle={translate('leader_nrp_title')}
            nrpPlaceholder={translate('nrp_placeholder')}
            nrpValue={formState.inputValues.members[0].nrp}
            index={0}
            dispatcher={dispatch}
            isCheck={formState.isChecked}
            required
          />
          <Subtitle1 style={{paddingTop: 16, paddingHorizontal: 16}}>
            {translate('fill_team_member')}
            <Subtitle1 style={{color: 'red'}}>*</Subtitle1>
          </Subtitle1>
          <FlatList
            style={{flexGrow: 1}}
            scrollEnabled={false}
            data={memberData}
            renderItem={({index, item}) => {
              if (index <= 11) {
                return (
                  <ListMember
                    index={index + 1}
                    dispatch={dispatch}
                    nameValue={
                      formState.inputValues.members[index + 1]?.name ?? ''
                    }
                    nrpValue={
                      formState.inputValues.members[index + 1]?.nrp ?? ''
                    }
                    isCheck={formState.isChecked}
                  />
                );
              }
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              padding: 16,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity onPress={addMember}>
              <Subtitle1 style={{color: Colors.primary}}>
                {translate('add_members')}
              </Subtitle1>
            </TouchableOpacity>
            <Subtitle1
              style={{
                color: Colors.secondText,
              }}>{`(${memberData.length >= 12 ? 12 : memberData.length}/12)`}</Subtitle1>
          </View>
          <View style={{height: 10, backgroundColor: Colors.divider}} />
          <CustomButton
            types="primary"
            containerStyle={{
              marginBottom: 75,
              marginTop: 16,
              marginHorizontal: 16,
            }}
            title={translate('save')}
            onPress={onSaveMember}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TeamScreen;
