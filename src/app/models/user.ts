
export class User {

    firstname: string;
    lastname: string;
    email: string;
    password: string;

    constructor(first_name: string, last_name: string, email: string, password: string) {
        this.firstname = first_name;
        this.lastname = last_name;
        this.email = email;
        this.password = password;
    }
}
