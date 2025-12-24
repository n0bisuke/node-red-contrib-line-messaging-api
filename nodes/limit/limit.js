module.exports = (RED) => {
    'use strict';

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
        const LINE_TOKEN = lineconfig.channelAccessToken;

        node.on('input', async (msg, send, done) => {
            const mes = msg.payload;
            try {
                // LINEのクォータ情報を取得するAPIのURL
                const quotaUrl = `https://api.line.me/v2/bot/message/quota`;
                const consumptionUrl = `${quotaUrl}/consumption`;

                // Fetch APIを使ってクォータ情報を取得
                const resLimit = await fetch(quotaUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${LINE_TOKEN}`
                    }
                });

                const resCurrent = await fetch(consumptionUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${LINE_TOKEN}`
                    }
                });

                // レスポンスをJSONとして解析
                const dataLimit = await resLimit.json();
                const dataCurrent = await resCurrent.json();

                const output = {
                    type: dataLimit.type,
                    limit: dataLimit.value,
                    totalUsage: dataCurrent.totalUsage,
                    usagePercentage: dataCurrent.totalUsage / dataLimit.value
                };

                msg.payload = output;
                send(msg);
                done();
            } catch (error) {
                console.error(error);
                done(error);
            }

        });
    }

    RED.nodes.registerType("Limit", main);
}
