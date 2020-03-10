export interface StackOverflowQuestion {
  question_id: string;
  title: string;
}

interface StackOverflowQuestionResponse {
  items: StackOverflowQuestion[];
}

class StackOverflowService {
  private host: string = 'https://api.stackexchange.com/2.2';
  private siteParam: string = 'stackoverflow';
  private baseQueryParams = {
    order: 'desc',
    sort: 'votes',
    accepted: 'True',
    answers: '2',
    tagged: 'react-native',
  };

  private async getRequest(method: string, params: any) {
    try {
      let fullUrl = `${this.host}/${method}`;
      params.site = this.siteParam;
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
      this.baseQueryParams,
    );

    return questionResp.items;
  }

  async searchQuestions(
    searchText: String,
  ): Promise<Array<StackOverflowQuestion>> {
    let questionResp: StackOverflowQuestionResponse = await this.getRequest(
      'search/advanced',
      {
        ...this.baseQueryParams,
        title: searchText,
      },
    );

    return questionResp.items;
  }

  private createQueryString(parameters: any) {
    return Object.keys(parameters)
      .map(key => key + '=' + parameters[key])
      .join('&');
  }
}

export default new StackOverflowService();
