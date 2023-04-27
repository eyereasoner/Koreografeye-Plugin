import fs from 'fs';
import { generateCSSToken, authenticateToken } from 'solid-bashlib';
import { SessionInfo } from 'solid-bashlib/dist/authentication/CreateFetch'
import * as crossfetch from 'cross-fetch';
import { type ISolidAuthenticator } from './SolidAuthenticator';

export interface ISolidAutenticationNameOptions {
    // Give a descriptive name for this login option
    name: string,
    // Email used to login
    email: string,
    // Password used to login
    password: string,
    // Location of the Solid IDP
    idp: string 
}

export interface ISolidAutenticationTokenOptions {
    // A CSS token string
    token : string 
}

/**
 * Solid CSS version of an ISolidAuthenticator. 
 * Uses client credentials to provide long lasting authenticated sessions
 */
export class SolidCSSAuthenticator implements ISolidAuthenticator {
    private options: ISolidAutenticationNameOptions | ISolidAutenticationTokenOptions;
    private token: any | undefined;
    private session: SessionInfo | undefined;

    /**
     * @param options - Solid authentication options - @range{json}
     */
    constructor(options: any) {
        if (options.token) {
            this.options = options as ISolidAutenticationTokenOptions;
        }
        else {
            this.options = options as ISolidAutenticationNameOptions;
        }
        this.token = undefined;
        this.session = undefined;
    }

    public async login() : Promise<boolean> {
        try {
            if (( this.options as ISolidAutenticationTokenOptions).token) {
                let tokenFile =  ( this.options as ISolidAutenticationTokenOptions).token;
                let tokenContent = fs.readFileSync(tokenFile,'utf-8');
                this.token = JSON.parse(tokenContent);
                this.session = await authenticateToken(
                    this.token,this.token.idp
                );
            }
            else {
                this.token = await generateCSSToken(
                    this.options as ISolidAutenticationNameOptions
                );
                this.session = await authenticateToken(
                    this.token,
                    (this.options as ISolidAutenticationNameOptions).idp
                );
            }
        }
        catch (e) {
            console.error(e);
            return false;
        }
        return true;
    }

    public loginTokenAsString() : string {
        return JSON.stringify(this.token);
    }

    public fetcher() : (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response> {
        if (this.session) {
            return this.session.fetch;
        }
        else {
            return crossfetch.fetch;
        }
    }
}