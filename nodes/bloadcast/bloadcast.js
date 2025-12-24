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

        if(lineconfig.channelSecret === '' || lineconfig.channelAccessToken === '') {
            this.error(RED._("token not found"));
        }

        const client = new line.Client(lineconfig);

        node.on('input', async (msg, send, done) => {

            try {
                const res = await client.broadcast([{
                    type: 'text',
                    text: msg.payload,
                }]);
                
                const output = {
                    status: `success`,
                    res: res
                };

                msg.payload = output;
                send(msg);
                done();
            } catch (error) {
                console.log(error);
                done(error);
            }
        });
    }

    RED.nodes.registerType("BloadcastMessage", main);
}
