import YoutubeClient from "./youtubeClient";
import JsonCient from "./jsonClient"
const clients = {
    youtube: YoutubeClient
}

export const ClientFactory = {
    /**
    * @param string 
    */
    get: name => clients[name],
    /**
     * 
     */
    make: (obj) => {
        if (obj.type && obj.type === "json") {
            return obj.filename ? JsonCient(obj.filename) : null
        }
    },
};