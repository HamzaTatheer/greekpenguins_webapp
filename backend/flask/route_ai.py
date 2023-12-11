import random
import numpy as np
import pandas as pd
import random
import pandas as pd
import heapq

def evaluate_route(route, budget_limit, df, rdf):
    total_interest = 0
    total_route_price = 0  # Renamed to avoid variable name conflict

    for i in range(len(route) - 1):
        island_data = df[df['island_name'] == route[i]]

        if not island_data.empty:
            total_interest += island_data['interest_score'].values[0]

        matching_route = rdf[(rdf['from'] == route[i]) & (rdf['to'] == route[i + 1])]
        if not matching_route.empty:
            total_route_price += matching_route['price'].values[0]
        else:
            total_route_price += 10000  # or another penalty value

    # Add interest score for the last island
    last_island_data = df[df['island_name'] == route[-1]]
    if not last_island_data.empty:
        total_interest += last_island_data['interest_score'].values[0]
    else:
        print(f"Warning: Last island {route[-1]} not found in islands_data")

    return total_interest, total_route_price

def random_start_island(df):
    return np.random.choice(df['island_name'].unique())

def genetic_algorithm(budget_limit, df, rdf, generations=100, population_size=20, mutation_rate=0.2):
    # Ensure that the initial population has unique islands from islands_data
    initial_population = []
    while len(initial_population) < population_size:
        route = np.random.choice(df['island_name'].unique(), size=np.random.randint(2, len(df)), replace=False).tolist()
        if route not in initial_population:
            initial_population.append(route)

    for generation in range(generations):
        population = initial_population.copy()

        population = sorted(population, key=lambda x: evaluate_route(x, budget_limit, df, rdf), reverse=True)

        if evaluate_route(population[0], budget_limit, df, rdf)[1] <= budget_limit:
            return evaluate_route(population[0], budget_limit, df, rdf)[0], evaluate_route(population[0], budget_limit, df, rdf)[1], population[0]

        selected_routes = random.sample(population[:int(population_size / 2)], 2)

        population = [route for route in selected_routes]

        for _ in range(int(population_size / 2)):
            parent1, parent2 = random.sample(selected_routes, 2)
            crossover_point = np.random.randint(1, min(len(parent1), len(parent2)))

            child = parent1[:crossover_point] + parent2[crossover_point:]
            if np.random.rand() < mutation_rate:
                mutation_point = np.random.randint(1, len(child))
                mutated_island = np.random.choice(df['island_name'].unique(), replace=False)
                while mutated_island == child[0]:  # Ensure mutated island is not the current starting island
                    mutated_island = np.random.choice(df['island_name'].unique(), replace=False)
                child[mutation_point] = mutated_island

            child = [child[0]] + [item for item in child[1:] if item != child[0]]

            population.append(child)

    best_route = population[0]
    best_interest, best_priceee = evaluate_route(best_route, budget_limit, df, rdf)
    best_price = calculatePrice(best_route,rdf)
    return best_interest, best_price , best_route


def calculatePrice(route,rdf):
  return sum(rdf[(rdf['from'] == route[i]) & (rdf['to'] == route[i + 1])]['price'].values[0] for i in range(len(route) - 1))


# budget_limit = 300
# best_interest, best_price, best_route = genetic_algorithm(budget_limit, df, rdf)
# print(best_route)

# print(f'Total travel cost: {best_price} units')
# print(f'Total interest score: {best_interest}')

# budget_limit = 500
# route = ['Lefkada', 'Corfu', 'Zakynthos', 'Paxos', 'Ithaca', 'Kythira']
# def calculatePrice(route):
#   return sum(rdf[(rdf['from'] == route[i]) & (rdf['to'] == route[i + 1])]['price'].values[0] for i in range(len(route) - 1))

# cost = calculatePrice(route)
# cost

