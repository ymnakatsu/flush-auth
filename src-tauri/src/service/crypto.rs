// use aes::cipher::{block_padding::Pkcs7, BlockDecryptMut, BlockEncryptMut, KeyIvInit};

// type Aes128CbcEnc = cbc::Encryptor<aes::Aes128>;
// type Aes128CbcDec = cbc::Decryptor<aes::Aes128>;

// pub fn encrypt(plaintext: String) {
//     let key = [0x42; 16];
//     let iv = [0x24; 16];
//     let plaintext = *b"hello world! this is my plaintext.";

//     let res =
//         Aes128CbcEnc::new(&key.into(), &iv.into()).encrypt_padded_vec_mut::<Pkcs7>(&plaintext);
// }

// // pub fn decrypt(ciphertext: String) {
// //     let key = hex!("000102030405060708090a0b0c0d0e0f");
// //     let iv = hex!("f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff");
// //     let cipher = Aes256Cbc::new_var(&key, &iv).unwrap();
// //     let decrypted_ciphertext = cipher.decrypt_vec(&ciphertext).unwrap();
// // }
