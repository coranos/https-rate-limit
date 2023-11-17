declare namespace Main {
    /**
     * Sets an authorization string (http 'Authorization' header), useful if node requires api key.
     * @param authString - api key as a string
     * @returns returns nothing.
     */
    function setAuth(authString: string): undefined;
    /**
     * sends a request, then waits for an amount of time specified by the rate limit headers sent in the response.
     * @param formData - the form data.
     * @returns returns any.
     */
    function sendRequest(formData: any): any;
    /**
     * Sets the url to use.
     * @param newUrl - url as a string
     * @returns returns nothing.
     */
    function setUrl(newUrl: string): undefined;
    /**
     * Sets the timeout to use.
     * @param newTimeout - the timeout as a number
     * @returns returns nothing.
     */
    function setTimeout(newTimeout: number): undefined;
}


export {
    setAuth,
    sendRequest,
    setUrl,
}
