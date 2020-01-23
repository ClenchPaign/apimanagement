import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })

};

@Injectable()
export class ListingService {
  public category: string;
  constructor(private http: HttpClient) {
    this.getAllCategories();
    this.getQuestionsForCategory(this.category);
  }

  baseUrl = 'http://localhost:4343';
  getAllCategories() {
    return this.http.get(this.baseUrl + '/categories', httpOptions);
  }
  setCategory(cat : string){
    this.category = cat;
  }
  getCategory(){
    return this.category;
  }
  getQuestionsForCategory(cat: string) {
    return this.http.get(this.baseUrl + '/categories/' + cat, httpOptions);
  }
}
