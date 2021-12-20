LINE Messagin APIのNode-REDのノードです。

## 概要

LINE Messagin APIを利用できるNode-REDのノードです。

以下のAPIを利用できます。

- LINE Messaging API
    - Webhook & Reply Message
    - Push Message
    - BloadCast Message
- LINE Notify

## インストール

```
npm i node-red-contrib-line-messaging-api
```

or

AdminタブからInstall

## 利用イメージ

### Webhook & Reply Message

1. Webhookノードを配置し、ダブルクリックで設定を開き、指定した `/path` と自身のホスト名の組み合わせ（Webhook URL）を、LINE Developersであらかじめ作成したMessaging APIに登録します。
2. ReplyMessageノードを配置し、チャネルのシークレットとアクセストークンを設定します。
3. WebhookノードとReplyMessageノードを接続してLINEにメッセージを送るとオウム返しBotができます。  
  [![Image from Gyazo](https://i.gyazo.com/7da2dbecfc69515edf852cf7a26d9196.gif)](https://gyazo.com/7da2dbecfc69515edf852cf7a26d9196)
4. WebhookノードとReplyMessageノードの中間で `msg.payload` をうまく作成すると様々なメッセージが送れます。文字列を指定すると通常のテキストメッセージに、[LINEで定義されているメッセージオブジェクト](https://developers.line.biz/ja/reference/messaging-api/#message-objects)を指定すればそのメッセージを返信することができます。

### Push Message

![](https://i.gyazo.com/1562a3e4539469515c798d9e3c50d052.gif)

### Bloadcast Message

* 友達全員にメッセージ配信

![](https://i.gyazo.com/ef7c655a74e85e23db5ee156e5490e15.png)

### LINE Notify

![](https://i.gyazo.com/e64db6a7ee48cea43ed3c70b5fd2f05f.gif)

## LINK

* [NodeRED](https://flows.nodered.org/node/node-red-contrib-line-messaging-api)
* [Libraries.io](https://libraries.io/npm/node-red-contrib-line-messaging-api)
* [npm](https://www.npmjs.com/package/node-red-contrib-line-messaging-api)

## release

- 2021/8/1: Reply Messageが画像に対応（thanks [@ukkz](https://github.com/ukkz)）
- 2020/12/17: Bloadcast Messageに対応、Reply MessageがFlex Messageに対応（thanks [@gaomar](https://github.com/gaomar)）
- 2019/2/13: PUSH MessageとLINE Notify対応
- 2018/10/11: 現状は簡単なリプライのみ実装されています。
