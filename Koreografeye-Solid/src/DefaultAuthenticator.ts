import { 
    ISolidAuthenticator 
} from './SolidAuthenticator';
import * as crossfetch from 'cross-fetch';

/**
 * Solid CSS version of an ISolidAuthenticator. 
 * Uses client credentials to provide long lasting authenticated sessions
 */
export class DefaultAuthenticator implements ISolidAuthenticator {

    public async login() : Promise<boolean> {
        return true;
    }

    public loginTokenAsString() : string | undefined {
        return undefined;
    }

    public fetcher() : (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response> {
        return crossfetch.fetch;
    }
}