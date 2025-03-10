import { KStreamSourceNode,Node } from '../Node/node.js';

let nodeMap = new Map();
export function processName(n) {
    return n.trim().replace(/"/g, '').replace(/\s+/g, '');
}

export function getOrCreateNode(n, type) {
    const processedName = processName(n);
    if (!nodeMap.has(processedName)) {
        let node;
        switch (type.toLowerCase()) {
            case 'source':
                node = new KStreamSourceNode(processedName);
                break;
            case 'processor':
                node = new Node(`Proc:${processedName}`);
                break;
            case 'sink':
                node = new Node(`Sink:${processedName}`);
                break;
            case 'store':
                node = new Node(`Store:${processedName}`);
                break;
            default:
                node = new Node(processedName);
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

        } else if (line.includes('-->')) {
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