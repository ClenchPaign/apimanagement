export class User {
    public userID: string;
    public username: string;
    public password: string;
    public email: string;
    public isAdmin: boolean;
    public isAuthenticated: boolean;

    constructor(username: string, userID: string, password: string, email: string, isAdmin: boolean, isAuthenticated: boolean) {
        this.userID = userID;
        this.username = username;
        this.password = password;
        this.email = email;
        this.isAdmin = isAdmin;
        this.isAuthenticated = isAuthenticated;
    }

}