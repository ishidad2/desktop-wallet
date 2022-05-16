このウォレットについて
===

このウォレットは公式の[SymbolWallet](https://github.com/symbol/desktop-wallet)のハーベスト設定部分を改良し、ワンクリックでハーベスト設定が可能なウォレットです。

このウォレットでは従来2回トランザクションを発生させないといけないハーベスト設定を、1回のトランザクションで行うことが出来ます。

公式のコードをそのまま利用しておりますので、ハーベスト設定をワンクリックで行える点以外は公式のウォレットとほぼ同等のウォレットとなります。

# インストール方法

1.既に公式のウォレットをインストールしている場合

そのまま上書きインストールするだけでお使いいただけます。

2.ウォレットを持っていない（新規作成）、もしくは公式のウォレットをインストールしていない場合

ご利用の環境のウォレット（windowsの場合は.exeのものを）をインストールしてください。

# 以前のウォレットに戻したい場合

公式のウォレットを上書きインストールすることでご利用いただけます。

免責
===

本ウォレットは公式のウォレットのウォレットのソースコードからハーベスト設定時の処理を改良して作成しておりますが、意図しない不具合によりウォレットが開けなくなるなどの不利益を被る可能性があります。必ずニーモニックのバックアップを行い，ご自身の判断でご利用ください。本ウォレットを使用したことによって発生した損害については一切の責任を負いません。


# Symbol Desktop Wallet

[![Build Status](https://travis-ci.com/symbol/desktop-wallet.svg?branch=main)](https://travis-ci.com/symbol/desktop-wallet)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Cross-platform client for Symbol to manage accounts, mosaics, namespaces, and issue transactions.

## Installation

Symbol Desktop Wallet is available for Mac, Windows, and as a web application.

1. Download Symbol Desktop Wallet from the [releases section](https://github.com/symbol/desktop-wallet/releases).

2. Launch the executable file and follow the installation instructions.

3. Create a profile. Remember to save the mnemonic somewhere safe (offline).

## Building instructions

Symbol CLI require **Node.js 10 or 12 LTS** to execute.

1. Clone the project.

```
git clone https://github.com/ishidad2/desktop-wallet.git
```

2. Install the dependencies.
```
cd desktop-wallet
npm install 
```

3. Start the development server.

```
npm run dev 
```

4. Visit http://localhost:8080/#/ in your browser.

## Getting help

Use the following available resources to get help:

- [Symbol Documentation][docs]
- Join the community [discord group][discord], [slack group (#sig-client)][slack] 
- If you found a bug, [open a new issue][issues]

## Contributing

Contributions are welcome and appreciated. 
Check [CONTRIBUTING](CONTRIBUTING.md) for information on how to contribute.

## License

Copyright 2018-present NEM

Licensed under the [Apache License 2.0](LICENSE)

[self]: https://github.com/symbol/desktop-wallet
[docs]: https://docs.symbolplatform.com
[issues]: https://github.com/symbol/desktop-wallet/issues
[discord]: https://discord.gg/xymcity
[slack]: https://join.slack.com/t/nem2/shared_invite/enQtMzY4MDc2NTg0ODgyLWZmZWRiMjViYTVhZjEzOTA0MzUyMTA1NTA5OWQ0MWUzNTA4NjM5OTJhOGViOTBhNjkxYWVhMWRiZDRkOTE0YmU
