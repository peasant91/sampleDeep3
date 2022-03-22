import React from 'react';
import {Subtitle1} from '../CustomText';
import {View, FlatList} from 'react-native';
import ListAnswers from './ListAnswers';
import {ShimmerPlaceholder} from '../shimmer/Shimmer';

const ListQuestions = ({data, selectedAnswer, onPress, isLoading, index}) => {
  const isSelected = id => {
    const answer = selectedAnswer.filter(selected => selected.answerId == id);

    console.log(`answer ${JSON.stringify(answer)}`);

    if (answer.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <View>
      <ShimmerPlaceholder isLoading={isLoading} style={{margin: 16, borderRadius: isLoading ? 16 : 0}}>
        <Subtitle1>{`${index+1}. ${data.question}`}</Subtitle1>
      </ShimmerPlaceholder>
      {data.answers.map((item, index) => {
        return <View style={{marginHorizontal: 16}}>
        <ShimmerPlaceholder isLoading={isLoading} style={{marginBottom: 8, width: '100%', borderRadius: isLoading ? 16 : 0}}>
          <ListAnswers
            isSelected={isSelected(item.id)}
            item={item}
            onPress={onPress}
            questionId={data.id}
            index={index}
          />
        </ShimmerPlaceholder>
            </View>
      })}

      <View style={{height: 10, backgroundColor: '#f4f4f4'}}></View>
    </View>
  );
};

export default ListQuestions;
