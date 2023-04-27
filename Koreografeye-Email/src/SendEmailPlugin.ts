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
            const to      = policy.args['http://example.org/to']?.value;
            const from    = policy.args['http://example.org/from']?.value;
            const subject = policy.args['http://example.org/subject']?.value;
            const body    = policy.args['http://example.org/body']?.value;

            if (to && from && subject && body) {
                console.log(`Sending to (${to}), from (${from}) with subject (${subject})`);
            }
            else {
                console.error('Need a to, from, subject and body');
                return reject(false);
            }

            const mailOptions = {
                from: from,
                to: to,
                subject: subject,
                text: body
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