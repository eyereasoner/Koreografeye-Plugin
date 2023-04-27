import { SolidCSSAuthenticator } from "./SolidCSSAuthenticator";
import * as readline from 'readline-sync';

const args = process.argv;

if (args.length != 5) {
    usage();
} 

let name     = args[2];
let email    = args[3];
let idp      = args[4];

function usage() {
    console.log("usage: client.js name email idp");
    process.exit(1); 
}

let password = read_password();

token_client(name,email,password,idp);

function read_password() {
    let password = readline.question("Enter your password: ", { hideEchoBack: true });
    return password;
}

async function token_client(name:string, email:string, password: string, idp: string) {
    let authenticator = new SolidCSSAuthenticator({
        name: name,
        email: email,
        password: password,
        idp: idp
    } );

    await authenticator.login();
    const tokenString = authenticator.loginTokenAsString();

    console.log(tokenString); 
}