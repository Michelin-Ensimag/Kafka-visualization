import { KStreamSourceNode,Node } from '../Node/node.js';
import { SelectKey } from '../Node/ParentNode/SelectKey.js';
import { TopicSimple } from '../Node/ParentNode/TopicSimple.js';
import { TopicAdvanced } from '../Node/ParentNode/TopicAdvanced.js';
import {Filter} from "../Node/ParentNode/Filter.js";
import {MapValues} from "../Node/ParentNode/MapValues.js";
import {GroupBy} from "../Node/ParentNode/GroupBy.js";
import {ReduceAggregate} from "../Node/ParentNode/ReduceAggregate.js";
import {Count} from "../Node/ParentNode/Count.js";
import {Topology} from "../Node/ParentNode/Topology.js";
import {SubTopology} from "../Node/ParentNode/SubTopology.js";
import {Peek} from "../Node/ParentNode/Peek.js";
import {ForEach} from "../Node/ParentNode/ForEach.js";
import {Process} from "../Node/ParentNode/Process.js";
import {TopicDefault} from "../Node/ParentNode/TopicDefault.js";
import {StateStore} from "../Node/ParentNode/StateStore.js";
import {FlatMap} from "../Node/ParentNode/FlatMap.js";
import {KTable} from "../Node/ParentNode/KTable.js";
import {GlobalKTable} from "../Node/ParentNode/GlobalKTable.js";
import {Split} from "../Node/ParentNode/Split.js";
import {Merge} from "../Node/ParentNode/Merge.js";
import {Map as MapNode} from "../Node/ParentNode/Map.js";
import {Join} from "../Node/ParentNode/Join.js";
import {FlatMapValues} from '../Node/ParentNode/FlatMapValues.js';
import { TransformValues } from '@/Node/ParentNode/TransformValues.js';
import { ProcessValues } from '@/Node/ParentNode/ProcessValues.js';

