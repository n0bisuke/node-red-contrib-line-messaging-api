# node-red-contrib-line-messaging-api

[English version](README.md)

LINE Messaging APIのNode-REDノードです。  
Node-REDのビジュアルプログラミングインターフェースで簡単にLINE Botを構築できます。

---

## このプロジェクトについて

このパッケージはLINE Messaging APIと統合するためのNode-REDノードを提供し、Node-REDのビジュアルフローエディターを使用してLINE Botを作成できます。Webhook、メッセージ送信、LINE Botイベントの処理をシンプルなドラッグアンドドロップノードで実現できます。

---

## インストール

Node-REDのルートディレクトリで以下のコマンドを実行してください：

```sh
npm install node-red-contrib-line-messaging-api
```

またはNode-REDのパレットマネージャーを使用：

1. Node-REDメニューを開く
2. 「パレットの管理」を選択
3. 「ノードを追加」タブをクリック
4. 「line-messaging-api」を検索
5. インストールをクリック

---

## 設定

### LINE Bot設定ノード

LINE Botの認証情報（チャンネルシークレット、チャンネルアクセストークン）を保存する設定ノードです。このバックグラウンドノードはエディターには表示されず、ReplyやPushノードの設定UIからアクセスできます。

> ![](https://i.gyazo.com/1443049286c39432bcf08647dcbff893.gif)

作成したLINE Bot設定は複数のReplyノードやPushノードで共有できます。

---

## 利用できるAPIと利用イメージ

### Webhook & Reply Message

1. Webhookノードを配置し、ダブルクリックで設定を開き、指定した `/path` と自身のホスト名の組み合わせ（Webhook URL）を、LINE Developersであらかじめ作成したMessaging APIに登録します。
2. ReplyMessageノードを配置し、チャネルのシークレットとアクセストークンを設定します。
3. WebhookノードとReplyMessageノードを接続してLINEにメッセージを送るとオウム返しBotができます。
   [![Image from Gyazo](https://i.gyazo.com/7da2dbecfc69515edf852cf7a26d9196.gif)](https://gyazo.com/7da2dbecfc69515edf852cf7a26d9196)
4. WebhookノードとReplyMessageノードの中間で `msg.payload` をうまく作成すると様々なメッセージが送れます。文字列を指定すると通常のテキストメッセージに、[LINEで定義されているメッセージオブジェクト](https://developers.line.biz/ja/reference/messaging-api/#message-objects)を指定すればそのメッセージを返信することができます。

### Push Message

Pushメッセージを送るときにmsg.payloadにテキストを入れることでテキストメッセージの送信ができます。

> ![](https://i.gyazo.com/1562a3e4539469515c798d9e3c50d052.gif)

#### テキストメッセージv2でユーザーにメンション

Pushメッセージを送るときにmsg.payloadに`{hoge}`などのテキストを入れつつ、msg.substitutionを設定することでテキストメッセージv2を使ってユーザーにメンションすることができます。

- msg.payload: `Welcome, {user1}! {laugh}\n{everyone} There is a newcomer!`
- msg.substitution: 

```json
{"user1": {"type": "mention", "mentionee": {"type": "user", "userId": "Uxxxxxxxxxxxx"}},"laugh": {"type": "emoji","productId": "670e0cce840a8236ddd4ee4c","emojiId": "002"},"everyone": {"type": "mention","mentionee": {"type": "all"}}}
```

> ![](https://i.gyazo.com/3fa696275f53251bf99e7a1354183d72.png)

#### 任意のメッセージ

msg.payloadに配列や[メッセージオブジェクト](https://developers.line.biz/ja/reference/messaging-api/#message-objects)を設定することで任意のメッセージを送信できます。

```js
msg.payload = [
    {
        type: "text",
        text: "hogehoge",
    },
    {
        type: "image",
        originalContentUrl: 'https://i.gyazo.com/e772c3b48a07716226f7184d7f417cda.png',
        previewImageUrl: 'https://i.gyazo.com/e772c3b48a07716226f7184d7f417cda.png'
    }
]

return msg;
```

### Broadcast Message

友達全員にメッセージ配信します。

> ![](https://i.gyazo.com/ef7c655a74e85e23db5ee156e5490e15.png)

### Loading

ローディングアニメーションを表示させます。

> ![](https://i.gyazo.com/355a5f5cca896740eaa50a7b9d76a8fc.gif)
> https://developers.line.biz/ja/reference/messaging-api/#display-a-loading-indicator

### getProfile

ユーザーの情報を取得します。
https://developers.line.biz/ja/reference/messaging-api/#get-profile

### getBotInfo

BOTの情報を取得します。
https://developers.line.biz/ja/reference/messaging-api/#get-bot-info

---

## ノードタイプ

| ノードタイプ | 説明 |
|------------|------|
| **Webhook** | LINE プラットフォームからのwebhookを受信 |
| **Reply Message** | リプライトークンを使用して返信メッセージを送信 |
| **Push Message** | 特定のユーザーにプッシュメッセージを送信 |
| **Broadcast Message** | Bot友達全員にメッセージを送信 |
| **Loading** | ローディングインジケーターを表示 |
| **Get Profile** | ユーザープロフィール情報を取得 |
| **Get Bot Info** | Bot情報を取得 |
| **Limit** | メッセージクォータ制限を確認 |
| **LINE Bot Config** | Bot認証情報を保存（バックグラウンドノード） |

---

## 動作環境と要件

- **HTTPS必須**: 本番環境のwebhookエンドポイントには必要
- **LINE Developersアカウント**: LINE Bot作成に必要
- **Node-RED**: Node-RED v1.0+に対応
- **依存関係**: @line/bot-sdk, express, body-parser, cors

---

## リンク

* [Node-RED Flows](https://flows.nodered.org/node/node-red-contrib-line-messaging-api)
* [Libraries.io](https://libraries.io/npm/node-red-contrib-line-messaging-api)
* [npm](https://www.npmjs.com/package/node-red-contrib-line-messaging-api)

---

## リリースノート

- 2024/12/27: Loading / getProfile / configノードの追加
- 2023/12/11: Notify_newを追加。スタンプや画像も送れるように。
- 2021/8/1: Reply Messageが画像に対応（thanks [@ukkz](https://github.com/ukkz)）
- 2020/12/17: Bloadcast Messageに対応、Reply MessageがFlex Messageに対応（thanks [@gaomar](https://github.com/gaomar)）
- 2019/2/13: PUSH MessageとLINE Notify対応
- 2018/10/11: 基本的なリプライ機能で初回リリース

---

## コントリビューション・ライセンス

プルリクエストやバグレポートを歓迎します。  
このプロジェクトは[Apache 2.0 ライセンス](https://www.apache.org/licenses/LICENSE-2.0)の下で提供されています。

作成者・メンテナー: [n0bisuke](https://github.com/n0bisuke)

---