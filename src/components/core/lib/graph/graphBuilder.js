/* eslint-disable no-console */
import createGraph from 'ngraph.graph';
import ProgressToken from './ProgressToken.js';
import { ClientFactory } from "../client/clientFactory.js";

const MAX_LEVELS = 1;
const similarPerNode = 10;
const similarPerRequest = 15;
/**
 * 
 * @param {String} searchTerm 
 * @param {String} _type
 * 
 */
export function buildGraph(searchTerm, request) {
    let root, client;
    const graph = createGraph({ uniqueLinkIds: false });
    const progress = new ProgressToken();
    const loaded = new Set();
    client = ClientFactory(request)
    client.search(searchTerm, (result) => {
        onSearchComplete(result.items && result.items[0], progress);
    }, () => {
        progress.complete('No item found for your request');
    });
    return {
        progress,
        graph,
        loadMore
    };

    function loadMore(Id) {
        if (loaded.has(Id)) return;
        client.link(Id, similarPerRequest, (r) => {
            loaded.add(Id);
            if (progress.isCanceled()) {
                return;
            }
            const result = r.items;
            graph.beginUpdate();
            for (let i = 0; i < result.length; ++i) {
                const similar = result[i];
                const similarId = client.getItemId(similar);
                let hasNode = graph.getNode(similarId);
                if (!hasNode && i < similarPerNode) {
                    addNodeToGraph(similarId, similar);
                    hasNode = similar;
                }
                if (!graph.hasLink(Id, similarId) && hasNode) {
                    addLinkToGraphFiltered(similarId, Id);
                }
            }
            graph.endUpdate();
            progress.complete('');
        }, () => {
            progress.update('Could not find related items for one item.');
        });
    }
    function onSearchComplete(item, progress) {
        if (progress.isCanceled()) {
            return;
        }
        if (item) {
            progress.update('Searching related items....');
            root = item;
            root.isPinned = true;
            root.isRoot = true;
            const Id = client.getItemId(root);
            addNodeToGraph(Id, root);
            client.link(Id, 10, (r) => {
                loaded.add(Id);
                onRelatedToRootFound(r, progress);
            }, () => {
                progress.complete('Could not find related item');
            });
        } else {
            progress.complete('No response found for your request');
        }
    }
    function onRelatedToRootFound(relatedResponse, progress) {
        if (progress.isCanceled()) {
            return;
        }
        const result = relatedResponse.items;
        if (!result || result.length === 0) {
            progress.complete();
            return;
        }
        graph.beginUpdate();
        for (let i = 0; i < result.length; ++i) {
            const similar = result[i];
            addNodeToGraph(client.getItemId(similar), similar);
            addLinkToGraphFiltered(client.getItemId(similar), client.getItemId(root));
            similar.level = 0;
        }
        graph.endUpdate();
        progress.update('Found ' + result.length + ' related items. Searching more...');
        loadMissing(result, progress);
    }
    function loadMissing(itemsToProcess, progress) {
        if (progress.isCanceled()) {
            return;
        }
        if (itemsToProcess.length === 0) {
            progress.complete();
            return;
        }
        const item = itemsToProcess.shift();
        if (item.level >= MAX_LEVELS) {
            progress.complete();
            return;
        }
        const itemId = client.getItemId(item);
        client.link(itemId, similarPerRequest, (r) => {
            loaded.add(itemId);
            if (progress.isCanceled()) {
                return;
            }
            const result = r.items;
            graph.beginUpdate();

            for (let i = 0; i < result.length; ++i) {
                const similar = result[i];
                const similarId = client.getItemId(similar);
                let hasNode = graph.getNode(similarId);

                if (!hasNode && i < similarPerNode) {
                    addNodeToGraph(similarId, similar);
                    similar.level = item.level + 1;
                    itemsToProcess.push(similar);
                    hasNode = similar;
                }
                if (!graph.hasLink(itemId, similarId) && hasNode) {
                    addLinkToGraphFiltered(similarId, itemId);
                }
            }
            graph.endUpdate();
            progress.update('Found ' + graph.getNodesCount() + ' videos. Searching more...');
            loadMissing(itemsToProcess, progress);
        }, () => {
            progress.update('Could not find related items for one item. Skipping this one and searching for more...');
            loadMissing(itemsToProcess, progress);
        });
    }
    function addNodeToGraph(nodeId, data) {
        graph.addNode(nodeId, client.extractData(data));
    }
    function addLinkToGraphFiltered(linkId, rootId) {
        const link = graph.getNode(linkId);
        const root = graph.getNode(rootId);

        if (!link || !root) return;

        graph.addLink(rootId, linkId);
    }
}


