import { KStreamSourceNode,Node } from '../Node/node.js';
import { SelectKey } from '../Node/ParentNode/SelectKey.js';
import { TopicSimple } from '../Node/ParentNode/TopicSimple.js';
import { TopicAdvanced } from '../Node/ParentNode/TopicAdvanced.js';
import  {Map as MapNode} from "../Node/ParentNode/Map.js"

let nodeMap = new Map();
export function processName(n) {
    return n.trim().replace(/"/g, '').replace(/\s+/g, '');
}

export function getOrCreateNode(n, type) {
    const processedName = processName(n);
    console.log("name ? ", processedName, type)
    if (!nodeMap.has(processedName)) {
        let node;
        switch (type.toLowerCase()) {
            case 'source':
                node = new KStreamSourceNode(processedName);
                break;
            case 'processor':
                console.log("processor ?")
                node = new MapNode(`Proc:${processedName}`);
                break;
            case 'sink':
                node = new KStreamSourceNode(`Sink:${processedName}`);
                break;
            case 'store':
                node = new Node(`Store:${processedName}`);
                break;
            case 'topic':
                node = new TopicAdvanced(`${processedName}`)
                break;
            default:
                node = new SelectKey(processedName);
        }
        nodeMap.set(processedName, node);
    }
    return nodeMap.get(processedName);
};

function extractTopics(line) {
    // Format: topic: [topic1,topic2] or topics: [topic1,topic2]
    // or: topic: topic1 or topics: topic1
    if (line.includes('topic:') || line.includes('topics:')) {
      let topicPart = '';
      
      // Determine if we're dealing with the topic: or topics: part
      const topicIdx = line.indexOf('topic:');
      const topicsIdx = line.indexOf('topics:');
      const startIdx = (topicIdx !== -1) ? topicIdx + 6 : topicsIdx + 7;
      
      // Extract the topic portion after topic: or topics:
      topicPart = line.substring(startIdx).trim();
      
      // Handle bracketed format [topic1,topic2]
      if (topicPart.startsWith('[')) {
        const endIdx = topicPart.indexOf(']');
        if (endIdx !== -1) {
          topicPart = topicPart.substring(1, endIdx);
        }
      } else {
        // Handle non-bracketed format: take until next space or end
        const spaceIdx = topicPart.indexOf(')');
        if (spaceIdx !== -1) {
          topicPart = topicPart.substring(0, spaceIdx);
        }
      }
      return topicPart.split(',').map(t => t.trim()).filter(t => t);
    }
    
    return [];
  }

export function convertTopoToGraph(topo) {
    const lines = topo.split('\n');
    let currentNode = null;

    const nodeLines = [];
    const arrowLines = [];
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        if (line.includes('-->') || line.includes('<--')) {
          arrowLines.push(line);
        } else {
          nodeLines.push(line);
        }
      }

    for (let line of nodeLines) {
        line = line.trim();
        if (!line) continue;

        console.log('convertTopoToGraphLine', line);
        if (line.startsWith('Source:')) {
            const parts = line.split(/\s+/, 3);
            const nodeName = processName(parts[1]);
            currentNode = getOrCreateNode(nodeName, 'source');
            // Handle topics with or without brackets
            const topics = extractTopics(line);
            for (let topic of topics) {
                const topicNode = getOrCreateNode(topic, 'topic');
                topicNode.addNeighbor(currentNode);
            }
        } else if (line.startsWith('Processor:')) {
            console.log("zek thkhrztkz rhkhb\n")
            const parts = line.split(/\s+/, 3);
            const nodeName = processName(parts[1]);
            currentNode = getOrCreateNode(nodeName, 'processor');

            if (line.includes('stores:')) {
                const storesStr = line.substring(line.indexOf('[') + 1, line.indexOf(']'));
                const stores = storesStr.split(',');
                for (let store of stores) {
                    const storeName = processName(store);
                    if (storeName) {
                        const storeNode = getOrCreateNode(storeName, 'store');
                        currentNode.addNeighbor(storeNode);
                    }
                }
            }
        } else if (line.startsWith('Sink:')) {
            const parts = line.split(/\s+/, 3);
            const nodeName = processName(parts[1]);
            currentNode = getOrCreateNode(nodeName, 'sink');

            // Handle topics with or without brackets
            const topics = extractTopics(line);
            for (let topic of topics) {
                const topicNode = getOrCreateNode(topic, 'topic');
                topicNode.addNeighbor(currentNode);
            }

        } else {
            console.log('Unknown line:', line);
        }
    }

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        console.log('convertTopoToGraphLine', line);
        if (line.startsWith('Source:')) {
            const parts = line.split(/\s+/, 3);
            const nodeName = processName(parts[1]);
            currentNode = getOrCreateNode(nodeName, 'source');
            // Handle topics with or without brackets
            const topics = extractTopics(line);
            for (let topic of topics) {
                const topicNode = getOrCreateNode(topic, 'topic');
                topicNode.addNeighbor(currentNode);
            }
        } else if (line.startsWith('Processor:')) {
            console.log("zek thkhrztkz rhkhb\n")
            const parts = line.split(/\s+/, 3);
            const nodeName = processName(parts[1]);
            currentNode = getOrCreateNode(nodeName, 'processor');

            if (line.includes('stores:')) {
                const storesStr = line.substring(line.indexOf('[') + 1, line.indexOf(']'));
                const stores = storesStr.split(',');
                for (let store of stores) {
                    const storeName = processName(store);
                    if (storeName) {
                        const storeNode = getOrCreateNode(storeName, 'store');
                        currentNode.addNeighbor(storeNode);
                    }
                }
            }
        } else if (line.startsWith('Sink:')) {
            const parts = line.split(/\s+/, 3);
            const nodeName = processName(parts[1]);
            currentNode = getOrCreateNode(nodeName, 'sink');

            // Handle topics with or without brackets
            const topics = extractTopics(line);
            for (let topic of topics) {
                const topicNode = getOrCreateNode(topic, 'topic');
                topicNode.addNeighbor(currentNode);
            }}
        else if (line.includes('-->')) {
            const targetName = processName(line.substring(line.indexOf('-->') + 3));
            if (targetName && currentNode) {
                const targetNode = getOrCreateNode(targetName, 'default');
                currentNode.addNeighbor(targetNode);
            }
        } else if (line.includes('<--')) {
            const sourceName = processName(line.substring(line.indexOf('<--') + 3));
            if (sourceName && currentNode) {
                const sourceNode = getOrCreateNode(sourceName, 'default');
                sourceNode.addNeighbor(currentNode);
            }
        } else {
            console.log('Unknown line:', line);
        }
    }
    console.log("MAP", [...nodeMap.values()]);
    return Array.from(nodeMap.values());
}

export function printGraph(nodes) {
    console.log('Graph contents:');
    nodes.forEach(node => {
        console.log(`${node.label} -> ${node.getNeighbors().map(n => n.label).join(', ')}`);
    });
}

export function getTextAreaValue() {
    console.log('getTextAreaValue', document.getElementById('topo').value);
    return document.getElementById('topo').value;
}