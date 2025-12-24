module.exports = (RED) => {
    'use strict';

    const line = require('@line/bot-sdk');
    const { setTimeout: sleep } = require('node:timers/promises');

    const main = function(config){
        // const node = this;
        // RED.nodes.createNode(node, config);

        // let lineconfig;
        // try {
        //     lineconfig = require('../../env');
        // } catch (error) {
        //     lineconfig = { 
        //         // channelSecret: node.credentials.channelSecret,
        //         channelAccessToken: node.credentials.channelAccessToken
        //     };
        // }
        // if(lineconfig.channelAccessToken === undefined || lineconfig.channelAccessToken === '') {
        //     console.error('token not found');
        //     return;
        // }
        // const client = new line.messagingApi.MessagingApiClient(lineconfig);
        // // const client = new line.Client(lineconfig);

        const node = this;
        RED.nodes.createNode(node, config);

        let lineconfig = {};
        try {
            lineconfig = require('../../env');
        } catch (error) {
            node.lineConfig = RED.nodes.getNode(config.lineConfig); //共通のlineConfigを取得

            lineconfig = { 
                channelSecret: node.lineConfig.credentials.LineChannelSecret,
                channelAccessToken: node.lineConfig.credentials.LineChannelAccessToken
            };
        }
        if(lineconfig.channelAccessToken === undefined || lineconfig.channelAccessToken === '') {
            console.error('LINE token not found');
            return;
        }
        const client = new line.messagingApi.MessagingApiClient(lineconfig);

        node.on('input', async (msg, send, done) => {

            //chat
            // const chatId = msg.line.event
            let chatId = '';
            if(msg.line?.event?.source?.userId !== undefined){
                chatId = msg.line.event.source.userId;
            }else if(msg.line?.event?.source?.groupId !== undefined){
                chatId = msg.line.event.source.groupId;
            }
            console.log('chatId:', chatId);
            // return;
            const loadingSeconds = msg.loadingSeconds || config.loadingSeconds;
            const waitForCompletion = (msg.waitForCompletion !== undefined)
                ? msg.waitForCompletion
                : config.waitForCompletion;
            // console.log(chatId,loadingSeconds);
            
            try {
                const res = await client.showLoadingAnimation({
                    chatId: chatId, //現状user idのみ
                    loadingSeconds: loadingSeconds,
                });
                if (waitForCompletion) {
                    await sleep(loadingSeconds * 1000); // 指定秒数待機させる
                }

                // レスポンスが {}（空のJSONオブジェクト）なら成功らしい
                if (res && Object.keys(res).length === 0) {
                    node.log('ローディングが成功したかも?: {} が返却されました');
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

    RED.nodes.registerType("Loading", main);
}
