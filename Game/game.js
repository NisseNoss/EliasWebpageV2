//TODO Leg til en fiende
class GridSystem { //TODO fortsette
    //TODO kommentere - Kristoffer
    constructor(matrix, pacmanX, pacmanY, blinkyX, blinkyY) { //Lager mange lag som ligger oppå hverandre for å vise siden og definerer disse.
        this.matrix = matrix;
        this.uiContext = this.#makeCanvas(850, 850, "#000");
        this.outlineContext = this.#makeCanvas(0, 0, "#000");
        this.coinContext = this.#makeCanvas(0, 0, "#000", true);
        this.topContext = this.#makeCanvas(0, 0, "#000", true);
        //maze størelse
        this.cellSize = 24;
        this.padding = 1;
        //Pacman
        this.pacman = {x: pacmanX, y: pacmanY, color: "orange"}
        this.matrix [pacmanY][pacmanX] = 3;
        this.rotation = 0;

        //Blinky
        this.blinky = {x: blinkyX, y: blinkyY, color: "red"};
        this.matrix [blinkyY][blinkyX] = 5;
        this.rotationB = 0;
        this.bTile = 0;

        //game variabler
        this.FPS = 5;
        this.play = false;
        this.lost = false;
        this.dotCount = null; //Setter dotCount til NULL istede for 0, fordi dotCount === 0 vil slutte av programmet lengre nede

        document.addEventListener("keydown", this.#rotatePacman) //Koden hører alltid etter et innput fra tasturet til brukeren
    }

    /*#fps() {
        if (this.timer === this.speed) {
            this.timer = 0;
            return true;
        }
        this.timer++
        return false;
    }*/

    uiUpdate() { //Oppdaterer UI laget der score og tid er vist
        this.uiContext.clearRect(0,0,900,900) //Sletter vekk alt på laget, slik at ny up-to-date kan bli plassert under.
        this.uiContext.fillText("Score: " + score, 20, 30); //Skriver opp igjen Score

    }

    #isValidMove(x, y) {
        if (this.matrix[this.pacman.y + y][this.pacman.x + x] === 0) {
            return true;
        }
        else if (this.matrix[this.pacman.y + y][this.pacman.x + x] === 4) {
            score = score + 10;
            //time++;
            return true;
        }
        return false;
    }

