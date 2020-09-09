var fantasySolver = (function () {

    var processed_data, constraints;

    var DEF_COUNT = 5, MID_COUNT = 5, FWD_COUNT = 3;

    function generate_constraints(processed_data) {

        var constraints =  {
            "cost": { "max": 100 },
            "GKP": { "max": 1, "min": 1 },
            "GKP_LOW": {"min":1, "max": 1},
            "DEF": { "max": DEF_COUNT, "min": DEF_COUNT },
            "DEF_LOW": {"min":0, "max": 0},
            "MID": { "max": MID_COUNT, "min": MID_COUNT},
            "MID_LOW": {"min":0, "max": 0},
            "FWD": { "max": FWD_COUNT, "min": FWD_COUNT },
            "FWD_LOW": { "max": 0, "min": 0 }
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
        var min_prices= {'GKP': 4, 'DEF': 4, 'MID': 4.5, 'FWD': 4.5}
        Object.keys(players).forEach(function(p) {
            var player = players[p];
            player[p] = 1;
            
            if(player.cost <= min_prices[player.position]) {
                player[player['position'] + "_LOW"] = 1;
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

        runWithInitialPlayers: function(positive, negative, formation) {
            let _updated = Object.assign({}, constraints);
            positive.forEach(function(d) {
                _updated[d] = {'min': 1, "max":1};
            });

            negative.forEach(function(d) {
                _updated[d] = {'min': 0, "max":0};
            });

            if(formation !== "all") {
                var def = +formation[0];
                var mid = +formation[1];
                var fwd = +formation[2];

                _updated['DEF'] = {'min': def, 'max': def};
                _updated['DEF_LOW'] = {'min': DEF_COUNT-def, 'max': DEF_COUNT-def};

                _updated['MID'] = {'min': mid, 'max': mid};
                _updated['MID_LOW'] = {'min': MID_COUNT-mid, 'max': MID_COUNT-mid};

                _updated['FWD'] = {'min': fwd, 'max': fwd};
                _updated['FWD_LOW'] = {'min': FWD_COUNT-fwd, 'max': FWD_COUNT-fwd};

                console.log(_updated);
            }

            return run_solver(_updated, processed_data);
        } 
    }
})();