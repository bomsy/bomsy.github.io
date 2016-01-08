(function(window, document) {
  var host = 'https://blog.bomsy.org';
  var baseUrl = 'https://blog.bomsy.org/code/';
  var codeBlocks = document.getElementsByTagName("pre");
  var codeBlock = null;
  var button = null;
  var cb = null;

  function load() {
    for (var i = 0; i < codeBlocks.length; i++) {
      codeBlock = codeBlocks[i];
      button = document.createElement('i');
      button.id = 'block-button-' + i;
      button.addEventListener('click', function() {
        showCodeBin();  
      });
      button.className = 'bins-buttons glyphicon glyphicon-list-alt'
      codeBlock.style.border = '1px red solid';
      codeBlock.parentNode.insertBefore( button, codeBlock)
    }
    cb = createIframe();
    document.body.appendChild(cb);
    hideCodeBin();
  }

  function sendMessage(message) {
    if (cb) {
      cb.contentWindow.postMessage(message, '*');
    }
  }

  function createIframe() {
    var iframe = document.createElement('iframe');
    iframe.className = 'bins-iframe';
    iframe.setAttribute('sandbox', 'allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts');
    iframe.setAttribute('frameBorder', '1');
    iframe.setAttribute('name', 'Code Bin Output ');
    iframe.id = 'code';
    iframe.src = 'https://blog.bomsy.org/code/codebin/';
    iframe.onload = function() {
      sendMessage('function run() { console.log(Hello World); }'); 
    }
    return iframe;
  }

  function showCodeBin() {
    cb.style.display = 'block';
  }

  function hideCodeBin() {
    cb.style.display = 'none';
  }

  // Inject bin css
  var binStyleNode = createLinkNode(baseUrl + 'bins.css', 'stylesheet', 'text/stylesheet');

  var link = document.getElementsByTagName('link') [0];
  link.parentNode.insertBefore(binStyleNode, link);

  // Inject bootstrap css from cdn
  var bsStyleNode = createLinkNode('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css', 'stylesheet', 'text/stylesheet')
  link.parentNode.insertBefore(bsStyleNode, link);

  function createLinkNode(href, rel, type) {
    var linkNode = document.createElement('link');
    linkNode.href = href;
    linkNode.rel = rel;
    linkNode.type = type;

    return linkNode;
  }

  load();

})(window, document);
