import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })

};

@Injectable()
export class ListingService {
  constructor(private http: HttpClient) {
    this.getAllCategories();
  }

  baseUrl = 'http://localhost:4343';
  getAllCategories() {
    return this.http.get(this.baseUrl + '/categories', httpOptions);
  }

}
