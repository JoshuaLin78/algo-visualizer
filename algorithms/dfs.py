graph = {
        'A': ['B', 'C'],
        'B': ['D', 'E', 'F'],
        'C': ['G'],
        'D': [],
        'E': [],
        'F': [],
        'G': ['H'],
        'H': ['I', 'J', 'K'],
        'I': [],
        'J': [],
        'K': []
    }

def dfs(node, graph, visited, steps):
    visited.add(node)
    steps.append(node)

    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(neighbor, graph, visited, steps)

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