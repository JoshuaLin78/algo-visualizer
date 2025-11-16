from flask import Flask, request, render_template, jsonify
from algorithms.algo import run_dfs, run_bfs, default_tree, set_graph

app = Flask(__name__)

# startup
@app.route('/')
def home():
    return render_template('index.html')

# fetch dfs steps
@app.route('/run_dfs')
def run_dfs_route():
    steps = run_dfs()
    return jsonify(steps)

@app.route('/run_bfs')
def run_bfs_route():
    steps = run_bfs()
    return jsonify(steps)

# draw default tree on startup
@app.route('/draw_default_tree')
def tree_route():
    graph = default_tree()
    return jsonify(graph)

# update tree/graph with user input
@app.route('/set_custom_graph', methods=['POST'])
def set_graph_route():
    data = request.get_json()
    graph = data.get("graph")

    if not graph:
        return jsonify({"error": "No graph data received"}), 400
    
    set_graph(graph)
    
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True)
