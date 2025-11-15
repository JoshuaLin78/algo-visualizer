from flask import Flask, request, render_template, jsonify
from algorithms.dfs import run_dfs, default_tree, set_graph

app = Flask(__name__)

# when someone goes to the root of our website "/", do something
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/run_dfs')
def run_dfs_route():
    steps = run_dfs()
    return jsonify(steps)

@app.route('/draw_default_tree')
def tree_route():
    graph = default_tree()
    return jsonify(graph)

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
