use std::env;

use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm,
    Key, // Or `Aes128Gcm`
    Nonce,
};

// TODO:
#[allow(dead_code)]
pub fn encrypt(text: String) -> Vec<u8> {
    let conf_key = env::var("CRYPTO_KEY").expect("CRYPTO_KEY must be set");
    let key = Key::<Aes256Gcm>::from_slice(conf_key.as_bytes());
    let cipher = Aes256Gcm::new(&key);
    let nonce = Nonce::from_slice(b"unique nonce"); // 96-bits; unique per message
    cipher
        .encrypt(nonce, text.as_ref())
        .expect("Encryption failed.")
}

// TODO:
#[allow(dead_code)]
pub fn decrypt(encrypt: String) -> String {
    let conf_key = env::var("CRYPTO_KEY").expect("CRYPTO_KEY must be set");
    let key = Key::<Aes256Gcm>::from_slice(conf_key.as_bytes());
    let cipher = Aes256Gcm::new(&key);
    let nonce = Nonce::from_slice(b"unique nonce"); // 96-bits; unique per message
    let plaintext = cipher
        .decrypt(nonce, encrypt.as_bytes().as_ref())
        .expect("Decryption failed.");
    let converted = String::from_utf8(plaintext).unwrap();
    return converted;
}

#[test]
fn test_encrypt() {
    // Set the encryption key
    env::set_var("CRYPTO_KEY", "abcdefghijklmnopqrstuvwxyz123456");

    // The string to be encrypted
    let plain_text = "Hello, world!";

    // Call the encrypt function and get the encrypted string
    let encrypted_text = encrypt(plain_text.to_string());

    // Check if the encrypted string is as expected
    assert_eq!(encrypted_text, [0x1, 0x2, 0x3, 0x4, 0x5]);
}
