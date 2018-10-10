module.exports = (RED) => {
    const line = require('@line/bot-sdk');

    function LineSimpleReplay(config) {
        let lineconfig;
        try {
            lineconfig = require('../../env');
        } catch (error) {
            lineconfig = {
                channelSecret: config.channelSecret,
                channelAccessToken: config.channelAccessToken
            };
        }

        if(lineconfig.channelSecret === '' || lineconfig.channelAccessToken === '') {
            this.error(RED._("token not found"));
        }
        const client = new line.Client(lineconfig);
        RED.nodes.createNode(this,config);
        const node = this;

        //メインの処理
        const handleEvent = (event) => {
            if (event.type !== 'message' || event.message.type !== 'text') {
              return Promise.resolve(null);
            }
    
            return client.replyMessage(event.replyToken, {
              type: 'text',
              text: config.message || event.message.text //実際に返信の言葉を入れる箇所
            });
        }

        node.on('input', (msg) => {
            Promise
                .all(msg.payload.events.map(handleEvent))
                .then(result => {
                    // [{}]が返ってきてる
                    if (result.length === 1 && 0 === Object.keys(result[0]).length) {
                        result = {status: 200, message: 'Success'}
                    }
                    msg.payload = result;
                    node.send(msg)
                }).catch(err => {
                    console.log(err);
                    // throw new Error(result);
                    // this.error(RED._("twitter.errors.missingcredentials"));
                    // node.status({fill:"red", shape:"dot", text:" "});
                    // node.warn(RED._("twitter.errors.unexpectedend"));
                    // node.tout = setTimeout(function() { setupStream() },15000);
                    // node.status({fill:"red",shape:"ring",text:"twitter.status.failed"});
                    // node.warn(RED._("twitter.errors.unexpectedend"));
                    node.error(err,'aaaa');
                    this.status({fill:"red", shape:"ring", text:err});
                    // throw new Error(result);
                    // msg.payload = result;
                    // node.send(err)
                });
        });
    }

    RED.nodes.registerType("ReplyMessage", LineSimpleReplay);
}