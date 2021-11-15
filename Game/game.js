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
        //pacman
        this.pacman = {x: pacmanX, y: pacmanY, color: "orange"}
        this.matrix [pacmanY][pacmanX] = 3;
        this.rotation = 0;

        //Blinky
        this.blinky = {x: blinkyX, y: blinkyY, color: "red"};
        this.matrix [blinkyY][blinkyX] = 5;
        this.rotationB = 0;

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
        this.uiContext.fillText("Time: " + time, 720 , 30); //Skriver opp igjen Time

    }

    #isValidMove(x, y) {
        if (this.matrix[this.pacman.y + y][this.pacman.x + x] === 0) {
            return true;
        }
        else if (this.matrix[this.pacman.y + y][this.pacman.x + x] === 4) {
            score = score + 10;
            time++;
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

        const center = this.#getCenter(w, h);
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
                this.loadcolor = null;

                if (cellVal === 3) {
                    this.topContext.globalCompositeOperation = "copy";
                    this.loadcolor = this.pacman.color;
                }
                if (cellVal === 5) {
                    this.topContext.globalCompositeOperation = "copy";
                    this.loadcolor = this.blinky.color;
                }
                else {
                    this.topContext.globalCompositeOperation = 'destination-out';
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
let score = 0 //Setter start score
let level = 0; //Setter start level
let time = 100; //Setter start tiden
let gridSystem;
gridSystem = new GridSystem(gridMatrix,14, 23, 14, 15); //Setter start posisjonen til pacman og lager alt du ser og mer
gridSystem.render();

function gameLoop() { // Tatt fra https://github.com/KristianHelland/worm
    if (gridSystem.play) {
        gridSystem.movePacman();
        time = time - 1;
        console.log(time)
    }
    if (gridSystem.dotCount === 0) { //Når antall dots i gridden blir lik 0, så blir gridden og pacman resatt, men med litt mindre tid for hver gang, til tiden går ut
        level++; //Øker level med 1
        time = 100 - level*10; //setter at tiden er 100 minus level gange 10
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
        gridSystem = new GridSystem(gridMatrix,14, 23, 14, 15); //Plasserer pacman på start posisjon
        gridSystem.render();
        console.log(score); //Skriver ut scoren i consolen
    }
    if(time <= 0) { //Dette skjer når tiden går ut
        //TODO legg til game over screen
        console.log("Game over"); //Logger "game over" i console
        console.log(score); //Logger så scoren i console
        gridSystem.uiUpdate(); //Oppdaterer ui en siste gang
        return; //Går ut av gameloopen som betyr at spillet stopper
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
