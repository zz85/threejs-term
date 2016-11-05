// Adopted from blessed/vendor/tng.js

const colors = require('blessed/lib/colors');

let options = {
    plain_formatting: true, // overrides bg and ascii_formatting
    bg_formatting: true, // colors background
    ascii_formatting: true, // use ascii for forground

    bga: 1, // background alpha blending
    fga: 0.5, // forground alpha blending,
    dchars: ''
};

// Taken from libcaca:
options.dchars = '????8@8@#8@8##8#MKXWwz$&%x><\\/xo;+=|^-:i\'.`,  `.        '.split('').reverse().join('')

// options.dchars = '⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿';

// TODO fix non fixed with chinese / japanese unicode characters
// TODO implement emojis
// options.dchars = '    一二三四五吖雅'

// Jem's ascii characters
// options.dchars = '  .o-~=*%@#';

// options.dchars = ' .,:;=|iI+hHOE#`$'
// darker bolder character set from https://github.com/saw/Canvas-ASCII-Art/
// options.dchars = ' .\'`^",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$'
// options.dchars = ' .:-=+*#%@';
// options.dchars = '●☭☮☯♔♛♙♞';
// options.dchars = '█▓▒░ '

options.dchars = options.dchars.split('').reverse().join('');

function pixelToSGR(pixel, ch) {
    var a = pixel.a / 255
        , bga = options.bga
        , fga = options.fga
        , bg
        , fg;

    bg = colors.match(
        pixel.r * a * bga | 0,
        pixel.g * a * bga | 0,
        pixel.b * a * bga | 0);

    if (options.ascii_formatting && ch) {
        fg = colors.match(
        pixel.r * a * fga | 0,
        pixel.g * a * fga | 0,
        pixel.b * a * fga | 0);
        if (a === 0 || !options.bg_formatting) {
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
    , dchars = options.dchars
    , outch = dchars[lumi * (dchars.length - 1) | 0];

    return outch;
}

function convert(image, targetWidth, targetHeight) {
    const { width, height, data } = image;
    let out = [];
    let ty, tx, i, pixel, outch;
    for (let y = 0; y < targetHeight; y++) {
        ty = y / targetHeight * height | 0;
        for (let x = 0; x < targetWidth; x++) {
            tx = x / targetWidth * width | 0;
            i = ty * width + tx;

            pixel = {
                r: data[i * 4 + 0],
                g: data[i * 4 + 1],
                b: data[i * 4 + 2],
                a: data[i * 4 + 3]
            };

            outch = getOutch(pixel);
            if (options.plain_formatting) {
                out.push(outch);
            }
            else {
                out.push(pixelToSGR(pixel, outch));
            }
        }
        out.push('\n');
    }
    return out.join('');
}

module.exports = {
    convert: convert,
    setOptions(o) {
        Object.assign(options, o);
    },
};
