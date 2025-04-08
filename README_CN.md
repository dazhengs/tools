# dazhengTools

点击 [https://dazhengs.github.io/tools/](https://dazhengs.github.io/tools/) 或  [https://tools.dazheng.site](https://tools.dazheng.site) 来使用 dazhengTools.


这是一个支持多种加密与编码算法的工具库，完全使用 JavaScript 实现，可以离线/断网使用，确保数据安全，具备以下功能：

0. **文件加密/解密** 支持使用AES256 CBC 加密任意文件，支持大文件加解密。

1. **对称加密与解密**：支持 AES（GCM、CBC、CFB、OFB、CTR、ECB）及 SM4（ECB、CBC）模式的加解密，随机生成的 IV 会附加在密文中，确保数据传输的安全性。
2. **非对称加密与解密、签名与验签**：支持 RSA2048 和 SM2 算法，能够进行数据加解密、数字签名以及签名验证，确保数据完整性和不可否认性。
3. **哈希计算**：支持 MD5、SHA1、SHA256、SHA512、SHA3 和 SM3 等常见哈希算法，用于计算数据摘要。
4. **编码解码**：提供 Unicode、UTF-8、Hex、URL、Base64 以及 MD5 的编码和解码功能，方便处理多种数据格式。
5. **随机密码生成**：提供复杂的随机密码生成器，确保密码的强度和安全性。
6. **独立运行**：无需后端支持，可离线使用，提供安全可靠的环境。
7. **图片转PDF** : 将多个图片转为PDF。

此工具旨在为用户提供全面的加密、解密和编码解决方案，适用于多种场景。

## 项目设置

```sh
npm install
```

### 编译并开启热加载用于开发

```sh
npm run dev
```

### 编译并压缩用于生产环境

```sh
npm run build
```