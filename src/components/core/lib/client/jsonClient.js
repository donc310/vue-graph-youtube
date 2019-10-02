/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

/**
* Every client should 
* 1. A search method which takes  3 mandatory parameters (query, success_callback, error_callback)
* 2. A link method  which takes  4  mandatory parameters (id ,  maxResult, success_callback, error_callback)
* 3. A getItemId method that returns the unique identifer of every item 
* 4. A extractData method 
*/
import httpGet from './client';


export default class {
    constructor(request) {
        this.client = httpGet
        this.jsonFile = request.fileName
        this.origin = request.origin;
    }
    /**
    * 
    * @param {String} itemId 
    * @param {Number} maxResults 
    * @param {Function} callback 
    * @param {Function} error 
    * @param {Object} extra 
    */
    link(itemId, maxResults, callback, error, extra) {
        const args = Object.assign({
            maxResults: (typeof maxResults === 'number' ? maxResults : 10),
            related: 1,
            relatedToItemId: itemId,
            backQuery:this.query
        }, extra)
        return this.makeRequest(args, callback, error);
    }
    /**
    * 
    * @param {String} query 
    * @param {Function} callback 
    * @param {Function} error 
    * @param {Object} extra 
    */
    search(query, callback, error, extra) {
        this.query = query
        const args = Object.assign({
            query: this.query,
            related: 0,
            maxResults: 10
        }, extra);

        return this.makeRequest(args, callback, error);
    }
    /**
     * 
     * @param {Object} data 
     */
    extractData(data) {
        const image = data.thumbnail
        const width = 60;
        const ratio = width / image.width;
        return {
            image,
            width,
            height: image.height * ratio,
            isPinned: data.isPinned,
            title: data.title,
            info: data.info
        }
    }
    /**
     * 
     * @param {Object} item 
     */
    getItemId(item) {
        return item.id;
    }

    makeRequest(request, callback, error) {
        return this.makeRequestToOrigin(request, callback, error);
    }
    makeRequestToOrigin(request, callback, error) {
        const parameters = this.buildParameters(request);
        if (parameters.length === 0) {
            throw new Error('Invalid request arguments');
        }
        const dataUrl = this.origin + (this.origin.indexOf('?') === -1 ? '?' : '&') + parameters;
        return this.client(dataUrl).then(msg => {
            callback(JSON.parse(msg));
        }).catch((err) => {
            error(err);
        });
    }
    buildParameters(request) {
        request.fname = this.jsonFile
        return Object.keys(request).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(request[key]);
        }).join('&');
    }

}