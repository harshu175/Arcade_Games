class AudioController{
    constructor(){
        this.bgMusic = new Audio('Assets/Audio/creepy.mp3');
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.victorySound = new Audio('Assets/Audio/victory.wav');
        this.gameOverSound = new Audio('Assets/Audio/gameOver.wav');
        this.bgMusic.volume = 0.3;
        this.bgMusic.loop = true; 
    }

    startMusic(){
        this.bgMusic.play();
    }

    stopMusic(){
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip(){
        this.flipSound.play();
    }
    match(){
        this.matchSound.play();
    }
    victory(){
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver(){
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class MixOrMatch {
    constructor(totalTime, cards){
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remanining');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }
    startGame(){
        this.cardToCheck = null;
        this.timeRemaining = this.totalTime;
        this.totalClicks = 0;
        this.matchedCards = [];
        this.busy = true;
        
        setTimeout(() =>{
            this.audioController.startMusic();
            this.shhuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        },500);

        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }

    hideCards(){
        this.cardsArray.forEach(card =>{
            card.classList.remove('visible');
            card.classList.remove('matched');
        })
    }

    flipcard(card){
        if(this.canFlipCard(card) && this.cardsArray.indexOf(card) !== this.cardsArray.indexOf(this.cardToCheck)){
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck){
                this.checkForCardMatch(card);
            }else{
                this.cardToCheck = card;
            }
        }
    }

    checkForCardMatch(card){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck) && this.cardsArray.indexOf(card) !== this.cardsArray.indexOf(this.cardToCheck) ){
            this.cardMatched(card, this.cardToCheck);
        }else{
            this.cardMisMatch(card, this.cardToCheck);
        }

        this.cardToCheck = null;
    }

    cardMatched(card1, card2){
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);

        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        
        if(this.matchedCards.length === this.cardsArray.length){
            this.victory();
        }
    }

    cardMisMatch(card1, card2){
        this.busy = true;
        setTimeout(() =>{
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 500)
    }

    getCardType(card){
        return card.getElementsByClassName('card-value')[0].src;
    }

    startCountDown(){
        return setInterval(()=>{
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0){
                this.gameOver();
            }
        },1000);
    }

    gameOver(){
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add("visible");
    }

    victory(){
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add("visible");
    }

    shhuffleCards(){
        //fisher-yates-shuffle algorithm
        for(let i = this.cardsArray.length - 1; i > 0; i--){
            let randomInt = Math.floor(Math.random() * (i + 1));
            this.cardsArray[randomInt].style.order = i;
            this.cardsArray[i].style.order = randomInt;
        }
    }

    canFlipCard(card){
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.card);
    }
}


function ready(){
    let overlays = Array.from(document.getElementsByClassName("overlay-text"));
    let cards = Array.from(document.getElementsByClassName("card"));
    let game = new MixOrMatch(120, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener("click", () =>{
            overlay.classList.remove("visible");
            game.startGame();
        });
    })

    cards.forEach(card =>{
        card.addEventListener("click", () =>{
            game.flipcard(card);
        });
    })
}


if(document.readyState === 'loading'){
    document.addEventListener("DOMContentLoaded", ready());
}else{
    ready();
}
