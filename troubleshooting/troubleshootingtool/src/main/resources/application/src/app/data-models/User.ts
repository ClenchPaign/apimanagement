export class User{
    public username: string;
    public password: string;
    public email: string;
    public isAdmin:boolean;

    constructor(username: string,password: string,email: string,isAdmin:boolean ) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.isAdmin=isAdmin;
    }
    
}