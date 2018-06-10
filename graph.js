function generateGraph(text) {
	splittedText = text.split("\r\n");
	var numberOfVertices = splittedText[0];
	var graph = {};
	
	for (i = 1; i <= numberOfVertices; i++) {
		graph[i] = { neighbours: [], visited: false, discoveryTime: 0, low: 0, parent: null };
	};

	
	for (j = 1; j < splittedText.length; j++) {
		var edges = splittedText[j].split(' ');
		if (edges[0] != "") {
			for (iter = 0; iter < edges.length; iter++)	{
				var parsedEdge =  parseInt(edges[iter]);
				graph[j].neighbours.push(parsedEdge);
				graph[parsedEdge].neighbours.push(j);
			}
		}
	}	
	findBridges(graph, numberOfVertices);
}

function findBridges(graph, numberOfVertices)
{
	var time = 0;
	var bridges = [];
	for (i = 1; i < numberOfVertices; i++) {
		if (graph[i].visited == false) {
			dfs(i, graph, time, bridges);
		}
	}
	$("#bridges").append("Mosty:");
	_.forEach(bridges, function(value) {
		$("#bridges").append("<br />["+value+"]");
	});
	console.log(bridges);
}

function dfs(index, graph, time, bridges) {
	var children = 0;
	graph[index].visited = true;
	graph[index].discoveryTime = ++time;
	graph[index].low = time;
	_.forEach(graph[index].neighbours, function(value) {
		if (!graph[value].visited) {
			graph[value].parent = index;
			dfs(value, graph, time, bridges);
			graph[index].low = Math.min(graph[index].low, graph[value].low);
			if (graph[value].low > graph[index].discoveryTime)
				bridges.push([index, value]);
		}
		else if (value != graph[index].parent)
			graph[index].low = Math.min(graph[index].low, graph[value].discoveryTime);
	});
}
 
