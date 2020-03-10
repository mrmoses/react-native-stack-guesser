import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View, TextInput} from 'react-native';
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

  async executeSearch(searchText: String) {
    const qs = await StackOverflowService.searchQuestions(searchText);
    this.setState({
      questions: qs,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={[styles.searchInput, styles.item]}
          placeholder="Search"
          clearButtonMode="always"
          enablesReturnKeyAutomatically={true}
          maxLength={35}
          returnKeyType="search"
          onSubmitEditing={event => this.executeSearch(event.nativeEvent.text)}
        />
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
  searchInput: {
    height: 40,
  },
});
