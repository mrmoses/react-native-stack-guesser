import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Text,
  Modal,
  ViewStyle,
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
  modalVisible: boolean;
  modalMessage: string;
  modalColorStyle: ViewStyle;
}

export default class QuestionDetail extends Component<
  QuestionDetailProps,
  QuestionDetailState
> {
  state = {
    questionId: this.props.route.params.questionId,
    question: {title: '', body: ''} as StackOverflowQuestion,
    answers: [],
    modalVisible: false,
    modalMessage: '',
    modalColorStyle: {},
  };

  componentDidMount() {
    this.getQuestion();
    this.fetchData();
  }

  getQuestion() {
    this.setState({
      question: StackOverflowService.getQuestion(this.state.questionId),
    });
  }

  async fetchData() {
    const answerList = await StackOverflowService.getQuestionAnswers(
      this.state.questionId,
    );

    const randomizedAnswerList = this.reorder(answerList);

    this.setState({
      answers: randomizedAnswerList,
    });
  }

  // Randomizes the order of the items in an array
  private reorder(list: Array<any>) {
    // loop from the end
    for (let iteration = list.length; iteration > 1; iteration--) {
      const currentIndex = iteration - 1;
      // temp save of current item
      const currentItem = list[currentIndex];

      // pick a random index remaining (smaller than the current iteration)
      const randomIndex = Math.floor(Math.random() * iteration);

      // swap the two items
      list[currentIndex] = list[randomIndex];
      list[randomIndex] = currentItem;
    }
    return list;
  }

  selectAnswer(selectedAnswer: StackOverflowAnswer) {
    this.setState({
      modalVisible: true,
      modalMessage: selectedAnswer.is_accepted
        ? 'Correct!'
        : 'Wrong :(\nPlease try again.',
      modalColorStyle: {
        backgroundColor: selectedAnswer.is_accepted ? '#008800' : '#880000',
      },
    });
  }

  closeModal() {
    this.setState({
      modalVisible: false,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}>
          <View style={styles.modalOuter}>
            <View style={styles.container} />
            <View style={[styles.modalInner, this.state.modalColorStyle]}>
              <Text>{this.state.modalMessage}</Text>
              <TouchableOpacity onPress={() => this.closeModal()}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.container} />
          </View>
        </Modal>
        <View style={styles.questionHeaderContainer}>
          <Text style={styles.label}>Question</Text>
          {this.state.question.title ? (
            <HTML
              html={this.state.question.title}
              baseFontStyle={styles.questionTitle}
            />
          ) : null}
          <ScrollView style={styles.questionBodyContainer}>
            {this.state.question.body ? (
              <HTML
                html={this.state.question.body}
                baseFontStyle={styles.questionBody}
              />
            ) : null}
          </ScrollView>
        </View>
        <View style={styles.questionAnswerContainer}>
          <Text style={styles.answersHeader}>Answers</Text>
          <FlatList<StackOverflowAnswer>
            data={this.state.answers}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={styles.answerItem}
                onPress={() => this.selectAnswer(item)}>
                <Text style={styles.label}>Answer {index + 1}</Text>
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
  },
  questionHeaderContainer: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomColor: '#000000',
    borderBottomWidth: 2,
  },
  label: {
    fontSize: 14,
    color: '#888888',
  },
  questionTitle: {
    fontSize: 22,
  },
  questionBodyContainer: {
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderTopColor: '#BBBBBB',
    borderTopWidth: 1,
  },
  questionBody: {
    fontSize: 18,
  },

  questionAnswerContainer: {
    flex: 2,
  },
  answersHeader: {
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  answerItem: {
    padding: 10,
    paddingTop: 40,
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
  item: {
    padding: 10,
    fontSize: 18,
  },
  searchInput: {
    height: 40,
  },
  modalOuter: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(50,50,50,0.4)',
  },
  modalInner: {
    padding: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
});
