module.exports = function(RED) {

    const line = require('@line/bot-sdk');
    
    function LinebotReplyNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        // line設定作成
        const lineconfig = {
            channelAccessToken: config.channelAccessToken,
            channelSecret: config.channelSecret
        }
        // lineクライアント作成
        const client = new line.Client(lineconfig);
        node.on('input', function(msg) {
            // get line event
            const line_event = msg.payload.events[0];
            // get message
            const received_msg = line_event.message.text;

            // create reply
            var massage = { type: 'text', text: config.replyMessage };
            var result = client.replyMessage(line_event.replyToken, massage);

            node.send(result);
        });
    }
    RED.nodes.registerType("linebot-reply",LinebotReplyNode);
}