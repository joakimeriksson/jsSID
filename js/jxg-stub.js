// Minimal JXG stub providing decompress function for jsSID.ReSID
// This replaces the full JSXGraph library dependency

var JXG = JXG || {};

// Base64 decoding
JXG._base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

JXG._base64Decode = function(data) {
    var result = [];
    var i = 0;
    var len = data.length;

    while (i < len) {
        var c1 = JXG._base64Chars.indexOf(data.charAt(i++));
        var c2 = JXG._base64Chars.indexOf(data.charAt(i++));
        var c3 = JXG._base64Chars.indexOf(data.charAt(i++));
        var c4 = JXG._base64Chars.indexOf(data.charAt(i++));

        var b1 = (c1 << 2) | (c2 >> 4);
        var b2 = ((c2 & 15) << 4) | (c3 >> 2);
        var b3 = ((c3 & 3) << 6) | c4;

        result.push(b1);
        if (c3 !== 64) result.push(b2);
        if (c4 !== 64) result.push(b3);
    }

    return result;
};

// LZW decompression
JXG._lzwDecode = function(data) {
    var dict = {};
    var currChar = data[0];
    var oldPhrase = String.fromCharCode(currChar);
    var result = [oldPhrase];
    var code = 256;
    var phrase;

    for (var i = 1; i < data.length; i++) {
        var currCode = data[i];
        if (currCode < 256) {
            phrase = String.fromCharCode(currCode);
        } else {
            phrase = dict[currCode] ? dict[currCode] : (oldPhrase + oldPhrase.charAt(0));
        }
        result.push(phrase);
        dict[code] = oldPhrase + phrase.charAt(0);
        code++;
        oldPhrase = phrase;
    }

    return result.join('');
};

// Main decompress function: base64 decode then LZW decompress
JXG.decompress = function(str) {
    // Remove whitespace
    str = str.replace(/\s+/g, '');
    // Base64 decode
    var bytes = JXG._base64Decode(str);
    // Convert to 16-bit values for LZW
    var data = [];
    for (var i = 0; i < bytes.length; i += 2) {
        data.push((bytes[i] << 8) | (bytes[i + 1] || 0));
    }
    // LZW decompress
    return JXG._lzwDecode(data);
};
