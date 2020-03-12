export interface StackOverflowQuestion {
  question_id: string;
  title: string;
  body: string;
}
export interface StackOverflowAnswer {
  answer_id: string;
  body: string;
  is_accepted: boolean;
}

interface StackOverflowQuestionResponse {
  items: StackOverflowQuestion[];
}
interface StackOverflowAnswerResponse {
  items: StackOverflowAnswer[];
}

class StackOverflowService {
  private host: string = 'https://api.stackexchange.com/2.2';
  private siteParam: string = 'stackoverflow';
  private baseQuestionSearchQueryParams = {
    order: 'desc',
    sort: 'votes',
    accepted: 'True',
    answers: '2',
    tagged: 'react-native',
  };

  private questionCache: Array<StackOverflowQuestion> = [];

  private async getRequest(method: string, params?: any) {
    try {
      let fullUrl = `${this.host}/${method}`;

      params = params || {};
      params.site = this.siteParam;
      params.filter = 'withbody';

      fullUrl += '?' + this.createQueryString(params);

      let response = await fetch(fullUrl);
      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getQuestions(): Promise<Array<StackOverflowQuestion>> {
    let questionResp: StackOverflowQuestionResponse = await this.getRequest(
      'search/advanced',
      this.baseQuestionSearchQueryParams,
    );

    this.questionCache = questionResp.items;
    return this.questionCache;
  }

  getQuestion(questionId: string): StackOverflowQuestion | undefined {
    return this.questionCache.find(q => q.question_id === questionId);
  }

  async searchQuestions(
    searchText: String,
  ): Promise<Array<StackOverflowQuestion>> {
    let questionResp: StackOverflowQuestionResponse = await this.getRequest(
      'search/advanced',
      {
        ...this.baseQuestionSearchQueryParams,
        title: searchText,
      },
    );

    this.questionCache = questionResp.items;
    return this.questionCache;
  }

  async getQuestionAnswers(
    questionId: string,
  ): Promise<Array<StackOverflowAnswer>> {
    let answerResp: StackOverflowAnswerResponse = await this.getRequest(
      `questions/${questionId}/answers`,
    );

    return answerResp.items;
  }

  private createQueryString(parameters: any) {
    return Object.keys(parameters)
      .map(key => key + '=' + parameters[key])
      .join('&');
  }
}

export default new StackOverflowService();
