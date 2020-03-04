import { Injectable } from '@angular/core';
@Injectable()
export class AuthService {
    constructor() { }
    public isAuthenticated(): boolean {
        const token = localStorage.getItem('username');
        console.log('token' + token);
        if (token === '' || token === null) {
            return false;
        } else {
            return true;
        }
    }
}