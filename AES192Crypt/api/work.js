const crypto = require('crypto');

exports.handler = async (event, context) => {
    var s = event.queryStringParameters["s"] || undefined;
    var p = event.queryStringParameters["p"] || undefined;
    var t = event.queryStringParameters["t"] || undefined;
    var d = event.queryStringParameters["d"] !== undefined;

    if (!s || !p || !t) {
        return {
            statusCode: 501,
            body: JSON.stringify({ error: "ERROR - MISSING ARGUMENT!", time: Date.now() })
        }
    }

    // Fixed 16-byte IV (for AES-192-CBC)
    const iv = Buffer.from('0102030405060708090a0b0c0d0e0f10', 'hex');

    // Generate 24-byte key for AES-192
    const key = crypto.scryptSync(p, s, 24);

    function encrypt(text) {
        const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        return encrypted.toString('base64');
    }

    function decrypt(base64) {
        const encryptedText = Buffer.from(base64, 'base64');
        const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
        const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
        return decrypted.toString('utf8');
    }


    if (d) {
        try {
            const output = decrypt(t);
            return {
                statusCode: 200,
                body: JSON.stringify({ success: output, time: Date.now() })
            }
        } catch (err) {
            return {
                statusCode: 501,
                body: JSON.stringify({ error: err, time: Date.now() })
            }
        }
    } else {
        const output = encrypt(t);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: output, time: Date.now() })
        }
    }
};