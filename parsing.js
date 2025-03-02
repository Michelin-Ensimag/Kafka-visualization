function convertTopoToDot(topo) {
	let lines = topo.split('\n');
	let results = [];
	let outside = [];
	let stores = new Set();
	let topics = new Set();
	let entityName;

	// dirty but quick parsing
	lines.forEach(line => {
		let sub = /Sub-topology: ([0-9]*)/; //C PAS FAIT AVEC KAFKA, OKKKKKKK
		let match = sub.exec(line);  //ca cherche si la regexp est trouvée dans la line

		if (match) { // La dedans on crée un sub-topology
			if (results.length) {
                    results.push(`}`);
            }
			results.push(`subgraph cluster_${match[1]} {
			label = "${match[0]}";

			style=filled;
			color=lightgrey;
			node [style=filled,color=white];
			`);

			return;
		}

		match = /(Source\:|Processor\:|Sink:)\s+(\S+)\s+\((topics|topic|stores)\:(.*)\)/.exec(line)

		if (match) { //Processeurs, toussa
			entityName = processName(match[2]);
			let type = match[3]; // source, processor or sink
			let linkedNames = match[4];
			linkedNames = linkedNames.replace(/\[|\]/g, '');
			linkedNames.split(',').forEach(linkedName => {
				linkedName = processName(linkedName.trim());

				if (linkedName === '') {
					// short circuit
				}
				else if (type === 'topics') {
					// from
					outside.push(`"${linkedName}" -> "${entityName}";`);
					topics.add(linkedName);
				}
				else if (type === 'topic') {
					// to
					outside.push(`"${entityName}" -> "${linkedName}";`);
					topics.add(linkedName);
				}
				else if (type === 'stores') {
					if (entityName.includes("JOIN")) {
						outside.push(`"${linkedName}" -> "${entityName}";`);
					} else {
						outside.push(`"${entityName}" -> "${linkedName}";`);
					}

					stores.add(linkedName);
				}
			});

			return;
		}

		match = /\-\-\>\s+(.*)$/.exec(line);
        // Les fleches
		if (match && entityName) {
			let targets = match[1];
			targets.split(',').forEach(name => {
				let linkedName = processName(name.trim());
				if (linkedName === 'none') return;

				results.push(`"${entityName}" -> "${linkedName}";`);
			});
		}
	})

	if (results.length) results.push(`}`);

	results = results.concat(outside);

	stores.forEach(node => {
		results.push(`"${node}" [shape=cylinder];`)
	});

	topics.forEach(node => {
		results.push(`"${node}" [shape=rect];`)
	});

	return `
	digraph G {
		label = "Kafka Streams Topology"

		${results.join('\n')}
	}
	`;
}
/*
 Keskifé mon programme:
    Il parse et il va me renvoyer un .dot qui servira à créer dans excalidraw:
	TODO:
	lexer pour tous les objets j'imagine: (bof, la faute à l'utilisateur)
		Y en a 76 donc ça ferait beaucoup à faire? pas le choix je pense, mais faudra que je lui dise comment faire afin de réaliser les
			trucs nécéssaires
		parser, puis lexer

	parseur pour eux aussi je pense? (jsp trop en fait aled)

 */