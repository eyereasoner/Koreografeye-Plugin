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

        const endpoint = policy.args['http://example.org/endpoint'];
        const method   = policy.args['http://example.org/method'];
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

        const bodyStore = extractGraph(mainStore,body[0]);

        if (bodyStore.size) {
            this.logger.debug(`found ${bodyStore.size} triples`);
        }
        else {
            this.logger.error(`no triples found for ${body[0].value} in mainStore`);
            return false;
        }

        const bodyRdf = await rdfTransformStore(bodyStore, 'text/turtle');

        this.logger.info(`sending body to ${endpoint[0].value} with a ${method}`);
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
            result = await client.writeTextToResource(endpoint[0].value, bodyRdf, {
                'format': 'text/turtle',
                'method': method[0].value 
            });
        }
        catch(e) {
            this.logger.error(`failed to send data to ${endpoint[0].value}`);
            this.logger.error(e);
            result = false;
        }

        this.logger.info('end');

        return result;
    }
}