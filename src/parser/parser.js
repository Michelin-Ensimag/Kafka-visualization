import { KStreamSourceNode,Node } from '../Node/node.js';
import { SelectKey } from '../Node/ParentNode/SelectKey.js';
import { TopicSimple } from '../Node/ParentNode/TopicSimple.js';
import { TopicAdvanced } from '../Node/ParentNode/TopicAdvanced.js';
import  {Map as MapNode} from "../Node/ParentNode/Map.js"
import {Filter} from "../Node/ParentNode/Filter.js";
import {MapValues} from "../Node/ParentNode/MapValues.js";
import {GroupBy} from "../Node/ParentNode/GroupBy.js";
import {ReduceAggregate} from "../Node/ParentNode/ReduceAggregate.js";
import {Count} from "../Node/ParentNode/Count.js";
import {Peek} from "../Node/ParentNode/Peek.js";
import {ForEach} from "../Node/ParentNode/ForEach.js";
import {Process} from "../Node/ParentNode/Process.js";
import {TopicDefault} from "../Node/ParentNode/TopicDefault.js";
import {StateStore} from "../Node/ParentNode/StateStore.js";
import {FlatMap} from "../Node/ParentNode/FlatMap.js";

let nodeMap = new Map();
export function processName(n) {
    return n.trim().replace(/"/g, '').replace(/\s+/g, '');
}

function getOrCreateNode(name, type) {
    const processedName = processName(name);
    console.log("type", type);
    if (!nodeMap.has(processedName)) {
        let node;
        switch (type.toLowerCase()) {
            case 'source':
            case 'sink':
            case 'kstream-source':
                node = new KStreamSourceNode(processedName);
                break;
            case 'kstream-sink':
                node = new TopicAdvanced(processedName);
                break;
            case 'topic':
                node = new TopicAdvanced(processedName);
                break;
            case 'kstream-filter':
                node = new Filter(processedName);
                break;
            case 'kstream-mapvalues':
                node = new MapValues(processedName);
                break;
            case 'kstream-key-select':
                node = new SelectKey(processedName);
                break;
            case 'kstream-flatmap':
                node = new FlatMap(processedName);
                break;
            case 'kstream-groupby':
                node = new GroupBy(processedName);
                break;
            case 'kstream-reduce':
            case 'kstream-aggregate':
                node = new ReduceAggregate(processedName);
                break;
            case 'kstream-count':
                node = new Count(processedName);
                break;
            case 'kstream-peek':
                node = new Peek(processedName);
                break;
            case 'kstream-foreach':
                node = new ForEach(processedName);
                break;
            case 'kstream-processor':
                node = new Process(processedName);
                break;
            case 'store':
                node = new StateStore(processedName);
                break;
            default:
                node = new Node(processedName);
                console.log(`Warning: Unknown node type '${type}' for ${processedName}`);
        }
        nodeMap.set(processedName, node);
    }
    return nodeMap.get(processedName);
}

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

export function convertTopoToGraph(topologyText) {
    const lines = topologyText.split('\n');
    let currentNode = null;

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // console.log('convertTopoToGraphLine', line);

        if (line.startsWith('Source:')) {
            const parts = line.match(/Source: (\S+)/);
            if (parts) {
                const nodeName = parts[1];
                currentNode = getOrCreateNode(nodeName, 'source');
                const topics = extractTopics(line);
                for (let topic of topics) {
                    const topicNode = getOrCreateNode(topic, 'topic');
                    topicNode.addNeighbor(currentNode);
                }
            }
        } else if (line.startsWith('Processor:')) {
            const parts = line.match(/Processor: (\S+)/);
            if (parts) {
                const nodeName = parts[1];

                // Determine processor type from the name
                let processorType;
                if (nodeName.includes("-")) {
                    processorType = nodeName
                        .split('-')
                        .slice(1, -1) // Take all parts except the first (kstream) and last (numeric ID)
                        .join('-')     // Join them back with a dash
                        .toLowerCase(); // Convert to lowercase
                    processorType = "kstream-"+processorType;
                } else {
                    // Fallback for cases like "INNER_JOIN"
                    processorType = nodeName.toLowerCase();
                }

                currentNode = getOrCreateNode(nodeName, processorType);

                if (line.includes('stores:')) {
                    const storesStr = line.substring(line.indexOf('[') + 1, line.indexOf(']'));
                    const stores = storesStr.split(',').map(s => s.trim());
                    for (let store of stores) {
                        if (store) {
                            const storeNode = getOrCreateNode(store, 'store');
                            storeNode.addNeighbor(currentNode);
                        }
                    }
                }
            }

        } else if (line.startsWith('Sink:')) {
            const parts = line.match(/Sink: (\S+)/);
            if (parts) {
                const nodeName = parts[1];
                currentNode = getOrCreateNode(nodeName, 'sink');
                const topics = extractTopics(line);
                for (let topic of topics) {
                    const topicNode = getOrCreateNode(topic, 'topic');
                    currentNode.addNeighbor(topicNode); // Sink flows to topic
                }
            }
        }
         else {
            console.log('Unknown line:', line);
        }
    }

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        console.log('convertTopoToGraphLine', line);

        if (line.startsWith('Source:')) {
            const parts = line.match(/Source: (\S+)/);
            if (parts) {
                const nodeName = parts[1];
                currentNode = getOrCreateNode(nodeName, 'source');
                const topics = extractTopics(line);
                for (let topic of topics) {
                    const topicNode = getOrCreateNode(topic, 'topic');
                    topicNode.addNeighbor(currentNode);
                }
            }
        } else if (line.startsWith('Processor:')) {
            const parts = line.match(/Processor: (\S+)/);
            if (parts) {
                const nodeName = parts[1];

                // Determine processor type from the name
                let processorType;
                if (nodeName.includes("-")) {
                    processorType = nodeName
                        .split('-')
                        .slice(1, -1) // Take all parts except the first (kstream) and last (numeric ID)
                        .join('-')     // Join them back with a dash
                        .toLowerCase(); // Convert to lowercase
                } else {
                    // Fallback for cases like "INNER_JOIN"
                    processorType = nodeName.toLowerCase();
                }

                currentNode = getOrCreateNode(nodeName, processorType);

                if (line.includes('stores:')) {
                    const storesStr = line.substring(line.indexOf('[') + 1, line.indexOf(']'));
                    const stores = storesStr.split(',').map(s => s.trim());
                    for (let store of stores) {
                        if (store) {
                            const storeNode = getOrCreateNode(store, 'store');
                            storeNode.addNeighbor(currentNode);
                        }
                    }
                }
            }
        } else if (line.startsWith('Sink:')) {
            const parts = line.match(/Sink: (\S+)/);
            if (parts) {
                const nodeName = parts[1];
                currentNode = getOrCreateNode(nodeName, 'sink');
                const topics = extractTopics(line);
                for (let topic of topics) {
                    const topicNode = getOrCreateNode(topic, 'topic');
                    currentNode.addNeighbor(topicNode); // Sink flows to topic
                }
            }
        } else if (line.includes('-->')) {
            const parts = line.split('-->');
            const targetName = parts[1].trim().split(/\s+/)[0]; // Get first word after -->
            if (targetName && currentNode) {
                const targetNode = getOrCreateNode(targetName, 'default');
                currentNode.addNeighbor(targetNode);
            }
        } else if (line.includes('<--')) {
            const parts = line.split('<--');
            const sourceName = parts[1].trim().split(/\s+/)[0]; // Get first word after <--
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