// global variables
let tree = {};
let nodePositions = {};

// draw default tree on page load
window.addEventListener("DOMContentLoaded", async () => {
  
  // fetch default tree from flask
  const response = await fetch("/draw_default_tree");
  tree = await response.json();
  console.log("Default tree:", tree);
  drawTree(tree);
});

document.getElementById("drawBtn").addEventListener("click", async () => {
  const input = prompt("Enter your tree as JSON:\n\nExample:\n{\n  \"A\": [\"B\", \"C\"],\n  \"B\": [\"D\", \"E\"],\n  \"C\": []\n} \n\n Please make sure the root node is 'A'");

  if (!input) return;

  let customTree;
  try {
    customTree = JSON.parse(input);
  } catch (err) {
    alert("Invalid JSON, please make sure your input is in proper JSON format.");
    return;
  }

  const response = await fetch("/set_custom_graph", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ graph: customTree })
  });

  const result = await response.json();
  if (result.status === "success") {
    console.log("Graph updated on server");
    tree = customTree;
    console.log("Custom tree:", customTree);
    drawTree(customTree);
  } else {
    alert("Failed to update graph!");
  }
});

function getMaxDepth(tree, node, depth = 0) {
  const children = tree[node];
  if (!children || children.length === 0) return depth;
  return Math.max(...children.map(child => getMaxDepth(tree, child, depth + 1)));
}

function drawTree(tree) {

  // reset drawing area
  const drawingArea = document.getElementById("tree");
  drawingArea.innerHTML = "";

  const svgWidth = drawingArea.clientWidth;
  const svgHeight = drawingArea.clientHeight;

  nodePositions = computePositions(tree, "A", svgWidth, svgHeight);
  console.log("Node positions:", nodePositions);

  // Draw nodes
  for (const [node, {x, y}] of Object.entries(nodePositions)) {
    drawNode(drawingArea, node, x, y);
  }

  // Draw edges
  for (const parent in tree) {
    for (const child of tree[parent]) {
      const p = nodePositions[parent];
      const c = nodePositions[child];
      drawEdge(drawingArea, p.x, p.y, c.x, c.y);
    }
  }
}

function computePositions(tree, root, svgWidth, svgHeight){
  // recursively compute positions for each node to be the center of its children
  const positions = {};
  const maxDepth = getMaxDepth(tree, root);
  const leafCount = Object.values(tree).filter(children => children.length === 0).length;

  const depthGap = svgHeight / (maxDepth + 1);
  const nodeGap = svgWidth / (leafCount + 1);

  let currentX = 0;

  function dfs(node, depth) {
    const children = tree[node];
    const y = 50 + depth * depthGap;

    if (children.length === 0) {
      const x = nodeGap + currentX * nodeGap;
      positions[node] = {x, y};
      currentX += 1;
      return x;
    }

    const childXs = children.map(child => dfs(child, depth + 1));
    const x = (Math.min(...childXs) + Math.max(...childXs)) / 2;
    positions[node] = { x, y };
    return x;
  }

  dfs(root, 0);

  return positions;
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