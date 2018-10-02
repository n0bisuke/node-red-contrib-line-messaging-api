module.exports = function(RED) {
    var request = require('request');
    var hostname = 'http://ambidata.io';

    function ambient(n) {
        RED.nodes.createNode(this,n);
        this.channelId = n.channelId;
        this.writeKey = n.writeKey;
        var node = this;

        this.on('input', function(msg) {
            var payload = msg.payload;
            payload.writeKey = node.writeKey;
            options = { // HTTPパケットの組み立て
                url: hostname + '/api/v2/channels/' + node.channelId + '/data',
                headers: {'Content-Type': 'application/json'},
                body: payload,
                json: true
            };

            request.post(options, function(err, res, body) { // HTTP POST
                if (err) {
                    node.error(err);
                    node.status({fill:"red", shape:"ring", text:"ambient send failed"});
                } else {
                    node.status({});
                }
            });
        });
    }
    RED.nodes.registerType("Ambient",ambient);
}