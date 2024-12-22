module.exports = (RED) => {
    'use strict';

    const line = require('@line/bot-sdk');

    const main = function(config){
        const node = this;
        RED.nodes.createNode(node, config);

        let lineconfig;
        try {
            lineconfig = require('../../env');
        } catch (error) {
            lineconfig = { 
                // channelSecret: node.credentials.channelSecret,
                channelAccessToken: node.credentials.channelAccessToken
            };
        }
        if(lineconfig.channelAccessToken === undefined || lineconfig.channelAccessToken === '') {
            console.error('token not found');
            return;
        }
        const client = new line.messagingApi.MessagingApiClient(lineconfig);
        // const client = new line.Client(lineconfig);

        node.on('input', async (msg, send, done) => {

            //chat
            const chatId = msg.targetId || node.credentials.targetId;
            const loadingSeconds = msg.loadingSeconds || config.loadingSeconds;
            // console.log(chatId,loadingSeconds);
            
            try {
                const res = await client.showLoadingAnimation({
                    chatId: chatId, //現状user idのみ
                    loadingSeconds: loadingSeconds,
                });

                // レスポンスが {}（空のJSONオブジェクト）なら成功らしい
                if (res && Object.keys(res).length === 0) {
                    node.log('ローディングが成功しました: {} が返却されました');
                } else {
                    node.warn('ローディング処理失敗:', res);
                }
                send(msg);
            } catch (error) {
                console.error(error.body);
                node.error(error.body, msg.payload);
                send(msg);
                done(error);
            }

        });
    }

    RED.nodes.registerType("Loading", main, {
        credentials: {
            channelAccessToken: {type:"password"},
            targetId: {type:"password"},
        }
    });
}