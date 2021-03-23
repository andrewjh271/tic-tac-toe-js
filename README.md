# Tic Tac Toe

Created as part of the Odin Project [curriculum](https://www.theodinproject.com/courses/javascript/lessons/tic-tac-toe-javascript). View [live page](https://andrewjh271.github.io/tic-tac-toe-js/).

###### Thoughts

I did my best to make use of Factory Functions and the Module Pattern to keep my code organized, readable, and out of the global scope. For this project I preferred the use of function expressions over declarations, though I'm still not sure if there was any reason to do this.

The AI uses a naive minimax algorithm, which has a couple interesting consequences:

- The algorithm has no preference for making moves that leave open the possibility for a win if with best play that win would not be realized.
- The algorithm has no preference for immediate wins. I don't find this to be an issue, since the ultimate win is at most only a few more moves away; I did, however, need to address this in [chess](https://github.com/andrewjh271/chess), since a game can go on indefinitely with a checkmate always on the horizon.

This code inside the minimax function produced a strange bug where not all moves would be undone after searching and evaluating them:

```javascript
availableMoves.forEach(index => {
	...
})
```

I couldn't reliably produce the bug, and sometimes could eliminate it just by adding a breakpoint and resuming execution. Using a `for` loop, though, always ran without issue:

```javascript
for (let i = 0; i < availableMoves.length; i++) {
	const index = availableMoves[i];
	...
}
```

It seems there is some issue with `forEach`, but I don't know what, since behavior that's tripped me up in the past (namely, no early termination) is what I wanted.

