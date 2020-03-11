import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import HTML from 'react-native-render-html';
import StackOverflowService, {
  StackOverflowAnswer,
  StackOverflowQuestion,
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
  questionId: string;
  question: StackOverflowQuestion | undefined;
  answers: Array<StackOverflowAnswer>;
}

export default class QuestionDetail extends Component<
  QuestionDetailProps,
  QuestionDetailState
> {
  state = {
    questionId: this.props.route.params.questionId,
    question: {title: '', body: ''} as StackOverflowQuestion,
    answers: [],
  };

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    this.setState({
      question: StackOverflowService.getQuestion(this.state.questionId),
      answers: await StackOverflowService.getQuestionAnswers(
        this.state.questionId,
      ),
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          {this.state.question.title ? (
            <HTML
              html={this.state.question.title}
              baseFontStyle={styles.item}
            />
          ) : null}
        </View>
        <ScrollView style={styles.container}>
          {this.state.question.body ? (
            <HTML html={this.state.question.body} baseFontStyle={styles.item} />
          ) : null}
        </ScrollView>
        <View style={styles.container}>
          <FlatList<StackOverflowAnswer>
            data={this.state.answers}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => console.log('answer picked', item.answer_id)}>
                {item.body ? (
                  <HTML html={item.body} baseFontStyle={styles.item} />
                ) : null}
              </TouchableOpacity>
            )}
            keyExtractor={item => item.answer_id.toString()}
          />
        </View>
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
  },
  searchInput: {
    height: 40,
  },
});
