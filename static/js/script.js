let routeCount = 0;

document.getElementById("addRoute").addEventListener("click", function () {

    routeCount++;

    let tableBody = document.querySelector("#routeTable tbody");

    let row = `
        <tr>

            <td>Route ${String.fromCharCode(64 + routeCount)}</td>

            <td><input type="number" class="form-control distance"></td>

            <td><input type="number" class="form-control cost"></td>

            <td><input type="number" class="form-control risk"></td>

            <td><input type="number" class="form-control carbon"></td>

            <td><input type="number" class="form-control energy"></td>

            <td><input type="number" class="form-control reliability"></td>

            <td>
                <button class="btn btn-danger btn-sm deleteRoute">
                    Delete
                </button>
            </td>

        </tr>
    `;

    tableBody.insertAdjacentHTML("beforeend", row);
    updateSummary();

});


// Delete Route

document.querySelector("#routeTable tbody").addEventListener("click", function(event){

    if(event.target.classList.contains("deleteRoute")){

        event.target.closest("tr").remove();
        updateSummary();

    }

});
function updateSummary(){

    let totalRoutes = document.querySelectorAll("#routeTable tbody tr").length;

    document.getElementById("routeCountDisplay").innerText = totalRoutes;

}
document.getElementById("calculateBtn").addEventListener("click", function () {

    // ==========================
    // Read Route Data
    // ==========================

    let routes = [];

    let rows = document.querySelectorAll("#routeTable tbody tr");

    rows.forEach(function (row) {

        let data = {

            route: row.cells[0].innerText,

            distance: Number(row.cells[1].querySelector("input").value),

            cost: Number(row.cells[2].querySelector("input").value),

            risk: Number(row.cells[3].querySelector("input").value),

            carbon: Number(row.cells[4].querySelector("input").value),

            energy: Number(row.cells[5].querySelector("input").value),

            reliability: Number(row.cells[6].querySelector("input").value)

        };

        routes.push(data);

    });

    // ==========================
    // Read Weight Data
    // ==========================

    let weights = {

        cost: Number(document.getElementById("weight_cost").value),

        risk: Number(document.getElementById("weight_risk").value),

        carbon: Number(document.getElementById("weight_carbon").value),

        energy: Number(document.getElementById("weight_energy").value),

        reliability: Number(document.getElementById("weight_reliability").value)

    };

    let hospital = {

    hospital_name: document.getElementById("hospitalName").value,

    hospital_location: document.getElementById("hospitalLocation").value,

    waste_generated: document.getElementById("wasteGenerated").value,

    destination: document.getElementById("destinationCBWTF").value

};

    console.log("Routes:", routes);
    console.log("Weights:", weights);

    // ==========================
    // Validation
    // ==========================

    if (routes.length === 0) {
        alert("Please add at least one route.");
        return;
    }

    // ==========================
    // Send Data to Flask
    // ==========================

    fetch("/calculate", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            hospital: hospital,
            routes: routes,
            weights: weights
        })

    })

    .then(response => response.json())

    .then(data => {
        console.log(data.ranking);

        console.log("Response from Flask:", data);

        document.getElementById("bestRoute").innerText = data.best_route;

        document.getElementById("worstRoute").innerText = data.worst_route;

        document.getElementById("status").innerText = "Calculation Completed";

        document.getElementById("status").className = "badge bg-success";

    })

    .catch(error => {

        console.error("Error:", error);

        alert("Something went wrong while calculating TOPSIS.");

    });

});
