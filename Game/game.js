//TODO Gjør pacman bevegli
//TODO Gi Spillet en FPS
//TODO Leg til en fiende
let gameLost = 0

class GridSystem { //TODO fortsette
    //TODO kommentere
    constructor(matrix, pacmanX, pacmanY) {
        this.matrix = matrix;
        this.uiContext = this.#makeCanvas(900, 900, "#000"); //hei
        this.outlineContext = this.#makeCanvas(0, 0, "#000");
        this.topContext = this.#makeCanvas(0, 0, "#000", true);
        this.cellSize = 24;
        this.padding = 1;
        this.pacman = {x: pacmanX, y: pacmanY, color: "orange"}
        this.matrix [pacmanY][pacmanX] = 3;
        this.dir = null;
        this.speed = 5;
        this.timer = 0;
        this.rotation = 0;
        this.gamelost = false;

        document.addEventListener("keydown", this.movePacman)
    }

    #fps() {
        if (this.timer === this.speed) {
            this.timer = 0;
            return true;
        }
        this.timer++
        return false;
    }

    #isValidMove(x, y) {
        if (this.matrix[this.pacman.y + y][this.pacman.x + x] === 0) {
            return true;
        }
        return false;
    }

    #updateMatrix(y, x, val) {
        this.matrix[y][x] = val;
    }

    #rotatePacman(){
        if (keyCode === 65) { // venstre
            this.rotation = 0;
        }
        if (keyCode === 65) { // høyre
            this.rotation = 180;
        }
        if (keyCode === 65) { // opp
            this.rotation = 90;
        }
        if (keyCode === 65) { // ned
            this.rotation = 270;
        }
   }

    movePacman = ({keyCode}) => {
        //document.addEventListener("keydown", this.#rotatePacman)
        if (this.#fps()) {
            if (this.rotation === 0) { // venstre
                if (this.#isValidMove(-1, 0 )) {
                    this.#updateMatrix(this.pacman.y, this.pacman.x, 0)
                    this.#updateMatrix(this.pacman.y, this.pacman.x - 1, 3)
                    this.pacman.x--;
                    //this.loadPosition();
                }
            }
            if (this.rotation === 180) { // høyre
                if (this.#isValidMove(1, 0)) {
                    this.#updateMatrix(this.pacman.y, this.pacman.x, 0)
                    this.#updateMatrix(this.pacman.y, this.pacman.x + 1, 3)
                    this.pacman.x++;
                    //this.loadPosition();
                }
            }
            if (this.rotation === 90) { // opp
                if (this.#isValidMove(0, -1)) {
                    this.#updateMatrix(this.pacman.y, this.pacman.x, 0)
                    this.#updateMatrix(this.pacman.y - 1, this.pacman.x, 3)
                    this.pacman.y--;
                    //this.loadPosition();
                }
            }
            if (this.rotation === 270) { // ned
                if (this.#isValidMove(0, 1)) {
                    this.#updateMatrix(this.pacman.y, this.pacman.x, 0)
                    this.#updateMatrix(this.pacman.y + 1, this.pacman.x, 3)
                    this.pacman.y++;
                    //this.loadPosition();
                }
            } else {
                return;
            }
        }
        this.loadPosition()
        setTimeout(this.movePacman(),1000/10)
    }

    #getCenter(w, h) { // Sentrerer tingen
        return {
            x: window.innerWidth / 2 - w / 2 + "px",
            y: window.innerHeight / 2 - h / 2 + "px"
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
        document.body.appendChild(this.canvas);

        return this.context;
    }
    
    #getContext() {
        this.context = this.canvas.getContext("2d");
        return this.context;
    }

    render() {
        const w = (this.cellSize + this.padding) * this.matrix[0].length - (this.padding)
        const h = (this.cellSize + this.padding) * this.matrix.length - (this.padding)

        this.outlineContext.canvas.width = w;
        this.outlineContext.canvas.height = h;

        this.topContext.canvas.width = w;
        this.topContext.canvas.height = h;

        const center = this.#getCenter(w, h);
        this.outlineContext.canvas.style.marginTop = center.y;
        this.outlineContext.canvas.style.marginLeft = center.x;

        this.topContext.canvas.style.marginLeft = center.x;
        this.topContext.canvas.style.marginTop = center.y;

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
        this.uiContext.fillText("Your mother fucker", 20, 30);
    }

    loadPosition() {
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

                if (cellVal === 3) {
                    this.topContext.fillStyle = this.pacman.color;
                    this.topContext.fillRect(col * (this.cellSize + this.padding),
                        row * (this.cellSize + this.padding),
                        this.cellSize, this.cellSize);
                }
            }

        }
    }
}
const gridMatrix = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 2, 2, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const gridSystem = new GridSystem(gridMatrix,14, 23);
gridSystem.render();
gridSystem.loadPosition();


