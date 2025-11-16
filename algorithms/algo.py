graph = {
    "A": ["B", "C", "D"],
    "B": ["E", "F"],
    "C": ["G"],
    "D": ["H", "I"],
    "E": ["J", "K"],
    "F": [],
    "G": ["L", "M"],
    "H": [],
    "I": ["N"],
    "J": [],
    "K": [],
    "L": [],
    "M": [],
    "N": ["O", "P"],
    "O": [],
    "P": []
}


def dfs(node, graph, visited, steps):
    visited.add(node)
    steps.append(node)

    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(neighbor, graph, visited, steps)

def bfs(node, graph, visited, steps):
    queue = []
    visited.add(node)
    queue.append(node)

    while queue:
        m = queue.pop(0)
        steps.append(m)
        for neighbour in graph[m]:
            if neighbour not in visited:
                visited.add(neighbour)
                queue.append(neighbour)

def run_bfs():
    steps = []
    bfs('A', graph, set(), steps)
    return steps

def run_dfs():
    # example graph
    steps = []
    dfs('A', graph, set(), steps)
    return steps

def set_graph(new_graph):
    global graph
    print(graph)
    graph = new_graph


def default_tree():
    return graph