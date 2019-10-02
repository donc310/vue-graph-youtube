/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

/**
* Every client should return an object with atleast four properties
* 1. A search method which takes  3 mandatory parameters (query, success callback, error callback)
* 2. A search link method takes  3 mandatory parameters (query, error callabck, error callback)
* 3. A getItemId method that returns the unique identifer of every item 
* 4. A extractData method 
*/
import httpGet from './client';
const key = 'AIzaSyDRDvZjoo_7fzqQ4ImvEASwLfFIhQ7lRgU';
const origin = 'https://www.googleapis.com/youtube/v3/';

function buildParameters(request) {
    request.key = key;
    request.type = 'video';
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
        console.log(msg)
        callback(JSON.parse(msg));
    }).catch((err) => {
        console.log('Caught error', err);
        error(err);
    });
}

function makeRequest(request, callback, error) {
    return makeRequestToOrigin(origin + 'search', request, callback, error);
}



/**
* 
* @param {String} query 
* @param {Function} callback 
* @param {Function} error 
* @param {Objec} extra 
*/
function searchVideos(query, callback, error, extra) {
    const args = Object.assign({
        part: 'snippet',
        q: query,
        maxResults: 10
    }, extra);

    return makeRequest(args, callback, error);
}
/**
* 
* @param {String} videoId 
* @param {Number} maxResults 
* @param {Function} callback 
* @param {Function} error 
*/
function findRelatedVideos(videoId, maxResults, callback, error) {
    return makeRequest({
        part: 'snippet',
        maxResults: (typeof maxResults === 'number' ? maxResults : 10),
        relatedToVideoId: videoId
    }, callback, error);
}
/**
 * 
 * @param {Object} video 
 */
function getVideoId(video) {
    return video.id.videoId;
}
/**
 * 
 * @param {*} data 
 */
function extractData(data) {
    const image = data.snippet.thumbnails.medium;
    const width = 60;
    const ratio = width / image.width;
    return {
        image,
        width,
        height: image.height * ratio,
        isPinned: data.isPinned,
        title: data.snippet.title,
        info: {}
    };
}
export default {
    search: searchVideos,
    link: findRelatedVideos,
    getItemId: getVideoId,
    extractData: extractData


}