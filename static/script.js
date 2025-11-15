/*
// Click "Run DFS"
document.getElementById("runBtn").addEventListener("click", async () => {
  
  // fetch DFS steps from server
  const response = await fetch("/run_dfs");
  const steps = await response.json();
  console.log("DFS steps:", steps);

  // reset all nodes to unvisited
  document.querySelectorAll(".node").forEach(node => {
    node.classList.remove("visited");
  });

  // animate nodes in order
  for (let i = 0; i < steps.length; i++) {
    const nodeId = steps[i];
    const node = document.getElementById(nodeId);

    if (node) {
      node.classList.add("visited"); // change color
      await new Promise(r => setTimeout(r, 1000)); // wait 1 second
    }
  }
});
*/
// Click "draw tree"
document.getElementById("drawBtn").addEventListener("click", async () => {
  
  // fetch default tree from flask
  const response = await fetch("/draw_default_tree");
  const graph = await response.json();
  console.log("Default tree:", graph);

  // reset drawing area
  const drawingArea = document.getElementById("tree");
  drawingArea.innerHTML = "";

  const svgWidth = drawingArea.clientWidth;
  const svgHeight = drawingArea.clientHeight;

  const root = "A";
  const depths = computeDepths(graph, root);
  const depthGap = svgHeight / (Object.keys(depths).length + 1);
  const nodeGap = svgWidth /  (Math.max(...Object.values(depths).map(arr => arr.length)) + 1);
  const nodePositions = {};

  // draw nodes
  Object.keys(depths).forEach((level, i) => {
    const y = 50 + i * depthGap;
    const nodes = depths[level];

    const totalWidth = (nodes.length - 1) * nodeGap;
    const startX = svgWidth / 2 - totalWidth / 2;

    nodes.forEach((node, j) => {
      const x = startX + j * nodeGap;
      nodePositions[node] = {x, y};
      drawNode(drawingArea, node, x, y);
    });
  });

  // Draw edges
  for (const parent in graph) {
    for (const child of graph[parent]) {
      const p = nodePositions[parent];
      const c = nodePositions[child];
      drawEdge(drawingArea, p.x, p.y, c.x, c.y);
    }
  }
});

function computeDepths(tree, root){
  const depths = {};
  const queue = [{node: root, depth: 0}];
  const visited = new Set();

  while(queue.length > 0){
    // dequeue
    const {node, depth} = queue.shift();
    if(visited.has(node)) continue;
    visited.add(node);

    // sort into depth arrays
    depths[depth] = depths[depth] || [];
    depths[depth].push(node);

    // enqueue children
    for(const child of tree[node]){
      queue.push({node: child, depth: depth + 1});
    }
  }

  return depths;
}

// draw nodes at position x, y
function drawNode(svg, id, x, y) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", 20);
  circle.setAttribute("fill", "gray");
  circle.setAttribute("id", id);
  svg.appendChild(circle);

  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("x", x - 6);
  label.setAttribute("y", y + 5);
  label.setAttribute("fill", "white");
  label.textContent = id;
  svg.appendChild(label);
}

// Draw edge between two points
function drawEdge(svg, x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "white");
  line.setAttribute("stroke-width", "2");
  svg.insertBefore(line, svg.firstChild);
}