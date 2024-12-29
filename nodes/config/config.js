module.exports = function(RED) {
    const { Client } = require('@line/bot-sdk');

    function main(n) {
        RED.nodes.createNode(this, n);
        // コンフィグノードの初期化
    }

    RED.nodes.registerType("lineConfig", main, {
        defaults: {
            botName: { type: "text" }
        },
        credentials: {
            LineChannelSecret: { type: "text" },
            LineChannelAccessToken: { type: "text" }
        }
    });

    // Admin HTTP API 用のエンドポイント
    RED.httpAdmin.post('/line-config/bot-info', async function(req, res) {
        try {
            const channelSecret = req.body.channelSecret;
            const channelAccessToken = req.body.channelAccessToken;
            if (!channelSecret || !channelAccessToken) {
                return res.status(400).send("No channelSecret or channelAccessToken");
            }

            const clientConfig = {
                channelSecret,
                channelAccessToken
            };
            const client = new Client(clientConfig);

            const botInfo = await client.getBotInfo();
            // botInfo.displayName, botInfo.pictureUrl などを含む
            return res.json(botInfo);

        } catch (err) {
            console.error("Failed to getBotInfo:", err);
            res.status(500).send(err.message || "Failed to get botInfo");
        }
    });
}
