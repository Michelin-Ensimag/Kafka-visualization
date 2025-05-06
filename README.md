<div align="center">
  <img src="https://github.com/Michelin-Ensimag/Kafka-visualization/blob/03b8da42e0e04bf7f2ba15422ca58935102864f6/public/KSTDVis.png?raw=true" alt="KAFKA STREAMS VISUALISATION">
</div>

# Kafka Streams Topology Designer — Visualization Tool

**KSTD-Visualization** is a tool designed to help visualize Kafka Streams topologies, with the goal to:

- ✅ Simplify the understanding of distributed systems
- 🎨 Create clean, official-style Kafka Streams topology diagrams
- ✏️ Easily edit diagrams via Excalidraw
- ⚡ Instantly visualize topologies with a simple copy-paste

---

## 🚀 Usage

When you're unsure about the structure of your Kafka Streams topology:

```java
  StreamsBuilder builder = new StreamsBuilder();
  // building the topology ...
  Topology t = builder.build();
  System.out.println(t.describe().toString());
```

Then, simply copy the output of `.describe()` and paste it into the textarea on the app : 👉 [app](https://michelin-ensimag.github.io/Kafka-visualization/)


🛠️ Installation
--------------------

```
git clone https://github.com/Michelin-Ensimag/Kafka-visualization.git 
cd Kafka-visualization 
npm install # add --force if needed
```

Finally
- `npm run dev` to see in your browser 
- `npm run build` to upload on a server

## Project layout
--------------

    ├─ .github/workflows/   Launch a CI/CD pipeline to automatically update the [website](https://michelin-ensimag.github.io/Kafka-visualization/)
    ├─ public/              Files accessible from website root 
    ├─ unitTestDescribe/    Unit Tests Files (java and their describes)
    │  ├─ javaFiles/        Java test files
    │  ├─ describeFiles/    The describe text of the java files
    ├─ src/                 all files needed to run the app
    │  ├─ Node/ParentNode   contains js files inheriting from node.js for the DAG
    │  ├─ Node/node.js 	    js file which define which function are allowed on Nodes for the graph
    │  ├─ assets/           Logos, basic library from KSTD
    │  ├─ components/ui/    Components from shadcn for the app
    │  ├─ lib/              contains utils.js used for shadcn
    │  └─ parser/           every file for the parser (DAG, arrow generator, Topological Sorter, etc)
    └─ App.jsx, ...         files for the app

## 🤝 Contributing

Ensimag and Michelin are happy to share this project.
Feel free to open an issue or pull request to:

- suggest new features
- fix bugs
- add examples or improvements


