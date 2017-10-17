/* global fetch, WebSocket, location */
(() => {
  const messages = document.querySelector('#messages');
  const run = document.querySelector('#run');
  const share = document.querySelector('#share');
  const baseUrl = document.getElementById('baseUrl');
  const url = new URL(document.location);

  let ws;

  var a2h = new AnsiUp();

  // a2h.use_classes = true;

  const showMessage = (message) => {
    message = a2h.ansi_to_html(message);

    if(message.indexOf("\n")==-1){
      message += '\n';
    }

    messages.innerHTML += message;
    messages.scrollTop = messages.scrollHeight;
  };

  function connect () {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket(`ws://${location.host}`);
    ws.onmessage = (msg) => {
      if (msg.data == 'Tests completed!') {
        document.getElementById('run').disabled = false;
      }

      showMessage(msg.data)
    };
    ws.onerror = () => showMessage('WebSocket error');
    ws.onopen = () => {
      // undisable button
      document.getElementById('run').disabled = false;
    };
    ws.onclose = () => {
      showMessage('WebSocket connection closed');
      ws = null;
      document.getElementById('run').disabled = true;
    };
  };

  run.onclick = () => {
    if (!ws) {
      connect();
    }

    let data = {
      baseUrl: baseUrl.value,
      code: editor.getValue()
    };

    document.getElementById('run').disabled = true;

    ws.send(JSON.stringify(data));
  };

  share.onclick = () => {
    var data = new FormData();
    data.append('baseUrl', baseUrl.value);
    data.append('code', editor.getValue());

    let req = fetch("/save", {
      method: "POST",
      body: data
    });

    req.then(function(response) {
      return response.text();
    }).then(function(id) {
      let shareUrl = new URL('?share=' + id, document.location);
      document.getElementById('shareUrl').className = "show";
      document.getElementById('sharable-url').value = shareUrl.href;
      history.pushState(null, null, shareUrl.href)
    });
  };

  let params = url.searchParams;
  let shareId = params.get("share")

  if (shareId) {
    let req = fetch("/load/" + shareId, {
      method: "GET"
    });

    req.then(function(response) {
      return response.json();
    }).then(function(content) {
      // load content in to areas
      baseUrl.value = content.baseUrl;
      editor.setValue(content.file)
    });
  }

  connect();
})();