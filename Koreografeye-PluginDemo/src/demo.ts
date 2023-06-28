import { ComponentsManager } from 'componentsjs';
import * as path from 'path';
import * as N3 from 'n3';
import { PolicyPlugin, type IPolicyType } from 'koreografeye';

run();

async function run() {
    const manager = await ComponentsManager.build({
        mainModulePath: path.join(__dirname, '..') , // Path to your npm package's root
    });
    await manager.configRegistry.register('config.jsonld');
    const plugin = await manager.instantiate<PolicyPlugin>('http://example.org/myDemoService');

    const store1 = new N3.Store();
    const store2 = new N3.Store();
    const policy : IPolicyType = {
        node: N3.DataFactory.namedNode('http://example.org/myDemo'),
        path: './out/demo.ttl',
        policy: 'urn:policy:1234',
        target: 'http://example.org/myDemoService',
        args: {},
        order: 1
    };

    await plugin.execute(store1,store2,policy);
}