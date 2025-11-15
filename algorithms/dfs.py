def dfs(node, graph, visited, steps):
    visited.add(node)
    steps.append(node)

    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(neighbor, graph, visited, steps)

def run_dfs():
    # example graph
    graph = {
        'A': ['B', 'C'],
        'B': ['D', 'E'],
        'C': [],
        'D': [],
        'E': []
    }
    steps = []
    dfs('A', graph, set(), steps)
    return steps

def default_tree():
    graph = {
        'A': ['B', 'C'],
        'B': ['D', 'E', 'F'],
        'C': [],
        'D': [],
        'E': [],
        'F': [],
    }

    return graph