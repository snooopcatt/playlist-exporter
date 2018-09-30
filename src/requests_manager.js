/**
 * 
 * @param {Number} timeout API frame length 
 * @param {Number} limit Amount of calls to API per frame
 */
let Manager = function (timeout, limit) {
    this.timeout = timeout;
    this.limit = limit;

    this.queue = [];
    this.counter = 0;
    this.immediateTimer = null;

    let me = this;

    const iterator = function () {
        if (me.queue.length === 0) {
            me.immediateTimer = setTimeout(iterator, 1);
        }
        else {
            if (me.counter < me.limit) {
                let currentFn = me.queue.shift();
                me.counter++;
                currentFn();
                iterator();
            }
            else {
                console.log('API limit exceeded, waiting for reset');
                me.immediateTimer = setTimeout(iterator, 10);
            }
        }
    };
    
    iterator.bind(this)();

    this.intervalTimer = setInterval(() => { 
        console.log('API limit reset');
        this.counter = 0; 
    }, this.timeout);

    this.schedule = function schedule(fn) {
        return new Promise((resolve, reject) => {
            this.queue.push(function () {
                fn(resolve, reject);
            });
        });
    };

    this.destroy = function destroy() {
        clearInterval(this.intervalTimer);
        clearTimeout(this.immediateTimer);
    };
};

module.exports = Manager;