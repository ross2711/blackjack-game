$(document).ready(function(){  //The main entry point of most jQuery applications.
    var userHand;       //Global variable
    var dealerHand;     //Global variable

    //Start button
    $('#start').click(function(){   //Start button clicked
        $(this).css('visibility', 'hidden');     //Start button hidden after click
        $('#stand, #hit').css('visibility', 'visible');    //Stand and Hit button visible after Start click
        userHand = new Hand();      // a copy of new Hand is created called userHand - userHand global variable now created
        $('#userScore').text("Your score is " + userHand.getScore() + "." + " Your hand is " + userHand.printHand());   //User score and hand text now printed on screen
        displayCards(userHand, "#userCards"); //User cards now displayed on screen
    })

    //Hit button
    $('#hit').click(function(){     //Hit button clicked
        userHand.hitMe();         //appends another card to the userHand card array
        if (userHand.getScore() < 21) {     //if user score is less than 21 - score & hand is displayed
            $('#userScore').text("Your score is " + userHand.getScore() + "." + " Your hand is " + userHand.printHand());
        } else if (userHand.getScore() === 21) {    //if user score is equal to 21 - score & full house is displayed
            $('#userScore').text("Your score is " + userHand.getScore() + "." + " Full House!");
            $('#stand').click();                    //Stand button is clicked - in turn allowing the dealer to play
        } else {                                    //if score is greater than 21 - score & 'you are out' is displayed
            $('#userScore').text("Your score is " + userHand.getScore() + "." + " You are out");
            $('#stand').click();                    //Stand button is clicked - in turn allowing the dealer to play
        }
        displayCards(userHand, "#userCards");     //displays userHand cards on screen
    });

    //Stand button
    $('#stand').click(function(){   //Stand button clicked
        $(this).css('visibility', 'hidden');     //removes stand button from the screen
        $('#hit').css('visibility', 'hidden');       //Hit button no longer required.
        dealerHand = new Hand();    // a copy of new Hand is created called dealerHand - dealerHand global variable now created
        while (dealerHand.getScore() < 17) {    //while dealer score is less than 17, statement is true
            dealerHand.hitMe();     //appends another card to the dealerHand card array
        }
        $('#dealerScore').text("Dealer's score is " + dealerHand.getScore() + "." + " Dealer's hand is " + dealerHand.printHand());    //Dealer score and hand text now printed on screen
        $('#declareWinner').text(declareWinner(userHand, dealerHand)).css('visibility', 'visible');  //Winner declared
        displayCards(dealerHand, "#dealerCards");     //dealer cards now displayed on screen
        $('#playAgain').css('visibility','visible');    //Play Again button now visible
    });

    //Play again button
    $('#playAgain').click(function() {
        $(this).css('visibility', 'hidden');        //hides the play again button
        $('#userCards, #dealerCards').empty();      //removes the user and dealer cards from the table
        $('#start').css('visibility', 'visible');   //start button is now visible
        $('#dealerScore').html('&nbsp;');              //adds a non breaking space
        $('#declareWinner').css('visibility', 'hidden'); //declareWinner is now hidden
        $('#userScore').text("To begin, click Start");
    });

    // Declare Winner
    function declareWinner(userHand, dealerHand){
        var userscore = userHand.getScore();
        var dealerscore = dealerHand.getScore();
        if (userscore > 21) {
            if (dealerscore > 21) {
                return "You tied!";
            } else {
                return "You lose!";
            }
        } else if (dealerscore > 21) {
            return "You win!";
        } else {
            if (userscore > dealerscore) {
                return "You win!";
            } else if (userscore === dealerscore) {
                return "You tied!";
            } else {
                return "You lose!";
            }
        }
    }

    // Display cards on table
    function displayCards (hand, element) {
        $(element).empty();     // removes cards displayed on screen
        var cards = hand.getHand();        // [card1,card2]
        for (var i=0; i<cards.length; i++) {
            var suit = cards[i].getSuit();      //goes through the card array and returns the suit
            var number = cards[i].getNumber();  //goes through the card array and returns the number
            $(element).append("<div class='card'><img width='100' src='png/" + number + "_of_" + suit.toLowerCase() + ".png'></div>")
        }
    }

    // Card Constructor
    function Card (s,n) {   // sets up the suit and value of the card
        var suit = s;       // parameter is a private variable
        var number = n;     // parameter is a private variable

        // Returns the suit name (accessible outside the Card Constructor)
        this.getSuit = function() {
            switch(suit) {
                case 1:
                    return "Spades";
                case 2:
                    return "Hearts";
                case 3:
                    return "Diamonds";
                case 4:
                    return "Clubs";
            }
        };

        // Returns face cards and regular numbers (accessible outside the Card Constructor)
        this.getNumber = function() {
            switch(number) {
                case 1:
                    return "Ace";
                case 11:
                    return "Jack";
                case 12:
                    return "Queen";
                case 13:
                    return "King";
                default:
                    return number;
            }
        };

        // Returns the numerical value of the card (accessible outside the Card Constructor)
        this.getValue = function() {
            if (number === 11 || number === 12 || number === 13) {
            return 10;
            } else if (number === 1) {
                return 11;
            } else {
                return number;
            }
        };
    }

    // Deal function creates a random number for suit and card number, returns a new card object
    var deal = function () {
        var randomNumSuit = Math.floor(Math.random()*4+1);  // Create a random number between 1 and 4
        var randomNumNumber = Math.floor(Math.random()*13+1);  // Create a random number between 1 and 13
        return new Card(randomNumSuit, randomNumNumber);   // Make and return a new Card by passing in these random numbers as parameters
    };

    // Hand Constructor - sets up cards and related methods. Hand contains the Card as an internal variable
    function Hand () {
        var card1 = deal();  // private variable to hold our cards.
        var card2 = deal();  // private variable to hold our cards.
        var cards = [card1, card2];  // private array variable to hold our cards - created using Card objects
        //console.log(cards);

        // Returns the array of cards - card1 and card2 (now accessible outside the Card Constructor)
        this.getHand = function() {
            return cards;
        };

        // Returns the score (now accessible outside the Card Constructor)
        this.getScore = function() {
            var runningTotal = 0;     // new variable to hold the running total
            var numberAces = 0;     // new variable to hold the number of aces
            for (var i=0; i<cards.length; i++) {
                runningTotal = runningTotal + cards[i].getValue(); // steps through the cards (output from get.Hand) array and passes through getValue method within the Card Constructor
                if (cards[i].getValue() === 11) {    // go through the card array and if the output from .getValue is 11, the variable numberAces increases by 1.
                    numberAces++;
                }
            }
            // handle aces.
            if (runningTotal > 21 && numberAces > 0) {
                for (var j=0; j<numberAces; j++) {         // if condition above is true, Step through the numberAces
                    runningTotal = runningTotal - 10;       // decrease running total by 10 each time
                    if (runningTotal <= 21) {       // check if the total is equal to or less than 21, if true then 'break'
                        break;
                    }
                }
            }
            return runningTotal;
        };

        // Adds another card to the array
        this.hitMe = function () {
            var hit = deal();   // creates a new card using the deal function (now accessible outside the Card Constructor)
            cards.push(hit);    // appends to the cards array
        };

        // Prints the cards in hand
        this.printHand = function () {
            var text = '';
            for (var i=0; i<cards.length; i++) {
                text = text + cards[i].getNumber() + ' of ' + cards[i].getSuit(); // passes through the cards array, returning the number of the card and returning the suit
                if (i === cards.length - 1) {     // if we have reached the end of the array, we will add a full stop.
                    text = text + '.';
                } else {
                    text = text + ', ';   // else we will add a comma.
                }
            }
            return text;    // once the for loop is complete we will return the text.
        };

    }

});  // jQuery End.
