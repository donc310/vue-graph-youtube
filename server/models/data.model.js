/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const Helper = require('../helpers/helper')
let items
let counter = 0
/**
 * 
 * @param {*} query 
 */
function handleQuery(query) {
    if (!Helper.JsonValidator(query.fname)) {
        //
    }
    try {
        if (query.query) {
            items = require('../data/' + query.fname + '.json').nodes

            items = items.filter((item) => {
                let title = item.title.toLowerCase().trim(),
                    queryArray = query.query.toLowerCase().trim().split(" "),
                    queryConfidence = []
                if (queryArray.length > 0) {
                    queryArray.forEach(word => {
                        if (title.indexOf(word) !== -1) {
                            return queryConfidence.push(1)
                        }
                        queryConfidence.push(0)
                    });
                }
                return queryConfidence.indexOf(1) !== -1;
            })
            items = items.sort((a, b) => {
                a.related.length < b.related.length ? 1 : - 1
            })
            items = items.slice(0, (query.maxResults ? query.maxResults : 10))
        }

        if (parseInt(query.related) === 1) {
            items = require('../data/' + query.fname + '.json').nodes

            let searchItem = items.find((x) => {
                return x.id === `${query.relatedToItemId}`
            })

            items = items.filter((item) => {
                return searchItem.related.indexOf(item.id) !== -1
            }).sort((a, b) => {
                a.related.length < b.related.length ? 1 : - 1
            })
            items = items.slice(0, (query.maxResults ? query.maxResults : 10))
        }
    } catch (err) {
        console.error(err)
    }
}
function makeBackQuery(query) {
    try {
        // load items
        items = require('../data/' + query.fname + '.json').nodes
        if (query.backQuery) {
            items = items.filter((item) => {
                let title = item.title.toLowerCase().trim(),
                    queryArray = query.backQuery.toLowerCase().trim().split(" "),
                    queryConfidence = []
                if (queryArray.length > 0) {
                    queryArray.forEach(word => {
                        if (title.indexOf(word) !== -1) {
                            return queryConfidence.push(1)
                        }
                        queryConfidence.push(0)
                    });
                }
                return queryConfidence.indexOf(1) !== -1;
            })
            items = items.sort((a, b) => {
                a.related.length < b.related.length ? 1 : - 1
            })
            items = items.slice(counter, (query.maxResults ? query.maxResults : 10))
            let searchItem = items.find((x) => {
                return x.id === `${query.relatedToItemId}`
            })
            return searchItem
        }
    } catch (err) {
        console.error(err)
    }
}
function getEntries(query) {
    handleQuery(query)
    return new Promise((resolve, reject) => {
        if (items.length === 0) {
            reject({
                message: 'No result found for query : ' + query.query ? query.query : query.relatedToItemId,
                status: 202
            })
        }
        items = items.map((item) => {
            return {
                id: item.id,
                title: item.title,
                thumbnail: item.thumbnail,
                info: item.info
            }
        })
        resolve({ items: items })
    })
}

module.exports = {
    getEntries,
}