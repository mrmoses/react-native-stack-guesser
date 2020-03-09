import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import StackOverflowService, {
  StackOverflowQuestion,
} from '../services/StackOverflowService';

interface QuestionListState {
  questions: Array<StackOverflowQuestion>;
}

export default class QuestionList extends Component<{}, QuestionListState> {
  state = {
    questions: [],
  };

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    this.setState({questions: await StackOverflowService.getQuestions()});
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList<StackOverflowQuestion>
          data={this.state.questions}
          renderItem={({item}) => <Text style={styles.item}>{item.title}</Text>}
          keyExtractor={item => item.question_id.toString()}
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
});
