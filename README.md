LINE Messagin APIのNode-REDのノードです。

## 概要

LINE Messagin APIを利用できるNode-REDのノードです。

以下のAPIを利用できます。

- LINE Messaging API
    - Reply Message
        - text
        - image
        - flex
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

### Reply Message

- 1. HTTP inノードで受け取る

    postで受けます。

- 2. Functionノードでハンドリング

■テキスト例

```js
if (msg.payload.events[0].message.text == '夏') {
    // 「夏」を受信したら「暑い」と返事する
    msg.payload.events[0].message.text = '暑い';
} else {
    // それ以外を受信したら「わかりません」と返事する
    msg.payload.events[0].message.text = 'わかりません';
}
return msg;
```

■画像例

```js
msg.payload.events[0].message.originalContentUrl = `https://pbs.twimg.com/profile_images/1165566424699457537/IYBnJ1i5_400x400.jpg`

return msg;
```

- 3. Reply Messageノードでリプライ

![](https://i.gyazo.com/d3df3a28e010b008043ed80ae6a672ea.gif)

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

* 2020/12/17: Bloadcast Messageに対応、Reply MessageがFlex Messageに対応（thanks [@gaomar](https://github.com/gaomar)）
* 2019/2/13: PUSH MessageとLINE Notify対応
* 2018/10/11: 現状は簡単なリプライのみ実装されています。
