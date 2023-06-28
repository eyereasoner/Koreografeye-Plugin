import * as N3 from 'n3';
import {
    type IPolicyType,
    PolicyPlugin
} from 'koreografeye';
import generator, { MegalodonInterface } from 'megalodon';

export class MastodonPlugin extends PolicyPlugin {
    baseurl : string | undefined;
    test = false;

    constructor(test?: boolean, baseurl? : string) {
        super();
       
        if (test) {
            this.test = test;
        }

        if (baseurl) {
            this.baseurl = baseurl;
        }
    }

    public async execute (_mainStore: N3.Store, _policyStore: N3.Store, policy: IPolicyType) : Promise<boolean> {
        this.logger.info('start');

        const bl   = policy.args['http://example.org/baseurl'];
        const toot = policy.args['http://example.org/toot'];
        const accessToken = process.env.MASTODON_ACCESS_TOKEN;

        if (bl) {
            this.baseurl = bl[0].value;
        }

        if (accessToken === undefined) {
            this.logger.error('no MASTODON_ACCESS_TOKEN defined in environment');
            return false;
        }

        if (this.baseurl === undefined) {
            this.logger.error('no baseurl in policy or configuration defined');
            return false;
        }

        if (toot === undefined) {
            this.logger.error('no toot in policy defined');
            return false;
        }

        this.logger.info(`sending toot to ${this.baseurl}`);
        this.logger.info(toot[0].value);

        if (this.test) {
            this.logger.info(`only a test skipping processing`);
            return true;
        }

        let result = false;

        try {
            const client = generator('mastodon', this.baseurl, accessToken);
            result = await this.postToot(client,toot[0].value);
        }
        catch(e) {
            this.logger.error(`failed to send data to ${this.baseurl}`);
            this.logger.error(e);
            result = false;
        }

        this.logger.info('end');

        return result;
    }

    private async postToot(client: MegalodonInterface, toot: string) : Promise<boolean> {
        const res = await client.postStatus(toot, {});
        this.logger.debug(res);
        return true;
    }
}