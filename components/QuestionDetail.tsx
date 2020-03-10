import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {StackOverflowQuestion} from '../services/StackOverflowService';

interface QuestionDetailState {
  question: StackOverflowQuestion;
}

export default class QuestionDetail extends Component<{}, QuestionDetailState> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.item}>Detail View</Text>
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
