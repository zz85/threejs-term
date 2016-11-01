// Adopted from blessed/vendor/tng.js

module.exports = (function() {
    const colors = require('blessed/lib/colors');
    const ascii = false;

    // Taken from libcaca:
    const dchars = '????8@8@#8@8##8#MKXWwz$&%x><\\/xo;+=|^-:i\'.`,  `.        ';

    function renderANSI(bmp) {
        var out = '';

        bmp.forEach(function(line, y) {
            line.forEach(function(pixel, x) {
            var outch = getOutch(pixel);
            out += pixelToSGR(pixel, outch);
            });
            out += '\n';
        });

        return out;
    };

    function pixelToSGR(pixel, ch) {
        var bga = 1.0
            , fga = 0.5
            , a = pixel.a / 255
            , bg
            , fg;

        bg = this.colors.match(
            pixel.r * a * bga | 0,
            pixel.g * a * bga | 0,
            pixel.b * a * bga | 0);

        if (ch && this.options.ascii) {
            fg = this.colors.match(
            pixel.r * a * fga | 0,
            pixel.g * a * fga | 0,
            pixel.b * a * fga | 0);
            if (a === 0) {
            return '\x1b[38;5;' + fg + 'm' + ch + '\x1b[m';
            }
            return '\x1b[38;5;' + fg + 'm\x1b[48;5;' + bg + 'm' + ch + '\x1b[m';
        }

        if (a === 0) return ' ';

        return '\x1b[48;5;' + bg + 'm \x1b[m';
    }

    function luminance(pixel) {
        var a = pixel.a / 255
            , r = pixel.r * a
            , g = pixel.g * a
            , b = pixel.b * a
            , l = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        return l / 255;
    };

    function getOutch(pixel) {
        var lumi = luminance(pixel)
        , outch = dchars[lumi * (dchars.length - 1) | 0];

        return outch;
    }

    return renderANSI;
})();