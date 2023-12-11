from flask import Flask, request, jsonify
from route_ai import calculatePrice, genetic_algorithm  # Import your functions
import random
import numpy as np
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
islands_data = {
    'island_name': ['Zakynthos', 'Ithaca', 'Corfu', 'Kelafonia', 'Lefkada', 'Paxos', 'Kythira'],
    'interest_score': [0.83, 0.45, 0.67, 0.21, 0.92, 0.34, 0.78],
    'coord_lat': [37.7910, 38.4042, 39.6243, 38.1754, 38.7098, 39.2057, 36.1864],
    'coord_long': [20.8959, 20.7136, 19.9217, 20.5690, 20.7128, 20.1320, 23.0202]
}


route_data = {
    'from': ['Zakynthos', 'Zakynthos', 'Zakynthos', 'Zakynthos', 'Zakynthos', 'Zakynthos','Ithaca', 'Ithaca', 'Ithaca', 'Ithaca', 'Ithaca', 'Ithaca','Corfu','Corfu', 'Corfu', 'Corfu', 'Corfu', 'Corfu','Kelafonia', 'Kelafonia', 'Kelafonia', 'Kelafonia', 'Kelafonia', 'Kelafonia','Lefkada', 'Lefkada', 'Lefkada', 'Lefkada','Lefkada', 'Lefkada','Paxos','Paxos','Paxos','Paxos','Paxos', 'Paxos','Kythira','Kythira','Kythira','Kythira','Kythira','Kythira'],
    'to': ['Ithaca', 'Corfu', 'Kefalonia', 'Lefkada', 'Paxos', 'Kythira','Zakynthos', 'Corfu', 'Kelafonia', 'Lefkada', 'Paxos', 'Kythira','Zakynthos','Ithaca', 'Kelafonia', 'Lefkada', 'Paxos', 'Kythira','Zakynthos','Ithaca','Corfu','Lefkada', 'Paxos', 'Kythira','Zakynthos','Ithaca','Corfu','Kelafonia', 'Paxos', 'Kythira','Zakynthos','Ithaca', 'Corfu', 'Kefalonia', 'Lefkada', 'Kythira','Zakynthos','Ithaca', 'Corfu', 'Kefalonia', 'Lefkada','Paxos'],
    'time in minutes': [245, 140, 248, 320, 528, 360,245, 540, 20, 138, 375, 365,140,540, 440, 240, 280, 320,248,20,440, 420, 367, 234,320,138,240,420, 456, 555,528,375,280,367,456, 457,360,365,320,234,555,457],
    'price': [30, 21, 17, 15, 20, 36, 30, 27, 25, 13, 37, 32,21,27, 44, 50, 28, 32,17,25,44, 42, 36, 23,15,13,50,42, 45, 55,20,37,28,36,45, 45,36,32,32,23,55,45]
}


@app.route('/calculatePrice', methods=['POST'])
def calculate_price():
    data = request.get_json()
    route = data.get('route')
    result = calculatePrice(route,pd.DataFrame(route_data))  # Call the imported function
    return jsonify({'result': result})

@app.route('/geneticAlgorithm', methods=['POST'])
def genetic_algorithm_route():
    data = request.get_json()
    budget_limit = data.get('budget_limit')
    generations = data.get('generations', 100)
    population_size = data.get('population_size', 20)
    mutation_rate = data.get('mutation_rate', 0.2)
    print(budget_limit)
    print(type(budget_limit))
    # Assuming df and rdf are defined in your existing file as global variables
    best_interest, best_price, best_route = genetic_algorithm(budget_limit, pd.DataFrame(islands_data), pd.DataFrame(route_data), generations, population_size, mutation_rate)

    return jsonify({
        'best_interest': best_interest,
        'best_route': best_route,
        'best_price':int(best_price)
    })

if __name__ == '__main__':
    app.run(debug=True)
