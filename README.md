## Kurulum

1. Projeyi yerel makinenize klonlayın veya indirin.

```bash
git clone https://github.com/codeesura/eralend-hack.git
```

2. Projeyi indirdikten sonra, projenin kök dizinine gidin.

```bash
cd eralend-hack
```

3. Projedeki bağımlılıkları indirin ve yükleyin.

```bash
npm install
```

4. main.js dosyasını, kullanmak istediğiniz Ethereum özel anahtarlarıyla güncelleyin. Bu anahtarları bir diziye ekleyin.

```javascript
const private_keys = ['private_key1', 'private_key2', 'private_key3']; // add all your private keys here
```

5. Son olarak, botu aşağıdaki komutla çalıştırın.

```bash
node main.js
```



