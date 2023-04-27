import * as N3 from 'n3';
import {
    type IPolicyType,
    PolicyPlugin,
    extractGraph,
    rdfTransformStore
} from 'koreografeye';
import { SolidClient } from './SolidClient';
import { ISolidAuthenticator } from './SolidAuthenticator';
import { DefaultAuthenticator } from './DefaultAuthenticator';

export class SolidPlugin extends PolicyPlugin {
    private authenticator : ISolidAuthenticator;
    
    constructor(authenticator? : ISolidAuthenticator) {
        super();
        if (authenticator) {
            this.authenticator = authenticator;
        }
        else {
            this.authenticator = new DefaultAuthenticator();
        }
    }

    public async execute (mainStore: N3.Store, _policyStore: N3.Store, policy: IPolicyType) : Promise<boolean> {
        /**
         * _mainStore contains the input RDF resource
         * _policyStore contains the policy RDF description
         * _policy contains a parsed version of the policy execution context
         *      node: the policy node
         *      path: the path to the input RDF resource
         *      policy: the identifier of the policy instance
         *      target: the identifier of the policy target
         *      mainSubject: the activity identifier of the notification
         *      origin: the path to the original notification input file
         *      args: key/value arguments for this policy
         */
        this.logger.info('start');

        const endpoint = policy.args['http://example.org/endpoint']?.value;
        const method   = policy.args['http://example.org/method']?.value;
        const body     = policy.args['http://example.org/body'];

        if (endpoint === undefined) {
            this.logger.error('no endpoint in policy defined');
            return false;
        }

        if (method === undefined) {
            this.logger.error('no method in policy defined');
            return false;
        }

        if (body === undefined) {
            this.logger.error('no body in policy defined');
            return false;
        }

        const bodyStore = extractGraph(mainStore,body);

        if (bodyStore.size) {
            this.logger.debug(`found ${bodyStore.size} triples`);
        }
        else {
            this.logger.error(`no triples found for ${body.value} in mainStore`);
            return false;
        }

        const bodyRdf = await rdfTransformStore(bodyStore, 'text/turtle');

        this.logger.info(`sending body to ${endpoint} with a ${method}`);
        this.logger.debug(bodyRdf);

        let result : boolean = false;

        if (await this.authenticator.login()) {
            this.logger.info(`logged in using ${this.authenticator.constructor.name}`);
        }
        else {
            this.logger.error(`login failed using ${this.authenticator.constructor.name}`);
            return false;
        }

        try {
            const client = new SolidClient(this.authenticator);
            result = await client.writeTextToResource(endpoint, bodyRdf, {
                'format': 'text/turtle',
                'method': method 
            });
        }
        catch(e) {
            this.logger.error(`failed to send data to ${endpoint}`);
            this.logger.error(e);
            result = false;
        }

        this.logger.info('end');

        return result;
    }
}