let nodeMap = new Map();
export function processName(n) {
    return n.trim().replace(/"/g, '').replace(/\s+/g, '');
}

function getOrCreateNode(name, type) {
    const processedName = processName(name);
    // console.log(name, type, processedName);
    if (!nodeMap.has(processedName)) {
        let node;
        switch (type.toLowerCase()) {
            case 'source':
            case 'sink':           
            case 'ktable-tostream':
            case 'ktable-source':
            case 'kstream-source':
                node = new KStreamSourceNode(processedName);
                break;
            case 'topology':
                node = new Topology(processedName);
                break;
            case 'kstream-sink':
                node = new TopicAdvanced(processedName);
                break;
            case 'topic':
                node = new TopicAdvanced(processedName);
                break;
            case 'sub-topology':
                // console.log(processedName);
                node = new SubTopology(processedName);
                break;
            case 'kstream-filter':
                node = new Filter(processedName);
                break;
            case 'kstream-mapvalues':
                node = new MapValues(processedName);
                break;
            case 'kstream-key-select':
            case 'ktable-select':
                node = new SelectKey(processedName);
                break;
            case 'kstream-groupby':
                node = new GroupBy(processedName);
                break;
            case 'kstream-reduce':
            case 'kstream-aggregate':
            case 'ktable-reduce':
            case 'ktable-aggregate':
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
            case 'kstream-totable':
                node = new KTable(processedName);
                break;
            case 'kstream-branch':
                node = new Split(processedName);
                break;
            case 'store':
                node = new StateStore(processedName);
                break;
            case 'kstream-merge':
                node = new Merge(processedName);
                break;
            case 'kstream-map':
                node = new MapNode(processedName);
                break;
            case 'kstream-leftjoin':
            case 'kstream-join':
                node = new Join(processedName);
                break;
            case 'kstream-flatmap':
                node = new FlatMap(processedName);
                break;
            case 'kstream-flatmapvalues':
                node = new FlatMapValues(processedName);
                break;
            case 'kstream-transformvalues':
            case 'kstream-transform':
                node = new TransformValues(processedName);
                break;
            case 'kstream-processvalues':
                node = new ProcessValues(processedName);
                break;
            /*case 'none':
                node = new None(processedName);
                break;*/
            case 'kstream-branchchild':
                //TODO ?
            default:
                node = new Node(processedName,true);
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
  function extractStores(line) {
    // Format: store: [store1,store2] or stores: [store1,store2]
    // or: store: store1 or stores: store1
    if (line.includes('store:') || line.includes('stores:')) {
      let storePart = '';
      
      // Determine if we're dealing with the store: or stores: part
      const storeIdx = line.indexOf('store:');
      const storesIdx = line.indexOf('stores:');
      const startIdx = (storeIdx !== -1) ? storeIdx + 6 : storesIdx + 7;
      
      // Extract the topic portion after store: or stores:
      storePart = line.substring(startIdx).trim();
      
      // Handle bracketed format [store1,store2]
      if (storePart.startsWith('[')) {
        const endIdx = storePart.indexOf(']');
        if (endIdx !== -1) {
          storePart = storePart.substring(1, endIdx);
        }
      } else {
        // Handle non-bracketed format: take until next space or end
        const spaceIdx = storePart.indexOf(')');
        if (spaceIdx !== -1) {
          storePart = storePart.substring(0, spaceIdx);
        }
      }
      return storePart.split(',').map(t => {
        t = t.trim();
        const limitIdx = t.indexOf('STATE'); // Find the position of State
        if (limitIdx !== -1) {
            // get te substring plus the last number
            t = t.substring(0, limitIdx) + '(' + t.substring(limitIdx + 20).trim() + ')'; 
        }
        // console.log("store",t);
        return t;
    }).filter(t => t);
    }
    
    return [];
  }

  export function convertTopoToGraph(topologyText) {
    const lines = topologyText.split('\n').map(line => line.trim()).filter(line => line);
    nodeMap.clear();

    lines.forEach(line => processLine(line));

    lines.forEach(line => addConnections(line));
    
    return Array.from(nodeMap.values());
}

function processLine(line) {
    let match;
    // console.log(line);
    if ((match = line.match(/^Source:\s+(\S+)/))) {
        createNodeWithTopics(match[1], 'source', line);
    } else if ((match = line.match(/^Processor:\s+(\S+)/))) {
        createProcessorNode(match[1], line);
    } else if ((match = line.match(/^Sink:\s+(\S+)/))) {
        createNodeWithTopics(match[1], 'sink', line, true);
    } else if (line.startsWith("Topologies")||line.startsWith("Sub-topologies")) {
        getOrCreateNode("Topology","Topology");
    } else if ((match = line.match(/^Sub-topology:\s+(\S+)/))) {
        getOrCreateNode("sub-"+match[1],"Sub-topology");
    }


}

let match, currentNode,currentSub, currentTopology;
function addConnections(line) {
    if ((match = line.match(/^Source:\s+(\S+)/))) {
        currentNode = getOrCreateNode(match[1], 'source');
    } else if ((match = line.match(/^Processor:\s+(\S+)/))) {
        currentNode = getOrCreateNode(match[1], getProcessorType(match[1]));
    } else if ((match = line.match(/^Sink:\s+(\S+)/))) {
        currentNode = getOrCreateNode(match[1], 'sink');
    } else if (line.startsWith("Topologies")||line.startsWith("Sub-topologies")) {
        currentTopology=getOrCreateNode("Topology","Topology");
    } else if ((match = line.match(/^Sub-topology:\s+(\S+)/))) {
        currentSub=getOrCreateNode("sub-"+match[1],"Sub-topology");
    }
    
    if (!currentNode) return;

    if (line.includes('-->')) {
        const targetName = line.split('-->')[1]?.trim().split(/[\s,]+/)[0] || null;
        if (targetName && targetName !="none") currentNode.addNeighbor(getOrCreateNode(targetName, 'default'));
    } else if (line.includes('<--')) {
        const sourceName = line.split('<--')[1]?.trim().split(/[\s,]+/)[0] || null;
        if (sourceName && sourceName !="none") getOrCreateNode(sourceName, 'default').addNeighbor(currentNode);
    } else if ((match = line.match(/^Sub-topology:\s+(\S+)/))){
        currentNode.addSubTopology(currentSub);
        currentNode=currentSub;
    }
}

function createNodeWithTopics(nodeName, type, line, isSink = false) {
    const currentNode = getOrCreateNode(nodeName, type);
    extractTopics(line).forEach(topic => {
        const topicNode = getOrCreateNode(topic, 'topic');
        isSink ? currentNode.addNeighbor(topicNode) : topicNode.addNeighbor(currentNode);
    });
}

function createProcessorNode(nodeName, line) {
    const currentNode = getOrCreateNode(nodeName, getProcessorType(nodeName));
    if (line.includes('stores:')) {
        extractStores(line).forEach(store => getOrCreateNode(store, 'store').addNeighbor(currentNode));
    }
}

function getProcessorType(nodeName) {
    if (nodeName.includes("-")) {
        return nodeName.split('-').slice(0, -1).join('-').toLowerCase();
    }
    return nodeName.toLowerCase();
}

export function printGraph(nodes) {
    console.log('Graph contents:');
    nodes.forEach(node => {
        console.log(`${node.label} -> ${node.getNeighbors().map(n => n.label).join(', ')}`);
    });
}

export function getTextAreaValue() {
    return document.getElementById('topo').value;
}