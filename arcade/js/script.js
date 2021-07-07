let game1 = document.getElementById('game-1');
let game2 = document.getElementById('game-2');
let game3 = document.getElementById('game-3');
let play_game = document.getElementById('play-game');


game1.addEventListener("click", function(){
  location.assign('shooter/index.html');
})
play_game.addEventListener("click", function(){
  location.assign('shooter/index.html');
})
game2.addEventListener("click", function(){
  location.assign('Memory_game/memory.html');
})
game3.addEventListener("click", function(){
  location.assign('tic-tac-toe/index.html');
})
