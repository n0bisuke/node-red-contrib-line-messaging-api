LINE Messagin APIのNode-REDのノードです。

## 概要

LINE Messagin APIを利用できるNode-REDのノードです。

以下のAPIを利用できます。

* LINE Messaging API
    * Reply Message
    * Push Message
* LINE Notify

## インストール

```
npm i node-red-contrib-line-messaging-api
```

or

AdminタブからInstall

## 利用イメージ

### Reply Message

* HTTP inノードで受け取る
* Functionノードでハンドリング
* Reply Messageノードでリプライ

![](https://i.gyazo.com/d3df3a28e010b008043ed80ae6a672ea.gif)

### Push Message

![](https://i.gyazo.com/1562a3e4539469515c798d9e3c50d052.gif)

### LINE Notify

![](https://i.gyazo.com/e64db6a7ee48cea43ed3c70b5fd2f05f.gif)

## LINK

* [NodeRED](https://flows.nodered.org/node/node-red-contrib-line-messaging-api)
* [Libraries.io](https://libraries.io/npm/node-red-contrib-line-messaging-api)
* [npm](https://www.npmjs.com/package/node-red-contrib-line-messaging-api)

## release

* 2019/2/13: PUSH MessageとLINE Notify対応
* 2018/10/11: 現状は簡単なリプライのみ実装されています。
