const { EventEmitter } = require('events');


/*
 * Minimal Polyfill for globals document, window
 * mouse + keypress events
 */

module.exports = function(screen) {
    // Polyfilling
    document = new EventEmitter();
    document.addEventListener = document.addListener;
    document.removeEventListener = document.removeListener;

    window = {
        // used for controls mostyle
        get innerWidth() {
            return screen ? screen.width: width;
        },

        get innerHeight() {
            return screen ? screen.height: height;
        },

        addEventListener(type, handler) {
            // better make sure you emulate these events!
            document.addEventListener(type, handler);
        },

        removeEventListener(type, handler) {
            document.removeEventListener(type, handler);
        },

        emit(...args) {
            document.emit(...args);
        }
    }

    const noop = () => {};
    const _convert_event = (e) => ({
        pageX: e.x,
        pageY: e.y,
        preventDefault: noop,
        stopPropagation: noop,
        button: 0
    });

    let mouseDown = false;

    screen.on('mousedown', function(e) {
        if (mouseDown) {
            document.emit('mousemove', _convert_event(e));
            return;
        }
        mouseDown = true;
        document.emit('mousedown', _convert_event(e));
    })

    screen.on('mousemove', function mousemoving(e) {
        document.emit('mousemove', _convert_event(e));
    });

    screen.on('mouseup', function(e) {
        mouseDown = false;
        document.emit('mouseup', _convert_event(e));
    });

    const keysDown = {};
    const keyToCode = {
        'a': 65,
        's': 83,
        'd': 68
    };

    // emulate keydown and keyup, 300ms is the allowance
    // screen.key(['a', 's', 'd'], function(e) {
    screen.on('keypress', function(e, f) {
        if (keysDown[e]) {
            screen.debug('keydowned');
            clearTimeout(keysDown[e]);
        } else {
            screen.debug('keydown');
            document.emit('keydown', {
                keyCode: keyToCode[e]
            })
        }

        keysDown[e] = setTimeout( () => {
            keysDown[e] = null;
            screen.debug('keyup');
            document.emit('keyup', {
                keyCode: keyToCode[e]
            });
        }, 300);
    });

    /*
    // This doesn't seem to work so well, so use screen.program
    screen.on('resize', function(e) {
        console.error('resizing', e);
    });
    */

    screen.program.on('resize', e => {
        get_window_pixels();
    });

    // Secret Code to get Terminal's Window Pixel Size
    const get_window_pixels = _ => screen.program.manipulateWindow(14, (e, res) => {
        if (e) {
            // This terminal don't support the p 1 4 (window pixel dimension command) :(
            console.error('Terminal does not support pixel dimension');
            window.emit('resize');
            return;
        }

        window.emit('resize', res);
        /*
        { event: 'window-manipulation',
            code: '',
            type: 'window-size-pixels',
            size: { height: 830, width: 1375 },
            height: 830,
            width: 1375,
            windowSizePixels: { height: 830, width: 1375 } }
        */
    });

    get_window_pixels();
}