import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import StackOverflowService, {
  StackOverflowAnswer,
} from '../services/StackOverflowService';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from 'navigation/RootNav';

type QuestionDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'QuestionDetail'
>;
type QuestionDetailRouteProp = RouteProp<RootStackParamList, 'QuestionDetail'>;

type QuestionDetailProps = {
  navigation: QuestionDetailNavigationProp;
  route: QuestionDetailRouteProp;
};

interface QuestionDetailState {
  answers: Array<StackOverflowAnswer>;
}

export default class QuestionDetail extends Component<
  QuestionDetailProps,
  QuestionDetailState
> {
  state = {
    answers: [],
  };

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    this.setState({
      answers: await StackOverflowService.getQuestionAnswers(
        this.props.route.params.questionId,
      ),
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.item}>Detail View</Text>
        <FlatList<StackOverflowAnswer>
          data={this.state.answers}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => console.log('answer picked', item.answer_id)}>
              <Text style={styles.item}>{item.body}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.answer_id.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  searchInput: {
    height: 40,
  },
});
