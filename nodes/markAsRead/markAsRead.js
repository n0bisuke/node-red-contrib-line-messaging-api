module.exports = (RED) => {
    'use strict';
    
    const line = require('@line/bot-sdk');

    const main = function(config){
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

        // ここでLINE APIを呼び出す処理
        node.on('input', async(msg, send, done) =>  {
            // console.log("markAsReadToken:");
            // console.log(msg.line.event, send);
            try {
                const markAsReadToken = msg.line?.event?.message?.markAsReadToken;
                const res = await client.markMessagesAsReadByToken({ markAsReadToken: markAsReadToken });
               

                if(Object.keys(res).length !== 0) { // 正常だと{}が返ってくる 
                    throw new Error(`Marked as read failed.`);
                }else{
                    // console.log("Marked as read successfully.");
                    // 成功した場合の処理 そのままpayloadを返す
                    msg.payload = msg.payload || {};
                    send(msg);
                }
            } catch (error) {
                // console.error(error.body);
                node.error(error.body, msg.payload);
                msg.payload = error.body; //エラーメッセージをDebugに表示するためにmsg.payloadにセット
                send(msg);
                done(error);
            }

            // console.log("Message received:", msg.payload);
        });
    }

    RED.nodes.registerType("markAsRead", main);
}
