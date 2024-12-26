module.exports = (RED) => {
    'use strict';

    const line = require('@line/bot-sdk');
    const main = function(config){
        const node = this;
        RED.nodes.createNode(node, config);

        let lineconfig = {};

        try {
            lineconfig = require('../../env'); //環境変数を取得
        } catch (error) {
            try {
                node.lineConfig = RED.nodes.getNode(config.lineConfig); //共通のlineConfigを取得
                lineconfig = { 
                    channelSecret: node.lineConfig.credentials.LineChannelSecret,
                    channelAccessToken: node.lineConfig.credentials.LineChannelAccessToken
                };
                console.log(`---共通lineConfigから---`);
            } catch (error) {
                lineconfig = { 
                    channelSecret: node.credentials.channelSecret,
                    channelAccessToken: node.credentials.channelAccessToken
                };
                console.log(`---個別の設定から---`);
            }

        }

        if(lineconfig.channelAccessToken === undefined || lineconfig.channelAccessToken === '') {
            console.error('LINE token not found1');
            return;
        }
        // const client = new line.messagingApi.MessagingApiClient(lineconfig);
        const client = new line.Client(lineconfig);

        node.on('input', async (msg, send, done) => {
            try {
                const userId = msg.targetId || node.credentials.targetId;
                let sendMessages = [];
                console.log(`---オブジェクトメッセージ---`);
                console.log(typeof msg.payload);
                
                //複数メッセージかどうか 
                if(typeof msg.payload === 'object' && Array.isArray(msg.payload)){
                    // console.log(`---複数メッセージ---`);
                    // 配列渡してくるときは自分で何かやりたい人なので、そのまま渡す
                    sendMessages = msg.payload;
                }else{
                    console.log(`---単体メッセージ---`);
                    //Flex Messageやその他メッセージに対応(type指定がある場合)
                    if(typeof msg.payload === 'object' && msg.payload.type){
                        sendMessages = [msg.payload];
                    }
                    //テキストのみの場合
                    else{
                        // v2 判定: {変数名} の形式が含まれているか確認
                        const variablePattern = /\{[a-zA-Z0-9_]+\}/;
                        const isV2Message = typeof msg.payload === 'string' && variablePattern.test(msg.payload) && msg.substitution;
                        if (isV2Message) {
                            // console.log(`---テキストメッセージv2---`,msg.substitution);
                            sendMessages = [{
                                type: 'textV2',
                                text: msg.payload,
                                substitution: msg.substitution,
                            }]
                        }else{
                            // console.log(`---テキストメッセージv1---`);
                            sendMessages = [{
                                type: 'text',
                                text: msg.payload,
                            }]
                        }
                    }
                }

                msg.payload = await client.pushMessage(userId, sendMessages);
                send(msg);
            } catch (error) {
                // console.log(error.originalError.response.data);
                // msg.payload = error.body;
                msg.payload = error.originalError.response.data;
                send(msg);
                node.error("エラー発生", msg.payload);
            }
        });
    }

    RED.nodes.registerType("PushMessage_New", main, {
        credentials: {
            // channelSecret: {type:"password"},
            channelAccessToken: {type:"password"},
            targetId: {type:"password"},
        },
    });
}