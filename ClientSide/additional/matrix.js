var Matrix = new (function m(){    
    this.compose = (a, b) => x => a(b(x));
    this.reverse = array => [...array].reverse();

    // `get` is a simple accessor function, used for selecting an item in an array.
    this.get = id => array => array[id];

    // This functional version of map accepts our function first.
    this.map = (fn, array) => array.map(fn);

    // `pluck` allows us to map through a matrix, gathering all the items at a
    // specific index.
    this.pluck = (index, data) => this.map(this.get(index), data);

    // `rangeFrom` creates an array equal in length to the array provided,
    // but with a 0-based range for values.
    // eg. ['a', 'b', 'c'] -> [0, 1, 2]
    this.rangeFrom = ({length}) => [...Array(length).keys()];

    this.flip = matrix => (
        this.map(index => this.pluck(index, matrix), this.rangeFrom(matrix))
    );
    this.rotate = this.compose(this.flip, this.reverse);

    this.flipCounterClockwise = this.compose(this.reverse, this.rotate);
    this.rotateCounterClockwise = this.compose(this.reverse, this.flip);

    this.clone = matrix => matrix.map(line => line.slice());
})();