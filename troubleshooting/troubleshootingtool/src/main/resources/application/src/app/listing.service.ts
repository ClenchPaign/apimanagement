import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchQuery } from './data-models/SearchQuery';
import { QAEntry } from './data-models/QAEntry';
import { Question } from './data-models/Question';
import { Answer } from './data-models/Answer';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })

};
const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

@Injectable()
export class ListingService {
  public category: string;
  public keyword: string;
  public id: string;
  constructor(private http: HttpClient) {
    this.getAllCategories();
    this.getQuestionsForCategory(this.category);
    this.getQuestionForID(this.id);
  }

  baseUrl = 'http://localhost:4343';
  getAllCategories() {
    return this.http.get(this.baseUrl + '/categories', httpOptions);
  }
  setCategory(cat: string) {
    this.category = cat;
  }
  getCategory() {
    return this.category;
  }
  getQuestionsForCategory(cat: string) {
    return this.http.get(this.baseUrl + '/categories/' + cat, httpOptions);
  }
  searchForKeyword(searchdata: SearchQuery) {
    console.log(searchdata);
    return this.http.post(this.baseUrl + '/search', searchdata, httpOptions);
  }

  getQuestionForID(id: string) {
    return this.http.get(this.baseUrl + '/qnas/' + id, httpOptions);
  }

  post_question(qa: QAEntry) {
    // const body = JSON.stringify(qa);
    console.log(qa);
    return this.http.post(this.baseUrl + '/qnas/', qa, { headers, responseType: 'text' });

  }
  post_answer(qa: QAEntry, id: string) {
    console.log(qa);
    console.log(this.baseUrl + '/qnas/' + id);
    return this.http.put(this.baseUrl + '/qnas/' + id, qa, httpOptions);

  }
}
