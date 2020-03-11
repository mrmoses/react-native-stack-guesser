import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import HTML from 'react-native-render-html';
import StackOverflowService, {
  StackOverflowQuestion,
} from '../services/StackOverflowService';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from 'navigation/RootNav';

type QuestionListNavigationProp = StackNavigationProp<
  RootStackParamList,
  'QuestionList'
>;

type QuestionListProps = {
  navigation: QuestionListNavigationProp;
};

interface QuestionListState {
  questions: Array<StackOverflowQuestion>;
}

export default class QuestionList extends Component<
  QuestionListProps,
  QuestionListState
> {
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
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('QuestionDetail', {
                  questionId: item.question_id,
                })
              }>
              <View style={styles.item}>
                <HTML html={item.title} baseFontStyle={styles.item} />
              </View>
            </TouchableOpacity>
          )}
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
  },
  searchInput: {
    height: 40,
  },
});
