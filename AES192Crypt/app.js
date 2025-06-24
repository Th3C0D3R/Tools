const crypto = require('crypto');

// Get args
const args = process.argv.slice(2);
const isDecrypt = args.includes('--decrypt');

const salt = args[0];
const password = args[1];
const text = args[2];

if (!salt || !password || !text) {
    console.error('Usage: node script.js <salt> <password> <text> [--decrypt]');
    process.exit(1);
}

// Fixed 16-byte IV (for AES-192-CBC)
const iv = Buffer.from('0102030405060708090a0b0c0d0e0f10', 'hex');

// Generate 24-byte key for AES-192
const key = crypto.scryptSync(password, salt, 24);

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

if (isDecrypt) {
    try {
        const output = decrypt(text);
        console.log("Decrypted:", output);
    } catch (err) {
        console.error("Failed to decrypt:", err.message);
    }
} else {
    const output = encrypt(text);
    console.log("Encrypted:", output);
}