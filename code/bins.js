(function(window, document) {
  var baseUrl = 'https://blog.bomsy.org/code/';
  var codeBlocks = document.getElementsByTagName("pre");
  var codeBlock = null;
  var button = null;
  var cb = null;

  function findAndLoadCodeButtons() {
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
  }

  function loadCodeBin() {
    cb = document.createElement('iframe');
    cb.className = 'bins-iframe';
    cb.setAttribute('sandbox', 'allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts');
    cb.setAttribute('frameBorder', '1');
    cb.setAttribute('name', 'Code Bin Output ');
    cb.id = 'code';
    cb.src = 'https://blog.bomsy.org/code/codebin/'
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

  findAndLoadCodeButtons();

})(window, document);