    #updateMatrix(y, x, val) {
        this.matrix[y][x] = val;
    }

    #rotatePacman = ({keyCode}) =>{
        this.play = true;

        if (keyCode === 65) { // venstre
            this.rotation = 0;
            console.log("a pressed");
        }
        else if (keyCode === 68) { // høyre
            this.rotation = 180;
            console.log("d pressed");
        }
        else if (keyCode === 87) { // opp
            this.rotation = 90;
            console.log("w pressed");
        }
        else if (keyCode === 83) { // ned
            this.rotation = 270;
            console.log("s pressed");
        }
   }

   isValidBlinky(x, y) {
       if (this.matrix[this.blinky.y + y][this.blinky.x + x] === 0) {
           return true;
       }
       else if (this.matrix[this.blinky.y + y][this.blinky.x + x] === 4) {
           return true;
       }
       else if (this.matrix[this.blinky.y + y][this.blinky.x + x] === 3) {
           return true
       }
       return false;
   }

   makeValueBlinky(x, y) {
       this.bPosX = this.blinky.x + x - this.pacman.x;
       this.bPosY = this.blinky.y + y - this.pacman.y;
   }

   findDirB() {
       this.svar1 = 100;
       this.svar2 = 100;
       this.svar3 = 100;
       if (this.rotationB === 90) {//Opp
           if (this.isValidBlinky(0, -1)) { // Sjekker Opp
               this.makeValueBlinky(0, -1);
               this.svar1 = Math.sqrt(this.bPosX * this.bPosX + this.bPosY * this.bPosY);
           }

           if (this.isValidBlinky(1, 0)) { // Sjekker høyre
               this.makeValueBlinky(1, 0);
               this.svar2 = Math.sqrt(this.bPosX * this.bPosX + this.bPosY * this.bPosY);
           }

           if (this.isValidBlinky(-1, 0)) { // Sjekker venstre
               this.makeValueBlinky(-1, 0);
               this.svar3 = Math.sqrt(this.bPosX * this.bPosX + this.bPosY * this.bPosY);
           }

           this.value = {svar1: this.svar1, svar2: this.svar2, svar3: this.svar3}, this.min = Infinity, this.key;
           for (let i in this.value) {
               if (this.value[i] < this.min) {
                   this.min = this.value[i]
                   this.key = i;
               }
           }
          //console.log("Opp"+this.key);
           if (this.key === "svar1") { // opp
               this.rotationB = 90
           }
           else if (this.key === "svar2") { // Høyre
               this.rotationB = 180
           }
           else if (this.key === "svar3") { // Venstre
               this.rotationB = 0
           }
           if (this.svar1 === 100 && this.svar2 === 100) {
               if (this.svar1 === 100 && this.svar3 === 100){
                   this.rotationB = 90
               }
           }
       }
       else if(this.rotationB === 180) {//høyre
           if (this.isValidBlinky(0, -1)) { // Sjekker Opp
               this.makeValueBlinky(0, -1);
               this.svar1 = Math.sqrt(this.bPosX * this.bPosX + this.bPosY * this.bPosY);
           }
           if (this.isValidBlinky(1, 0)) { //Sjekker høyre
               this.makeValueBlinky(1, 0);
               this.svar2 = Math.sqrt(this.bPosX * this.bPosX + this.bPosY * this.bPosY);
           }
           if (this.isValidBlinky(0, 1)) {  //Sjekker ned
               this.makeValueBlinky(0, 1);
               this.svar3 = Math.sqrt(this.bPosX * this.bPosX + this.bPosY * this.bPosY);
           }
           this.value = {svar1: this.svar1, svar2: this.svar2, svar3: this.svar3}, this.min = Infinity, this.key;
           for (let i in this.value) {
               if (this.value[i] < this.min) {
                   this.min = this.value[i]
                   this.key = i;
               }
           }
           //console.log("Høyre "+this.key);
           if (this.key === "svar1") {
               this.rotationB = 90
           }
           else if (this.key === "svar2") {
               this.rotationB = 180
           }
           else if (this.key === "svar3") {
               this.rotationB = 270
           }
           if (this.svar1 === 100 && this.svar2 === 100) {
               if (this.svar1 === 100 && this.svar3 === 100){
                   this.rotationB = 180
               }
           }
       }
       else if (this.rotationB === 270) {//ned
           if (this.isValidBlinky(1, 0)) {
               this.makeValueBlinky(1, 0); //Sjekker høyre
               this.svar1 = Math.sqrt(this.bPosX * this.bPosX + this.bPosY * this.bPosY);
           }
           if (this.isValidBlinky(0, 1)) {  //Sjekker ned
               this.makeValueBlinky(0, 1);
               this.svar2 = Math.sqrt(this.bPosX * this.bPosX + this.bPosY * this.bPosY);
           }
           if (this.isValidBlinky(-1, 0)) { // Sjekker venstre
               this.makeValueBlinky(-1, 0);
               this.svar3 = Math.sqrt(this.bPosX * this.bPosX + this.bPosY * this.bPosY);
           }
           this.value = {svar1: this.svar1, svar2: this.svar2, svar3: this.svar3}, this.min = Infinity, this.key;
           for (let i in this.value) {
               if (this.value[i] < this.min) {
                   this.min = this.value[i]
                   this.key = i;
               }
           }
           //console.log("Ned" +this.key);
           if (this.key === "svar1") {
               this.rotationB = 180
           }
           else if (this.key === "svar2") {
               this.rotationB = 270
           }
           else if (this.key === "svar3") {
               this.rotationB = 0
           }
           if (this.svar1 === 100 && this.svar2 === 100) {
               if (this.svar1 === 100 && this.svar3 === 100){
                   this.rotationB = 270
               }
           }
       }
       else if (this.rotationB === 0) {//venstre
           if (this.isValidBlinky(0, -1)) { // Sjekker Opp
               this.makeValueBlinky(0, -1);
               this.svar1 = Math.sqrt(this.bPosX * this.bPosX + this.bPosY * this.bPosY);
           }
           if (this.isValidBlinky(0, 1)) {  //Sjekker ned
               this.makeValueBlinky(0, 1);
               this.svar2 = Math.sqrt(this.bPosX * this.bPosX + this.bPosY * this.bPosY);
           }
           if (this.isValidBlinky(-1, 0)) { // Sjekker venstre
               this.makeValueBlinky(-1, 0);
               this.svar3 = Math.sqrt(this.bPosX * this.bPosX + this.bPosY * this.bPosY);
           }
           this.value = {svar1: this.svar1, svar2: this.svar2, svar3: this.svar3}, this.min = Infinity, this.key;
           for (let i in this.value) {
               if (this.value[i] < this.min) {
                   this.min = this.value[i]
                   this.key = i;
               }
           }
           //console.log("Venstre "+this.key);
           if (this.key === "svar1") {
               this.rotationB = 90
           }
           else if (this.key === "svar2") {
               this.rotationB = 270
           }
           else if (this.key === "svar3") {
               this.rotationB = 0
           }
           if (this.svar1 === 100 && this.svar2 === 100) {
               if (this.svar1 === 100 && this.svar3 === 100){
                   this.rotationB = 0
               }
           }
       }
    }

    /*findDir() {
        this.value = this.findLogic(), this.min = Infinity, this.key;
        for (let i in this.value) {
            if (this.value[i] < this.min) {
                this.min = this.value[i]
                this.key = i;
            }
        }
        console.log(this.key)
    }*/

    moveBlinky() {
        this.findDirB()
        if (this.rotationB === 0) { // Venstre
            //console.log("Venstre")
            if (this.isValidBlinky(-1, 0)) {

                this.#updateMatrix(this.blinky.y, this.blinky.x, this.bTile);
                this.bTile = this.matrix[this.blinky.y][this.blinky.x - 1];
                this.#updateMatrix(this.blinky.y, this.blinky.x - 1, 5);
                this.blinky.x--;

            }

        }
        if (this.rotationB === 180) { // Høyre
            //console.log("Høyre")
            if (this.isValidBlinky(1, 0)) {

                this.#updateMatrix(this.blinky.y, this.blinky.x, this.bTile)
                this.bTile = this.matrix[this.blinky.y][this.blinky.x + 1]
                this.#updateMatrix(this.blinky.y, this.blinky.x + 1, 5)
                this.blinky.x++;

            }

        }
        if (this.rotationB === 90) { // Opp
            //console.log("Opp")
            if (this.isValidBlinky(0, -1)) {

                this.#updateMatrix(this.blinky.y, this.blinky.x, this.bTile)
                this.bTile = this.matrix[this.blinky.y - 1][this.blinky.x]
                this.#updateMatrix(this.blinky.y - 1, this.blinky.x, 5)
                this.blinky.y--;

            }
        }
        if (this.rotationB === 270) { // Ned
            //console.log("Ned")
            if (this.isValidBlinky(0, 1)) {

                this.#updateMatrix(this.blinky.y, this.blinky.x, this.bTile)
                this.bTile = this.matrix[this.blinky.y + 1][this.blinky.x]
                this.#updateMatrix(this.blinky.y + 1, this.blinky.x, 5)
                this.blinky.y++;

            }
        }
    }


    movePacman() {
        if (this.rotation === 0) { // Venstre
            if (this.#isValidMove(-1, 0)) {
                this.#updateMatrix(this.pacman.y, this.pacman.x, 0)
                this.#updateMatrix(this.pacman.y, this.pacman.x - 1, 3)
                this.pacman.x--;
            }
        }
        if (this.rotation === 180) { // Høyre
            if (this.#isValidMove(1, 0)) {
                this.#updateMatrix(this.pacman.y, this.pacman.x, 0)
                this.#updateMatrix(this.pacman.y, this.pacman.x + 1, 3)
                this.pacman.x++;
            }
        }
       if (this.rotation === 90) { // Opp
           if (this.#isValidMove(0, -1)) {
               this.#updateMatrix(this.pacman.y, this.pacman.x, 0)
               this.#updateMatrix(this.pacman.y - 1, this.pacman.x, 3)
               this.pacman.y--;
           }
       }
       if (this.rotation === 270) { // Ned
           if (this.#isValidMove(0, 1)) {
               this.#updateMatrix(this.pacman.y, this.pacman.x, 0)
               this.#updateMatrix(this.pacman.y + 1, this.pacman.x, 3)
               this.pacman.y++;
           }
       }
    }


    #getCenter(w, h) { // Sentrerer tingen
        return {
            x: window.innerWidth / 2 - w / 2 + "px",
            y: window.innerHeight / 2 - h / 2 - 20 + "px"
        };
    }

    #makeCanvas(w, h, color = "#111", isTransparent = false) {
        this.canvas = document.createElement("canvas");
        this.context = this.#getContext()
        //this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width = w;
        this.height = this.canvas.height = h;
        this.canvas.style.position = "absolute";
        this.canvas.style.background = color;
        if (isTransparent) {
            this.canvas.style.backgroundColor = "transparent";
        }
        const center = this.#getCenter(w, h);
        this.canvas.style.marginLeft = center.x;
        this.canvas.style.marginTop = center.y;
        document.body.appendChild(this.canvas); //IMPORTANT DO NOT TOUCH

        return this.context;
    }
    
    #getContext() {
        this.context = this.canvas.getContext("2d");
        return this.context;
    }

    render() { // Render Maze
        const w = (this.cellSize + this.padding) * this.matrix[0].length - (this.padding)
        const h = (this.cellSize + this.padding) * this.matrix.length - (this.padding)

        this.outlineContext.canvas.width = w;
        this.outlineContext.canvas.height = h;

        const center = this.#getCenter(w, h); //TODO Finn ut av dette i 17/11
        this.outlineContext.canvas.style.marginTop = center.y;
        this.outlineContext.canvas.style.marginLeft = center.x;

        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[row].length; col++) {
                const cellVal = this.matrix[row][col];
                let color = "#111";

                if (cellVal === 1) {
                    color = "#4488FF";
                } else if (cellVal === 2) {
                    color = "#FFCBFF";
                }  /*else if (cellVal === 3) {
                    color = this.pacman.color;
                }*/
                this.outlineContext.fillStyle = color;
                this.outlineContext.fillRect(col * (this.cellSize + this.padding),
                    row * (this.cellSize + this.padding),
                    this.cellSize, this.cellSize);
            }
        }
        this.uiContext.font = "20px Courier";
        this.uiContext.fillStyle = "#fff";
    }

    loadCoins() {
        this.dotCount = 0;
        const w = (this.cellSize + this.padding) * this.matrix[0].length - (this.padding);
        const h = (this.cellSize + this.padding) * this.matrix.length - (this.padding);

        this.coinContext.canvas.width = w;
        this.coinContext.canvas.height = h;

        const center = this.#getCenter(w, h);
        this.coinContext.canvas.style.marginLeft = center.x;
        this.coinContext.canvas.style.marginTop = center.y;

        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[row].length; col++) {
                const cellVal = this.matrix[row][col];


                if (cellVal === 4) {
                    this.dotCount++
                    this.coinContext.fillStyle = "#ecc400";
                    this.coinContext.fillRect(col * (this.cellSize + this.padding) + 7.5,
                        row * (this.cellSize + this.padding) + 7.5,
                        this.cellSize-15, this.cellSize - 15 );
                }
            }
        }
    }

    loadPosition() { // Renders Pacman and enemies
        const w = (this.cellSize + this.padding) * this.matrix[0].length - (this.padding);
        const h = (this.cellSize + this.padding) * this.matrix.length - (this.padding);

        this.topContext.canvas.width = w;
        this.topContext.canvas.height = h;

        const center = this.#getCenter(w, h);
        this.topContext.canvas.style.marginLeft = center.x;
        this.topContext.canvas.style.marginTop = center.y;

        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[row].length; col++) {
                const cellVal = this.matrix[row][col];

                this.topContext.globalCompositeOperation = 'destination-out';

                if (cellVal === 3) {
                    this.loadcolor = this.pacman.color;
                    this.topContext.globalCompositeOperation = "source-over";
                }
                if (cellVal === 5) {
                    this.topContext.globalCompositeOperation = "source-over";
                    this.loadcolor = this.blinky.color;
                }

                this.topContext.fillStyle = this.loadcolor;
                this.topContext.fillRect(col * (this.cellSize + this.padding),
                    row * (this.cellSize + this.padding),
                    this.cellSize, this.cellSize);

            }
        }
    }
}

