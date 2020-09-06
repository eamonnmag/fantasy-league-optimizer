<html>

<head>
    <title>Fantasy League Solver</title>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"
        integrity="sha512-8bHTC73gkZ7rZ7vpqUQThUDhqcNFyYi2xgDgPDHc+GXVGHXq+xPjynxIopALmOPqzo9JZj0k6OqqewdGO3EsrQ=="
        crossorigin="anonymous" />
    <link href="assets/css/style.css" rel="stylesheet">
</head>

<body>

    <div class="container">
        <div class="logo"></div>
        <div class="info">
            <p>Our algorithm analyses historic scores and optimises the team
                selection to gain the maximum number of points whilst keeping the cost
                below 100 million, and complying with all fantasy league conditions (max players from 1 team is 3).
            </p>
        </div>

        <div class="options ui fluid">

            <div class="opt-players">
                <p>I would like to have these players in my team:</p>
            </div>
            <br />
            <select id="player-initial" class="ui search selection dropdown" name="favourite-players" multiple=""
                placeholder="Search for a player">
            </select>

        </div>

        <div class="result">
            <div class="pitch"></div>
            <div class="points-summary">
                This team generated <span id="total_points"></span> points last season.
            </div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"
        integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg=="
        crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js"
        integrity="sha512-dqw6X88iGgZlTsONxZK9ePmJEFrmHwpuMrsUChjAw1mRUhUITE5QU9pkcSox+ynfLhL15Sv2al5A0LVyDCmtUw=="
        crossorigin="anonymous"></script>
    <script src="https://unpkg.com/javascript-lp-solver/prod/solver.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/6.1.1/d3.min.js"
        integrity="sha512-5xkNvFVCctXwOszeifE8pzjyDFlHvHDCKIrhwmuSbCtTHqc7IhA6/1tTNYXE8WmYvwP5KFQegCS1QRR4poYgjg=="
        crossorigin="anonymous"></script>
    <script src="assets/js/fantasy-solve.js" type="text/javascript"></script>
    <script>

        var players;

        function output_result(result) {
            var counts = { 'GKP': 0, 'DEF': 0, 'MID': 0, 'FWD': 0 };
            // reset
            d3.select('.pitch').html('');
            Object.keys(result).forEach(function (r) {
                if (r in players) {
                    var player = players[r];
                    var player_elem = d3.select('.pitch').append('div').attr('class', function (d) {
                        counts[player.position] += 1;

                        return player.position.toLowerCase() + ' ' + player.position.toLowerCase() + counts[player.position];
                    })

                    player_elem.append('h4').text(r);
                    player_elem.append('p').attr('class', 'team').html(player.team + ' &#163;' + player.cost + 'm');
                }
            });

            

            d3.select('#total_points').text(result.result);
        }

        d3.json('assets/js/players.json').then(function (response) {

            players = response;
            var result = fantasySolver.solve(players);
            output_result(result);
            
            var for_select = [];
            Object.keys(players).forEach(function (p_key) {
                for_select.push({ 'name': p_key + ' - ' + players[p_key].team + ' - &#163;' + players[p_key].cost, 'value': p_key })
            });

            $('.dropdown')
                .dropdown({
                    action: 'combo',
                    values: for_select
                });
            
            function recalculate() {
                
                var values = [];
                setTimeout(function() {
                    d3.selectAll('a.ui.label.transition.visible').each(function (d) { 
                        values.push(d3.select(this).attr('data-value')); 
                    });
                    console.log(values);
                    var result = fantasySolver.runWithInitialPlayers(values);
                    console.log(result);
                    output_result(result);
                    
                }, 250);

                d3.selectAll('a.ui.label.transition.visible i.delete.icon').on("click", function(d) {
                    recalculate();
                })
            }
            
            d3.select("#player-initial")
                .on("change", function () {
                    recalculate();
                })
        });

    </script>
</body>

</html>