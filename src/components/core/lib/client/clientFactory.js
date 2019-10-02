import YoutubeClient from "./youtubeClient";
import JsonCient from "./jsonClient";
const clients = {
    youtube: YoutubeClient
}

function get(name) {
    if (!clients.hasOwnProperty(name)) {
        throw new Error('');
    }
    return clients[name]
}
function make(obj) {
    if (obj.type && obj.type === "json") {
        return obj.fileName && obj.origin ?  new JsonCient(obj) : null
    }
    throw new Error('');

}

export function ClientFactory(param) {
    if (typeof param === "string") return get(param);
    return make(param);

}