//Setter opp hvordan Matrix gridden skal være
let gridMatrix = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
    [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
    [1, 4, 1, 0, 0, 1, 4, 1, 0, 0, 0, 1, 4, 1, 1, 4, 1, 0, 0, 0, 1, 4, 1, 0, 0, 1, 4, 1],
    [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
    [1, 4, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 4, 1],
    [1, 4, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 4, 1],
    [1, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 1],
    [1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 4, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 4, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 1, 1, 1, 2, 2, 1, 1, 1, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
    [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
    [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
    [1, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 1],
    [1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1],
    [1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1],
    [1, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 1],
    [1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1],
    [1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
let lives = 3
let score = 0 //Setter start score
let level = 0; //Setter start level
//let time = 100; //Setter start tiden
let gridSystem;
gridSystem = new GridSystem(gridMatrix,14, 23, 13, 11); //Setter start posisjonen til pacman og lager alt du ser og mer
gridSystem.render();

function gameLoop() { // Tatt fra https://github.com/KristianHelland/worm
    if (gridSystem.play) {
        gridSystem.movePacman();
        gridSystem.moveBlinky();
        //time = time - 1;
        //console.log(time)
    }
    if (gridSystem.dotCount === 0) { //Når antall dots i gridden blir lik 0, så blir gridden og pacman resatt, men med litt mindre tid for hver gang, til tiden går ut
        level++; //Øker level med 1
        //time = 100 - level*10; //setter at tiden er 100 minus level gange 10
        gridMatrix.length = 0; //tømmer gridden
        
        //Tegner opp gridden på nytt
        gridMatrix = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
            [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
            [1, 4, 1, 0, 0, 1, 4, 1, 0, 0, 0, 1, 4, 1, 1, 4, 1, 0, 0, 0, 1, 4, 1, 0, 0, 1, 4, 1],
            [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
            [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
            [1, 4, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 4, 1],
            [1, 4, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 4, 1],
            [1, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 1],
            [1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 4, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 4, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 1, 1, 1, 2, 2, 1, 1, 1, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1],
            [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
            [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
            [1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1],
            [1, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 1],
            [1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1],
            [1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 1],
            [1, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 1],
            [1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1],
            [1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1],
            [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        gridSystem = new GridSystem(gridMatrix,14, 23, 13, 11); //Plasserer pacman på start posisjon
        gridSystem.render();
        console.log(score); //Skriver ut scoren i consolen
    }
    if(gridSystem.matrix[gridSystem.pacman.y][gridSystem.pacman.x] === gridSystem.matrix[gridSystem.blinky.y][gridSystem.blinky.x]) { //Dette skjer når tiden går ut
        //TODO legg til game over screen
        lives--
        gridSystem = new GridSystem(gridMatrix,14, 23, 13, 11); //Plasserer pacman på start posisjon

        if (lives === 0) {
            console.log("Game over"); //Logger "game over" i console
            console.log(score); //Logger så scoren i console
            gridSystem.uiUpdate(); //Oppdaterer ui en siste gang
            return; //Går ut av gameloopen som betyr at spillet stopper
        }
    }
    //Hvis "if(time <= 0)" ikke er sann, så kjøres de neste 4 linjer med kode.
    gridSystem.loadCoins(); //Loader inn nye coins
    gridSystem.loadPosition(); //Loader posisjon til pacman på nytt
    gridSystem.uiUpdate(); //Oppdaterer ui
    setTimeout(gameLoop, 1000/gridSystem.FPS); //'1000 millisekund delt på 5fps'- sekunders pause før gameloop kjøres igjen.
}
//Dette kjøres etter return skjer fra "if(time <= 0) "
gameLoop();
console.log(gridSystem.dotCount);
console.log(score);
