var fantasySolver = (function () {

    var processed_data, constraints;

    function generate_constraints(processed_data) {

        var constraints =  {
            "cost": { "max": 100 },
            "GKP": { "max": 1, "min": 1 },
            "GKP_LOW": {"min":1, "max": 1},
            "DEF": { "max": 5, "min": 5 },
            "MID": { "max": 5, "min": 5 },
            "FWD": { "max": 3, "min": 3 }
        }

        processed_data.teams.forEach(function(t) {
            constraints[t] = {"max": 3}
        });

        processed_data.players.forEach(function(p) {
            constraints[p] = {"max": 1}
        });

        return constraints
    }

    function process_players(players) {
        var teams = [];
        var player_map = {};
        Object.keys(players).forEach(function(p) {
            var player = players[p];
            player[p] = 1;
            if(player.position === "GKP" & +player.cost <= 4) {
                player["GKP_LOW"] = 1;
            } else {
                player[player['position']] = 1;
            }
            player[player['team']] = 1;
            
            if(teams.indexOf(player['team']) == -1) {
                teams.push(player['team']);
            }

            if(player.position === "GKP" & +player.cost <= 4) {
                player["GKP_LOW"] = 1;
            }
            player_map[p] = 1;
        });

        return {'variables': players, 'teams': teams, 'players': Object.keys(players), 'player_map': player_map};
    }

    function run_solver(constraints, processed_data) {
        model = {
            "optimize": "points",
            "opType": "max",
            "constraints": constraints,
            "variables": processed_data.variables,
            "ints": processed_data.player_map
        };

        return solver.Solve(model);
    }

    return {
        solve: function (players) {
            
            processed_data = process_players(players);
            constraints = generate_constraints(processed_data)

            return run_solver(constraints, processed_data);
        },

        runWithInitialPlayers: function(positive, negative) {
            let _updated = Object.assign({}, constraints);
            positive.forEach(function(d) {
                _updated[d] = {'min': 1, "max":1};
            });

            negative.forEach(function(d) {
                _updated[d] = {'min': 0, "max":0};
            });

            return run_solver(_updated, processed_data);
        } 
    }
})();