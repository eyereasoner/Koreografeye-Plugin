import * as N3 from 'n3';
import * as nodemailer from 'nodemailer';
import { PolicyPlugin , type IPolicyType } from 'koreografeye';

export class SendEmailPlugin extends PolicyPlugin {
    host: string;
    port: number;
    secure: boolean;
    user: string | undefined; 
    password: string | undefined;

    constructor(host: string, port: number, secure: boolean, user?: string, password?: string) {
        super();
        this.host     = host;
        this.port     = port;
        this.secure   = secure;
        this.user     = user;
        this.password = password;
    }

    public async execute(_1: N3.Store, _2: N3.Store, policy: IPolicyType) : Promise<boolean> {
        const transportParam : any = {
            host: this.host ,
            port: this.port ,
            secure: this.secure,
            auth: {}
        }

        if (this.user) {
            transportParam['auth']['user'] = this.user;
        }

        if (this.password) {
            transportParam['auth']['pass'] = this.password;
        }
    
        const transport = nodemailer.createTransport(transportParam);

        return new Promise<boolean>( (resolve, reject) => { 
            const to      = policy.args['http://example.org/to'];
            const from    = policy.args['http://example.org/from'];
            const subject = policy.args['http://example.org/subject'];
            const body    = policy.args['http://example.org/body'];

            if (! to || ! from || ! subject || ! body) {
                console.error('Need a to, from, subject and body');
                return reject(false); 
            }

            const theTo      = to[0].value;
            const theFrom    = from[0].value;
            const theSubject = subject[0].value;
            const theBody    = body[0].value;

            const mailOptions = {
                from: theFrom,
                to: theTo,
                subject: theSubject,
                text: theBody
            };

            transport.sendMail(mailOptions, (err: any, info: any) => {
                if (err) {
                    console.log(err);
                    reject(false);
                } else {
                    console.log(info);
                    resolve(true);
                }
            });
        });
    }
}