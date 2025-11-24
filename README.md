# dazhengTools

[中文](./README_CN.md)

click [https://dazhengs.github.io/tools/](https://dazhengs.github.io/tools/) or [https://tools.dazheng.space](https:/tools.dazheng.space) to use this dazhengTools.

This is a tool library that supports multiple encryption and encoding algorithms. It is fully implemented in JavaScript and can be used offline/offline to ensure data security. It has the following functions:

0. **File Encryption and Decryption**: Supports AES256 CBC encryption of any file, and supports encryption and decryption of large files.

1. **Symmetric Encryption and Decryption**: Supports AES (GCM, CBC, CFB, OFB, CTR, ECB) and SM4 (ECB, CBC) modes for encryption and decryption. The IV is randomly generated and appended to the ciphertext, ensuring secure data transmission.
2. **Asymmetric Encryption and Decryption, Signing, and Verification**: Supports RSA2048 and SM2 algorithms, enabling data encryption, decryption, as well as digital signing and signature verification, ensuring data integrity and non-repudiation.
3. **Hash Calculation**: Supports common hashing algorithms such as MD5, SHA1, SHA256, SHA512, SHA3, and SM3, for computing data digests.
4. **Encoding and Decoding**: Provides encoding and decoding for formats like Unicode, UTF-8, Hex, URL, Base64, and MD5, facilitating the handling of various data formats.
5. **Random Password Generation**: Features a random complex password generator to ensure password strength and security.
6. **Standalone Operation**: Works without backend services and can be used offline, providing security and reliability in any environment.
7. **Images to PDF** : Convert multiple images into one PDF.

This toolkit is designed to offer comprehensive encryption, decryption, and encoding solutions for various use cases.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
