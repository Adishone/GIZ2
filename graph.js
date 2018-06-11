function generateGraph(text) {
	splittedText = text.split("\r\n");
	var numberOfVertices = splittedText[0];
	var graph = {};
	
	for (i = 1; i <= numberOfVertices; i++) {
		graph[i] = { neighbours: [], visited: false, discoveryTime: 0, low: 0, parent: null, articulationPoint: false };
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
	//deep copy of graph
	var graph2 = jQuery.extend(true, {}, graph);

	$("#bridges").empty();
	$("#articulationPoints").empty();
	findBridges(graph, numberOfVertices);
	findArticulationPoints(graph2, numberOfVertices);
}

function findBridges(graph, numberOfVertices)
{
	var time = 0;
	var bridges = [];
	for (i = 1; i < numberOfVertices; i++) {
		if (graph[i].visited == false) {
			dfsBridges(i, graph, time, bridges);
		}
	}
	$("#bridges").append("Mosty:");
	_.forEach(bridges, function(value) {
		$("#bridges").append("<br />"+value[0]+" "+value[1]);
	});
}

function dfsBridges(index, graph, time, bridges) {
	graph[index].visited = true;
	graph[index].discoveryTime = ++time;
	graph[index].low = time;
	_.forEach(graph[index].neighbours, function(value) {
		if (!graph[value].visited) {
			graph[value].parent = index;
			dfsBridges(value, graph, time, bridges);
			graph[index].low = Math.min(graph[index].low, graph[value].low);
			if (graph[value].low > graph[index].discoveryTime)
				bridges.push([index, value]);
		}
		else if (value != graph[index].parent)
			graph[index].low = Math.min(graph[index].low, graph[value].discoveryTime);
	});
}

function findArticulationPoints(graph, numberOfVertices) {
	var time = 0;
	for (i = 1; i < numberOfVertices; i++) {
		if (graph[i].visited == false) {
			dfsArticulationPoints(i, graph, time);
		}
	}
	$("#articulationPoints").append("Punkty Artykulacji: <br />");
	_.forEach(graph, function(value, key) {
		if (value.articulationPoint == true) {		
			$("#articulationPoints").append(key+" ");
		}
	});
}
 
function dfsArticulationPoints(index, graph, time, bridges) {
	var children = 0;
	graph[index].visited = true;
	graph[index].discoveryTime = ++time;
	graph[index].low = time;
	_.forEach(graph[index].neighbours, function(value) {
		if (!graph[value].visited) {
			children++;
			graph[value].parent = index;
			dfsArticulationPoints(value, graph, time);
			graph[index].low = Math.min(graph[index].low, graph[value].low);

			if (graph[index].parent == null && children > 1)
				graph[index].articulationPoint = true;

			if (graph[index].parent != null && graph[value].low >= graph[index].discoveryTime)
				graph[index].articulationPoint = true;
		}
		else if (value != graph[index].parent)
			graph[index].low = Math.min(graph[index].low, graph[value].discoveryTime);
	});
}