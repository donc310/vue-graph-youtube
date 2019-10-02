/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

/**
* Every client should return an object with atleast four properties
* 1. A search method which takes  3 mandatory parameters (query, success_callback, error_callback)
* 2. A searchlink method  which takes  4  mandatory parameters (id ,  maxResult, success_callback, error_callback)
* 3. A getItemId method that returns the unique identifer of every item 
* 4. A extractData method 
*/
import httpGet from './client';

/**
* 
* @param {Object} video 
*/
function getItemId(item) {
    return item.id;
}
/**
* 
* @param {*} data 
*/
function extractData(data) {
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
    };
}
export default function (filename) {
    let jsonFile = filename
    const origin = 'api/v1/graphdata';
    function buildParameters(request) {
        request.fname = jsonFile
        return Object.keys(request).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(request[key]);
        }).join('&');
    }
    function makeRequestToOrigin(origin, request, callback, error) {
        const parameters = buildParameters(request);
        if (parameters.length === 0) {
            throw new Error('Invalid request arguments');
        }
        const dataUrl = origin + (origin.indexOf('?') === -1 ? '?' : '&') + parameters;
        return httpGet(dataUrl).then(msg => {
            callback(JSON.parse(msg));
        }).catch((err) => {
            error(err);
        });
    }
    function makeRequest(request, callback, error) {
        return makeRequestToOrigin(origin, request, callback, error);
    }
    /**
    * 
    * @param {String} query 
    * @param {Function} callback 
    * @param {Function} error 
    * @param {Objec} extra 
    */
    function searchJson(query, callback, error, extra) {
        const args = Object.assign({
            query: query,
            related: 0,
            maxResults: 10
        }, extra);

        return makeRequest(args, callback, error);
    }
    /**
    * 
    * @param {String} itemId 
    * @param {Number} maxResults 
    * @param {Function} callback 
    * @param {Function} error 
    */
    function findRelatedItems(itemId, maxResults, callback, error) {
        return makeRequest({
            maxResults: (typeof maxResults === 'number' ? maxResults : 10),
            related: 1,
            relatedToItemId: itemId
        }, callback, error);
    }
    return {
        search: searchJson,
        link: findRelatedItems,
        getItemId: getItemId,
        extractData: extractData
    }
}