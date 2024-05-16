const prompt = require("prompt-sync")();

class UserInterface {
    constructor() {
        this.running = true;
        this.cards = [];
    }

    start() {
        while (this.running) {
            console.log("Would you like to view your scorecards (1) or make a new one (2) or quit (3)?");
            let input = Number(prompt("> "));
            if (input == 1) {
                this.showCards();
            } else if (input == 2) {
                this.makeCard();
            } else if (input == 3) {
                this.running = false;
            }
        }
    }

    showCards() {
        this.cards.forEach((obj) => console.log(`Name: ${obj.name}, Score: ${obj.card.calculateScore()}`));
        console.log("Would you like more info for a game (Y/N) ?")
        let input = prompt("> ");
        if (input == "Y") {
            console.log("Enter the name")
            let name = prompt("> ");
            let card = this.cards.filter((obj) => {
                if (obj.name == name) {
                    return obj.card;
                }
            })[0].card;
            console.log(card.frames);
        }
    }

    makeCard() {
        let card = new Scorecard();
        for (let i = 1 ; i < 10 ; i++) {
            console.log(`Enter the score for the first roll on frame ${i}`)
            let first = Number(prompt("> "));
            if (first == 10) {
                card.addFrame(first);
            } else {
                console.log(`Enter the score for second roll on frame ${i}`)
                let second = Number(prompt("> "));
                card.addFrame(first, second);
            }
        }
        console.log(`Enter the score for the first roll on frame 10`);
        let first = Number(prompt("> "));
        console.log(`Enter the score for the second roll on frame 10`);
        let second = Number(prompt("> "));
        if (first + second >= 10) {
            console.log(`Enter the score for the third roll on frame 10`);
            let third = Number(prompt("> "));
            card.addFrame(first, second, third);
        } else {
            card.addFrame(first, second);
        }
        console.log(`Your final score is ${card.calculateScore()}`);
        console.log("Would you like to save this card (Y/N)?")
        let save = prompt("> ")
        if (save == 'Y') {
            console.log("Please enter a name for this game")
            let name = prompt("> ")
            this.cards.push(
                {
                    name: name,
                    card: card
                }
            )
        }
    }
}

class Frame {
    constructor(first, second) {
        this.first_roll = first;
        this.second_roll = second;
        this.bonus = 0;
    }
}

class Scorecard {
    constructor() {
        this.frames = []
    }

    addFrame(first, second, third) {
        if (second == undefined) {
            second = 0;
        }
        let frame = new Frame(first, second);
        if (third != undefined) {
            frame.bonus = third;
        }
        this.frames.push(frame);
    }

    calculateBonus() {
        for (let i = 0 ; i < this.frames.length - 1 ; i++) {
            // This is very ugly. Oh well!
            if (this.frames[i].first_roll == 10) {
                if (this.frames[i+1].first_roll != undefined && this.frames[i+1].second_roll != 0) {
                    this.frames[i].bonus = this.frames[i+1].first_roll + this.frames[i+1].second_roll;
                } else if (this.frames[i+1].first_roll != undefined && this.frames[i+2] != undefined) {
                    this.frames[i].bonus = this.frames[i+1].first_roll + this.frames[i+2].first_roll;
                }    
            } else if (this.frames[i].first_roll + this.frames[i].second_roll == 10 && this.frames[i+1].first_roll != undefined) {
                this.frames[i].bonus = this.frames[i+1].first_roll;
            }
        }
    }

    calculateScore() {
        let score = 0;
        this.calculateBonus();
        this.frames.forEach((frame) => {
            score += (frame.first_roll + frame.second_roll + frame.bonus);
        });
        return score;
    }
}

const u = new UserInterface();
u.start();