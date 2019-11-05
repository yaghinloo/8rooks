/**
 * 8 Rooks game
 * this class creates a NxN board
 */
class Game {
    constructor(size = 8, container = "game") {
        this.boardSize = size;
        this.board = Array.from(Array(size), () => Array(size).fill(1));
        this.rooks = [];
        this.isSolved = false;
        this.container = document.getElementById(container);
        this.attachEvents();
        this.render();
    }

    /**
     * attach click handlers
     */
    attachEvents() {
        this.container.addEventListener("click", this.HandleClicks.bind(this));
        document.getElementById("add-rook").addEventListener("click", () => {
            this.addRook();
            this.update();
        });
        document.getElementById("solve").addEventListener("click", () => {
            if (this.isSolved) return;
            const solverTime = setInterval(() => {
                if (this.isSolved) clearInterval(solverTime);
                this.addRook();
                this.update();
            }, 1000)
        })
    }

    HandleClicks(e) {
        if (!e.target.classList.contains("spot")) return;
        let {x, y} = e.target.dataset;
        x = Number(x);
        y = Number(y);
        if (!this.board[x][y]) {
            this.removeRook(x, y);

        } else {
            this.addRook(x, y)
        }
        this.update();
        console.log("clicked", x, y)

    }

    update() {
        this.render()
    }

    /**
     *  removes Rook from x,y coordinates
     * @param _x
     * @param _y
     */
    removeRook(_x, _y) {
        this.board[_x][_y] = 1;
        this.rooks = this.rooks.filter(({x, y}) => !(x === _x && y === _y));
        this.isSolved = false;
    }

    /**
     * add Rook on x,y coords
     * @param x
     * @param y
     * @returns {boolean}
     */
    addRook(x, y) {
        if (typeof x == 'undefined' || typeof y == 'undefined') [x, y] = this.findRandomSpot();
        if (x === -1 || y === -1) {
            this.error();
            return false
        }
        if (this.isSolved) return false;
        if (this.noHit(x, y)) {
            this.rooks.push({x, y});
            this.board[x][y] = 0;
            if (this.rooks.length === this.boardSize) {
                this.isSolved = true;
            }
            return true
        } else {
            this.error();
            return false
        }
    }

    /**
     * verify if the new Rook can sit in the coords x,y without crossing other pieces
     * @param x
     * @param y
     * @returns {boolean}
     */
    noHit(x, y) {
        if (this.board[x][y] === 0) return false;
        let horizontal = true;
        let vertical = true;

        for (let i of this.board[x]) {
            if (!i) {
                horizontal = false;
                break;
            }
        }
        for (let r of this.board) {
            if (!r[y]) {
                vertical = false;
                break
            }
        }
        return (horizontal && vertical)
    }

    /**
     * finds a random place between available places
     * @returns {number[]|*[]}
     */
    findRandomSpot() {
        const unAvailableX = this.rooks.map(elm => elm.x) || [];
        const unAvailableY = this.rooks.map(elm => elm.y) || [];
        let xIndex = 0;
        let yIndex = 0;
        const availableX = Array(this.boardSize).fill(0).map(() => xIndex++).filter(elm => !unAvailableX.includes(elm));
        const availableY = Array(this.boardSize).fill(0).map(() => yIndex++).filter(elm => !unAvailableY.includes(elm));
        if (!availableX.length || !availableY.length) {
            return [-1, -1]
        }

        return [
            availableX [Math.floor(availableX.length * Math.random())],
            availableY[Math.floor(availableY.length * Math.random())]
        ]
    }

    /**
     * in the case of error change the border colors to red
     */
    error() {
        this.container.classList.add("error");
        setTimeout(() => {
            this.container.classList.remove("error");
        }, 1000)
    }

    /**
     * draw the board
     */
    render() {
        let output = "";
        for (let [i, row] of this.board.entries()) {
            output += "<div class='game-row'>";
            output += row.reduce((acc, elm, idx) => {

                acc += elm ? `<div data-y='${idx}' data-x='${i}' class='free-spot spot'></div>`
                    : `<div data-y='${idx}' data-x='${i}' class='rook-spot spot'></div>`;
                return acc;
            }, "");
            output += "</div>"
        }
        this.container.innerHTML = output;
    }
}



