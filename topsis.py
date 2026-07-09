import numpy as np


def calculate_topsis(routes, weights):

    # ----------------------------
    # Create Decision Matrix
    # ----------------------------

    matrix = []

    route_names = []

    for route in routes:

        route_names.append(route["route"])

        matrix.append([

            float(route["cost"]),
            float(route["risk"]),
            float(route["carbon"]),
            float(route["energy"]),
            float(route["reliability"])

        ])

    matrix = np.array(matrix)

    # ----------------------------
    # Weight Vector
    # ----------------------------

    weight_vector = np.array([

        float(weights["cost"]),
        float(weights["risk"]),
        float(weights["carbon"]),
        float(weights["energy"]),
        float(weights["reliability"])

    ])

    # ----------------------------
    # Normalize Matrix
    # ----------------------------

    normalized = matrix / np.sqrt((matrix ** 2).sum(axis=0))

    # ----------------------------
    # Weighted Matrix
    # ----------------------------

    weighted = normalized * weight_vector

    # ----------------------------
    # Criteria Type
    # ----------------------------

    # Cost Criteria
    # Cost
    # Risk
    # Carbon
    # Energy

    ideal_best = np.array([

        weighted[:,0].min(),
        weighted[:,1].min(),
        weighted[:,2].min(),
        weighted[:,3].min(),
        weighted[:,4].max()

    ])

    ideal_worst = np.array([

        weighted[:,0].max(),
        weighted[:,1].max(),
        weighted[:,2].max(),
        weighted[:,3].max(),
        weighted[:,4].min()

    ])

    # ----------------------------
    # Euclidean Distance
    # ----------------------------

    distance_best = np.sqrt(((weighted - ideal_best) ** 2).sum(axis=1))

    distance_worst = np.sqrt(((weighted - ideal_worst) ** 2).sum(axis=1))

    # ----------------------------
    # TOPSIS Score
    # ----------------------------

    score = distance_worst / (distance_best + distance_worst)

    best_index = np.argmax(score)

    worst_index = np.argmin(score)

    ranking = []

    for i in range(len(route_names)):

        ranking.append({

            "route": route_names[i],

            "score": round(float(score[i]),4)

        })

    ranking = sorted(ranking,key=lambda x:x["score"],reverse=True)

    return {

        "best_route": route_names[best_index],

        "worst_route": route_names[worst_index],

        "best_score": round(float(score[best_index]),4),

        "ranking": ranking

    }