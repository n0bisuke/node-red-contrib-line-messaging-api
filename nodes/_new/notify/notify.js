module.exports = (RED) => {
    'use strict';

    const LINE_NOTIFY_BASE_URL = 'https://notify-api.line.me';
    const LINE_NOTIFY_PATH =  '/api/notify';
    // let REQUEST_OPTIONS = {};

    const main = function(config){
        const node = this;
        RED.nodes.createNode(node, config);

        /**
         * 実行時の処理
         */
        node.on('input', async (msg, send, done) => {
            // const REQUEST_URL = `${LINE_NOTIFY_BASE_URL}${LINE_NOTIFY_PATH}?message=${encodeURI(mes)}&stickerPackageId=1`;
            try {
                const REQUEST_URL = `${LINE_NOTIFY_BASE_URL}${LINE_NOTIFY_PATH}`;
                const mes = msg.payload;
                console.log(mes, typeof mes);

                let params = {};
                try {
                    params = JSON.parse(mes); // JSON形式の場合
                } catch (error) {
                    params.message = mes;   
                }

                const LINE_NOTIFY_TOKEN = node.credentials.AccessToken;
                const REQUEST_OPTIONS = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`
                    },
                    body: new URLSearchParams(params).toString()
                };

                const response = await fetch(REQUEST_URL, REQUEST_OPTIONS);
                const data = await response.json();
                msg.payload = data;
                console.log(data); // { status: 200, message: 'ok' }
                send(msg);
                done();
            } catch (error) {
                console.log(error);
                done(error);
            }
        });
    }

    RED.nodes.registerType("Notify_New", main, {
        credentials: {
            AccessToken: {type:"password"}
        }
    });
}