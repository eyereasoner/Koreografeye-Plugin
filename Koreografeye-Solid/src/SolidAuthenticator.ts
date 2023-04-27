/**
 * Interface of a login authenticator
 */
export interface ISolidAuthenticator {
    /**
     * Login into a Solid pod
     */
    login() : Promise<boolean> ;

    /**
     * Return the login token to a stored authenticated session (if available)
     */
    loginTokenAsString() : string | undefined;

    /**
     * Return an fetch function (possibly authenticated)
     */
    fetcher() : (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;
}