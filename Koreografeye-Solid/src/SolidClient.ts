import { Store } from "n3";
import { type ISolidAuthenticator } from "./SolidAuthenticator";
import { parseContentType, TEXT_TURTLE } from "@solid/community-server";
import { parseStringAsN3Store , rdfTransformStore } from 'koreografeye';
import { DefaultAuthenticator } from "./DefaultAuthenticator";

export class SolidClient {
    private readonly authenticator : ISolidAuthenticator;

    public constructor(authenticator?: ISolidAuthenticator) {
        if (authenticator) {
            this.authenticator = authenticator;
        }
        else {
            this.authenticator = new DefaultAuthenticator();
        }
    }

    public async readResource(resourceUrl: string, options?: any): Promise<Store> {
        let contentType = TEXT_TURTLE;

        if (options && options['format']) {
            contentType = options['format'];
        }

        const fetcher = this.authenticator.fetcher();
        const response = await fetcher(resourceUrl, {
            headers: {
                'accept': contentType
            }
        });

        const contentTypeHeader = parseContentType(response.headers.get('content-type') ?? '');

        const store = await parseStringAsN3Store(
                            await response.text(),
                            { format: contentTypeHeader }
                        );

        return store;
    }

    public async writeStoreToResource(resourceUrl: string, store: Store, options?: any): Promise<boolean> {
        let contentType = TEXT_TURTLE;
        let method = 'PUT';

        if (options) {
            if (options['format']) {
                contentType = options['format'];
            }
            if (options['method']) {
                method = options['method'];
            }
        }

        const text = await rdfTransformStore(store, contentType);

        const fetcher = this.authenticator.fetcher();
        const response = await fetcher(resourceUrl, {
            method: method,
            headers: {
                'content-type': contentType
            },
            body: text
        });

        if (response.ok) {
            return true;
        }
        else {
            throw new Error(await response.text());
        }
    }

    public async writeTextToResource(resourceUrl: string, text: string, options?: any): Promise<boolean> {
        let contentType = TEXT_TURTLE;
        let method = 'PUT';

        if (options) {
            if (options['format']) {
                contentType = options['format'];
            }
            if (options['method']) {
                method = options['method'];
            }
        }

        const fetcher = this.authenticator.fetcher();
        const response = await fetcher(resourceUrl, {
            method: method,
            headers: {
                'content-type': contentType
            },
            body: text
        });

        if (response.ok) {
            return true;
        }
        else {
            throw new Error(await response.text());
        }
    }

}