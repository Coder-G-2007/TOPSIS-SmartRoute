from flask import Flask, render_template, request, jsonify, session
from topsis import calculate_topsis

app = Flask(__name__)
app.secret_key = "smartroute123"
@app.route("/")
def home():
    return render_template("home.html")


@app.route("/input")
def input_page():
    return render_template("input.html")


@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.get_json()
    hospital = data["hospital"]

    routes = data["routes"]
    weights = data["weights"]

    result = calculate_topsis(routes, weights)
    
    # Store both weights and input routes along with the ranking results
    result["weights"] = weights
    result["raw_routes"] = routes
    result["hospital"] = hospital
    
    session["topsis_result"] = result
    return jsonify(result)

@app.route("/result")
def result_page():

    result = session.get("topsis_result")

    if result is None:

        return "Please calculate TOPSIS first."

    return render_template(
        "result.html",
        result=result
    )

if __name__ == "__main__":
    app.run(debug=True)