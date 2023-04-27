import * as N3 from 'n3';
import {
    type IPolicyType,
    PolicyPlugin
} from 'koreografeye';

export class MyDemoPlugin extends PolicyPlugin {
    name : string;

    constructor(name: string) {
        super();
        console.log('MyDemoPlugin was constructed!');
        this.name = name;
    }

    public async execute (_mainStore: N3.Store, _policyStore: N3.Store, _policy: IPolicyType) : Promise<boolean> {
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
        console.log('MyDemoPlugin execute');
        console.log(_policy);
        console.log(`name: ${this.name}`);
        return true;
    }
}