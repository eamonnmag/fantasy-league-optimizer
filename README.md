# Fantasy Football Optimizer

This is a simple app that uses the https://github.com/JWally/jsLPSolver to determine the optimal team given constraints such as:

- a player can be selected only once;
- no more than 3 players can come from the same team;
- the total cost must be no more than £100 million.

In addition, users can place additional constraints, for example:
- one or more players must be in the team;
- one or more players must not be in the team;
- given a starting formation, reduce the cost of the eventual substitutes to effectively place all resources on our starting lineup.
