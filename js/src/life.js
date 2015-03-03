var life = (function () {

  var
    size,
    cells,
    grid,
    timer = null,

  init, 
  initCells, getCell, setCell, countAdj,
  step,
  initGrid,
  start, stop;

  // Cell methods
  initCells = function () {
    var i, j;
    
    // create 2D cells array
    cells = [];
    for (i = 0; i < size; i++)
      cells[i] = [];
    
    // set all cells equal to 0
    for (i = 0; i < size; i++) {
      for (j = 0; j < size; j++)
        cells[i][j] = 0;
    } 
  };

  getCell = function (x, y) {
    if (x >= 0 && x < size && y >= 0 && y < size) 
      return cells[x][y];
    else 
      return 0;
  };

  setCell = function (x, y, state) {
    cells[x][y] = state;
  };

  countAdj = function (x, y) {
    var live = 0;
    live += getCell( x-1, y-1 );
    live += getCell( x-1, y );
    live += getCell( x-1, y+1 );
    live += getCell( x, y-1 );
    live += getCell( x, y+1 );
    live += getCell( x+1, y-1 );
    live += getCell( x+1, y );
    live += getCell( x+1, y+1 );
    return live;
  };

  // Game of Life methods
  step = function () {
    var
      x, y, id, adj, cur_y, cur_d, cur_b,
      nextAlive = [],
      nextDead  = [];

    for (x = 0; x < size; x++) {
      for (y = 0; y < size; y++) {

        // calculate id
        id  = '#x'+x+'y'+y;

        // count adjacent live cells
        adj = countAdj(x, y);
          
        // if a cell is dead...
        if (getCell(x, y) === 0) {
          // and it has exactly 3 neighbors, it comes to life
          if (adj === 3) {
            nextAlive.push([x,y]);
            $(id).removeClass('dead').addClass('alive');
          }
        }

        // if a cell is alive...
        else {
          // and it has < 2 or > 3 neighbors, it dies
          if (adj < 2 || adj > 3) {
            nextDead.push([x,y]);
            $(id).removeClass('alive').addClass('dead');
          }
        }
      }
    }
    // now that all changes have been made, update cells
    for (x = 0; x < nextDead.length; x++) 
      setCell(nextDead[x][0], nextDead[x][1], 0);
    for (x = 0; x < nextAlive.length; x++) 
      setCell(nextAlive[x][0], nextAlive[x][1], 1);
  };

  // Grid methods
  initGrid = function () {
    var 
      x, y, id, tag, 
      html = '';

    for (x = 0; x < size; x++) {
      for (y = 0; y < size; y++) {
        id = 'x'+x+'y'+y;
        tag = '<div id="'+id+'" class="box dead"></div>';
        html += tag; 
      }
    }
    grid.html(html);
  };

  // Timer methods
  start = function () {
    if (timer == null) 
      timer = setInterval(step, 200);
  };

  stop = function () {
    clearInterval(timer);
    timer = null;
  };
    
  // init method
  init = function (init_size) {

    grid = $('#grid');
    size = init_size;

    initCells();
    initGrid();

    $('.box').click(function () {
      var
        id = $(this).attr('id'),
        x = parseInt(id.substring(id.indexOf('x')+1, id.indexOf('y'))),
        y = parseInt(id.substring(id.indexOf('y')+1, id.length));
      if (getCell(x, y) == 0) {
        setCell(x, y, 1);
        $(this).removeClass('dead').addClass('alive');
      }
      else {
        setCell(x, y, 0);
        $(this).removeClass('alive').addClass('dead');
      }
    });

    $('#start').click(function () {
      start();
    });

    $('#stop').click(function() {
      stop();
    });

  };

  return { init : init };

}());
    
