var BOARD_SIZE = 500;

(function() {

  var Board = {
    
    // backend
    board    : [],
    selected : null,
    moved    : false,
    moving   : false,

    // frontend
    ctx: null,

    initBackend: function() {

      // initialize board
      for (var i = 0; i < 8; i++)
        this.board[i] = Array(8);
      for (var i = 0; i < 8; i++)
        for (var j = 0; j < 8; j++)
          this.board[i][j] = 0;
    
      // initialize computer pieces
      for (var i = 0; i < 24; i++) {
        var x = i % 8;
        var y = Math.floor(i/8);
        if (i < 8 || i > 15) {
          if (x % 2 == 1) {
            this.board[x][y] = {
              isKing: false,
              color: 'white'
            };
          }
        } else {
          if (x % 2 == 0) {
            this.board[x][y] = {
              isKing: false,
              color: 'white'
            };
          }
        }
      }

      // initialize player pieces 
      for (var i = 40; i < 64; i++) {
        var x = i % 8;
        var y = Math.floor(i/8);
        if (i < 48 || i > 55) {
          if (x % 2 == 0) {
            this.board[x][y] = { 
              isKing: false,
              color : 'red'
            };
          }
        } else {
          if (i % 2 == 1) {
            this.board[x][y] = {
              isKing: false,
              color : 'red'
            };
          }
        }
      }
    },

    drawBoard: function() {

      // paint all squares of the board
      for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
          var x = (BOARD_SIZE/8) * i;
          var y = (BOARD_SIZE/8) * j;
          if ((j % 2 == 0 && i % 2 == 0) || (j % 2 == 1 && i % 2 == 1)) {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(x, y, x + (BOARD_SIZE/8), y + (BOARD_SIZE/8));
          } else {
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(x, y, x + (BOARD_SIZE/8), y + (BOARD_SIZE/8));
          }
          if (this.board[i][j]) {
            this.ctx.strokeStyle = this.board[i][j].color;
            this.ctx.fillStyle = this.board[i][j].color;
            this.ctx.beginPath();
            this.ctx.arc(x + (BOARD_SIZE/16), y + (BOARD_SIZE/16),
              (BOARD_SIZE/16) - (BOARD_SIZE/64), 0, 2 * Math.PI);
            this.ctx.stroke();
            this.ctx.fill();
            if (this.board[i][j].isKing) {
              this.ctx.beginPath();
              this.ctx.arc(x + (BOARD_SIZE/16), y + (BOARD_SIZE/16),
                (BOARD_SIZE/16) - (BOARD_SIZE/64), 0, 2 * Math.PI);
              this.ctx.lineWidth = 4;
              this.ctx.strokeStyle = 'green';
              this.ctx.stroke();
            }
          }
        }
      }
      if (this.selected) {
        // paint selected piece
        x = (BOARD_SIZE/8) * this.selected.x;
        y = (BOARD_SIZE/8) * this.selected.y;
        this.ctx.beginPath();
        this.ctx.arc(x + (BOARD_SIZE/16), y + (BOARD_SIZE/16), 
          (BOARD_SIZE/16) - (BOARD_SIZE/64), 0, 2 * Math.PI);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'yellow';
        this.ctx.stroke();

        // paint possible moves for selected piece
        var moves = this.getPossibleMoves(this.selected.x, this.selected.y,
          true, this.board[this.selected.x][this.selected.y].isKing);
        moves.forEach(function(pair) {
          var x = (BOARD_SIZE/8) * pair.x;
          var y = (BOARD_SIZE/8) * pair.y;
          this.ctx.beginPath();
          this.ctx.rect(x, y, (BOARD_SIZE/8), (BOARD_SIZE/8));
          this.ctx.lineWidth = 2;
          this.ctx.strokeStyle = 'yellow';
          this.ctx.stroke();
        }.bind(this));
      }
    },

    handleCanvasClick: function(e) {
      if (this.moving) {
        return false;
      }
      var offset = $('#checkr-canvas').offset();
      var canvas_x = e.pageX - offset.left;
      var canvas_y = e.pageY - offset.top;
      var board_x = Math.floor(canvas_x / (BOARD_SIZE/8));
      var board_y = Math.floor(canvas_y / (BOARD_SIZE/8));

      if (this.board[board_x][board_y] && this.board[board_x][board_y].color == 'red') {
        if (this.selected) {
          this.board[this.selected.x][this.selected.y].selected = false;
        }
        this.selected = {
          x: board_x,
          y: board_y
        };
        this.board[this.selected.x][this.selected.y].selected = true;
      } else {
        if (this.selected) { 
          var moves = this.getPossibleMoves(this.selected.x, this.selected.y, 
            true, this.board[this.selected.x][this.selected.y].isKing);
          var selectedMove = null;
          moves.forEach(function(move) {
            if (board_x == move.x && board_y == move.y) {
              selectedMove = move;
            }
          });
          if (selectedMove) {
            this.executeMove(selectedMove, true);
            this.moved = true;
          }
          this.selected = null;
        }
      } 

      // computer player plays here
      if (this.moved) {
        this.moved = false;
        this.moving = true;
        setTimeout(function() {
          this.computerMove();
          this.moving = false;
        }.bind(this), 1000);
      }
      this.drawBoard();
    },

    executeMove: function(move, human) {
      debugger;
      var piece = this.board[move.ix][move.iy] 
      this.board[move.x][move.y] = piece;
      this.board[move.ix][move.iy] = null;

      if (move.victims) {
        move.victims.forEach(function(victim) {
          this.board[victim.x][victim.y] = null;
        }.bind(this))
      }
    
      if (human) {
        if (move.y == 0) {
          this.board[move.x][move.y].isKing = true;
        }
      } else {
        if (move.y == 7) {
          this.board[move.x][move.y].isKing = true;
        }
      }
    },

    computerMove: function() {
      var passiveMoves = [];
      var attackMoves = [];

      for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
          if (this.board[i][j] && this.board[i][j].color == 'white') {
            this.getPossibleMoves(i, j, false, this.board[i][j].isKing).forEach(function(move) {
              passiveMoves.push(move);
            });
            this.getPossibleAttackMoves(i, j, false, this.board[i][j].isKing).forEach(function(move) {
              attackMoves.push(move);
            });
          }
        }
      }
      if (attackMoves.length > 0) {
        this.executeMove(attackMoves[0], false);
        this.drawBoard();
        return;
      }
      if (passiveMoves.length > 0) {
        this.executeMove(passiveMoves[0], false);
        this.drawBoard();
        return;
      }
    },

    getPossibleMoves: function(x, y, human, king) {
      if (!king) {
        king = false;
      }

      var moves = [];
    
      this.getPossiblePassiveMoves(x, y, human, king).forEach(function(move) {
        moves.push(move); 
      });

      this.getPossibleAttackMoves(x, y, human, king).forEach(function(move) {
        moves.push(move);
      });

      return moves;
    },

    getPossiblePassiveMoves: function(x, y, human, king) {
      if (!king) {
        king = false;
      }
        
      var moves = [];

      if (human || (!human && king)) {
        if (this.isValid(x-1, y-1)) {
          moves.push({
            ix: x,
            iy: y,
            x: x-1, 
            y: y-1
          });
        }
        if (this.isValid(x+1, y-1)) {
          moves.push({
            ix: x,
            iy: y,
            x: x+1,
            y: y-1
          });
        }
      }

      if (!human || (human && king)) {
        if (this.isValid(x+1, y+1)) {
          moves.push({
            ix: x,
            iy: y,
            x: x+1,
            y: y+1
          });
        }
        if (this.isValid(x-1, y+1)) {
          moves.push({
            ix: x,
            iy: y,
            x: x-1,
            y: y+1
          });
        }
      }

      return moves;
    },

    getPossibleAttackMoves(x, y, human, king) {

      var moves = [];

      if (human || (!human && king)) {
        if (this.isOpponent(x-1, y-1, human)) {
          if (this.isValid(x-2, y-2)) {
            moves.push({
              ix: x,
              iy: y,
              x: x-2, 
              y: y-2,
              victims: [{x: x-1, y: y-1}]
            });
          }
        }
        if (this.isOpponent(x+1, y-1, human)) {
          if (this.isValid(x+2, y-2)) {
            moves.push({
              ix: x,
              iy: y,
              x: x+2, 
              y: y-2,
              victims: [{x: x+1, y: y-1}]
            });
          }
        }
      }
      if (!human || (human && king)) {
        if (this.isOpponent(x+1, y+1, human)) {
          if (this.isValid(x+2, y+2)) {
            moves.push({
              ix: x,
              iy: y,
              x: x+2, 
              y: y+2,
              victims: [{x: x+1, y: y+1}]
            });
          }
        }
        if (this.isOpponent(x-1, y+1, human)) {
          if (this.isValid(x-2, y+2)) {
            moves.push({
              ix: x,
              iy: y,
              x: x-2, 
              y: y+2,
              victims: [{x: x-1, y: y+1}]
            });
          }
        }
      }

      var toCheck = moves.slice();

      while (toCheck.length > 0) {
        var tmpMove = toCheck.shift();
        var victims = tmpMove.victims;
        this.getPossibleAttackMoves(tmpMove.x, tmpMove.y, human, king).forEach(function(move) {
          for (var i = 0; i < victims.length; i++)
            move.victims.push(victims[i]);
          moves.push(move);
          toCheck.push(move);
        });
      }

      // at the end, set the init x and y coordinates of all moves to their
      // original values
      moves.forEach(function(move) {
        move.ix = x;
        move.iy = y;
      });

      return moves;
    },

    isValid: function(x, y) {
      if (x < 0 || x > 7) { 
        return false;
      }
      if (y < 0 || y > 7) {
        return false;
      }
      if (this.board[x][y]) {
        return false;
      }
      return true;
    },

    isOpponent: function(x, y, human) {
      if (x < 0 || x > 7) { 
        return false;
      }
      if (y < 0 || y > 7) {
        return false;
      }
      if (human) {
        if (this.board[x][y] && this.board[x][y].color == 'white') {
          return true;
        }
      } else {
        if (this.board[x][y] && this.board[x][y].color == 'red') {
          return true;
        }
      }
      return false;
    },

    initFrontend: function() {
      // build and insert canvas
      var canvas = document.createElement('canvas');
      canvas.setAttribute('height', BOARD_SIZE);
      canvas.setAttribute('width',  BOARD_SIZE);
      canvas.setAttribute('id', 'checkr-canvas');
      document.getElementById('checkr').appendChild(canvas);
      this.ctx = canvas.getContext("2d"); 
      this.drawBoard();
      canvas.addEventListener('mousedown', this.handleCanvasClick.bind(this), false);
    },
    
    init: function() {
      this.initBackend();
      this.initFrontend();
    }

  }

  Board.init();

})();
      

