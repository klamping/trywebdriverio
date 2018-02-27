/* global fetch, WebSocket, location */
(() => {
  const messages = document.querySelector('#messages');
  const run = document.querySelector('#run');
  const share = document.querySelector('#share');
  const closeShare = document.querySelector('.close-share');
  const baseUrl = document.getElementById('baseUrl');
  const spinner = document.getElementById('spinner');
  const download = document.getElementById('download');

  let ws;

  let waitingOnResults = false;
  let failedResultsCount = 0;
  let waitingOnConnection = true;
  let failedConnectionCount = 0;

  var a2h = new AnsiUp();

  // a2h.use_classes = true;

  let timeoutId;
  let connectTimeoutId;

  function queueWaitingMessage () {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    failedResultsCount++;

    if (failedResultsCount > 20) {
      run.innerText = 'Test run error';
      showMessage('\n\nNo results after 60 seconds. Something probably went wrong. Refresh the page and try again.\n');
      spinner.className = "";
    } else {
      timeoutId = setTimeout(function () {
        let msg = 'Waiting on test output.';
        // msg += failedResultsCount === 1 ? ' This may take a minute' : '..';
        showMessage(msg);
        queueWaitingMessage();
      }, 3000);
    }
  }

  function startTest () {
    waitingOnResults = true;
    run.disabled = true;
    run.innerText = "Test Running";
    spinner.className = 'show';
    queueWaitingMessage();
  }
  function endTest () {
    waitingOnResults = false;
    run.disabled = false;
    run.innerText = "Run Test";
    spinner.className = '';

    clearTimeout(timeoutId);
  }

  const showMessage = (message) => {
    message = a2h.ansi_to_html(message);

    if(message.indexOf("\n")==-1){
      message += '\n';
    }

    messages.innerHTML += message;
    messages.scrollTop = messages.scrollHeight;
  };

  function queueConnect () {
    waitingOnConnection = true;

    if (connectTimeoutId) {
      clearTimeout(connectTimeoutId);
    }

    console.log("Connection attempt #", failedConnectionCount);

    if (failedConnectionCount > 30) {
      run.innerText = 'Disconnected';
      showMessage('Unable to connect. Try again later ¯\\_(ツ)_/¯');
      spinner.className = "";
    } else {
      failedConnectionCount++;
      connectTimeoutId = setTimeout(function () {
        connect();
      }, 100);
    }
  }

  function connect () {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket(`ws://${location.host}`);
    ws.onmessage = (msg) => {
      let message = msg.data.trim();
      if (message == 'Tests completed!') {
        endTest();
      } else if (message.length > 0) {
        queueWaitingMessage();
        showMessage(message);
      }

      failedResultsCount = 0;
    };
    ws.onerror = () => {
      if (!waitingOnConnection) {
        showMessage('Connection error');
      }
      console.log('Websocket connection error');
    };
    ws.onopen = () => {
      waitingOnConnection = false;
      failedConnectionCount = 0;
      endTest();

      failedResultsCount = 0;
    };
    ws.onclose = () => {
      if (waitingOnResults) {
        showMessage('Connection closed. Try running test again after reconnecting.');
        endTest();
      }
      run.innerText = 'Reconnecting...';
      run.disabled = true;
      spinner.className = "show";
      ws = null;
      queueConnect();
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

    ws.send(JSON.stringify(data));

    startTest();

    _paq.push(['trackEvent', 'Functionality', 'Button', 'Run']);
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
      let shareUrl = new URL('/share/' + id, document.location);
      let input = document.getElementById('sharable-url');
      document.getElementById('shareUrl').className = "show";
      document.getElementById('sharable-url').value = shareUrl.href;
      input.select();
      history.pushState(null, null, shareUrl.href);
    });

    _paq.push(['trackEvent', 'Functionality', 'Button', 'Share']);
  };

  closeShare.onclick = () => {
      document.getElementById('shareUrl').className = "";
  }

  download.onclick = () => {
    document.getElementById('thecode').innerHTML = editor.getValue();
  }

  queueConnect();
})();