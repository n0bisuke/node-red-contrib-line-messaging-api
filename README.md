LINE Messagin APIのNode-REDのノードです。

```html
<script type="text/javascript">
    RED.nodes.registerType('LINE Reply Message',{
        category: 'LINE',
        color: '#01B301',
        defaults: {
            name: {value:""},
            channelAccessToken:{value:""},
            channelSecret:{value:""},
            replyMessage:{value:"Hello!"}
        },
        inputs:1,
        outputs:1,
        icon: "arrow-in.png",
        align: "right",
        label: function() {
            return this.name||"LINE Reply Message";
        }
    });
</script>

<script type="text/x-red" data-template-name="LINE Reply Message">
    <div class="form-row">
        <label for="node-input-name"><i class="icon-tag"></i> Name</label>
        <input type="text" id="node-input-name" placeholder="Name">
    </div>
    <div class="form-row">
        <label for="node-input-channelAccessToken"><i class="icon-tag"></i> AccessToken</label>
        <input type="text" id="node-input-channelAccessToken" placeholder="ChannelAccessToken">
    </div>
    <div class="form-row">
        <label for="node-input-channelSecret"><i class="icon-tag"></i> Secret</label>
        <input type="password" id="node-input-channelSecret" placeholder="ChannelSecret">
    </div>
    <div class="form-row">
        <label for="node-input-replyMessage"><i class="icon-tag"></i> ReplyMessage</label>
        <input type="text" id="node-input-replyMessage" placeholder="ReplyMessage">
    </div>
</script>

<script type="text/x-red" data-help-name="LINE Reply Message">
    <p>ノードで指定した文字列をLINEに返します</p>
</script>
```