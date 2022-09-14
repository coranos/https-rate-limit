<a name="Main"></a>

## Main : <code>object</code>
**Kind**: global namespace  

* [Main](#Main) : <code>object</code>
    * [.setAuth(authString)](#Main.setAuth) ⇒ <code>undefined</code>
    * [.sendRequest(formData)](#Main.sendRequest) ⇒ <code>any</code>
    * [.setUrl(newUrl)](#Main.setUrl) ⇒ <code>undefined</code>

<a name="Main.setAuth"></a>

### Main.setAuth(authString) ⇒ <code>undefined</code>
Sets an authorization string (http 'Authorization' header), useful if node requires api key.

**Kind**: static method of [<code>Main</code>](#Main)  
**Returns**: <code>undefined</code> - returns nothing.  

| Param | Type | Description |
| --- | --- | --- |
| authString | <code>string</code> | api key as a string |

<a name="Main.sendRequest"></a>

### Main.sendRequest(formData) ⇒ <code>any</code>
sends a request, then waits for an amount of time specified by the rate limit headers sent in the response.

**Kind**: static method of [<code>Main</code>](#Main)  
**Returns**: <code>any</code> - returns any.  

| Param | Type | Description |
| --- | --- | --- |
| formData | <code>any</code> | the form data. |

<a name="Main.setUrl"></a>

### Main.setUrl(newUrl) ⇒ <code>undefined</code>
Sets the url to use.

**Kind**: static method of [<code>Main</code>](#Main)  
**Returns**: <code>undefined</code> - returns nothing.  

| Param | Type | Description |
| --- | --- | --- |
| newUrl | <code>string</code> | url as a string |

