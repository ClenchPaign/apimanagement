import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchQuery } from './data-models/SearchQuery';
import { QAEntry } from './data-models/QAEntry';
import { Question } from './data-models/Question';
import { Answer } from './data-models/Answer';
import { User } from './data-models/User';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};
const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

@Injectable()
export class ListingService {
  public category: string;
  public tags: string[];
  public keyword: string;
  public id: string;

  constructor(private http: HttpClient) {
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
  setTags(tagsFromSearch: string[]) {
    this.tags = tagsFromSearch;
  }
  getTagsFromSearch(): string[] {
    return this.tags;
  }
  getAllTags() {
    return this.http.get(this.baseUrl + '/tags', httpOptions);
  }
  getQuestionsForCategory(cat: string, from: number, size: number) {
    console.log('cat-' + cat + ' from-' + from + ' size-' + size);
    return this.http.get(this.baseUrl + '/categories/' + cat + '/' + from + '/' + size, httpOptions);
  }
  searchForKeyword(searchdata: SearchQuery, from: number, size: number) {
    // console.log(searchdata);
    console.log(this.baseUrl + '/search/' + from + '/' + size);
    return this.http.post(this.baseUrl + '/search/' + from + '/' + size, searchdata, { headers, responseType: 'json' });
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
    // console.log(this.baseUrl + '/qnas/' + id);
    return this.http.put(this.baseUrl + '/qnas/' + id, qa, httpOptions);
  }
  upload_files(file: any) {
    // console.log('In listing service' + JSON.stringify(file));
    return this.http.post(this.baseUrl + '/upload', JSON.stringify(file), { headers, responseType: 'text' });
  }

  get_files(id: string) {
    // console.log('In listing service' + JSON.stringify(file));
    return this.http.get(this.baseUrl + '/files/' + id, httpOptions);
  }

  getAuthstatus(user: User) {
    console.log(user);
    return this.http.post(this.baseUrl + '/auth/', user, { headers, responseType: 'text' });
  }

  logout() {
    return this.http.post(this.baseUrl + '/logout', '', { headers, responseType: 'text' });
  }

  getAllReviewQuestions() {
    return this.http.get(this.baseUrl + '/review', httpOptions);
  }


  approve_question(qa: QAEntry, id: string) {
    return this.http.post(this.baseUrl + '/approve/' + id, qa, { headers, responseType: 'text' });
  }

  reject_question(id: string) {
    return this.http.delete(this.baseUrl + '/approve/reject/' + id, { headers, responseType: 'text' });
  }

  getReviewQuestionForID(id: string) {
    return this.http.get(this.baseUrl + '/review/' + id, httpOptions);
  }
}
