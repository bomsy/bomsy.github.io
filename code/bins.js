(function(window, document) {
  var baseUrl = 'https://blog.bomsy.org/code/';
  var codeBlocks = document.getElementsByTagName("pre");
  var codeBlock = null;
  var button = null;

  function findAndLoadCodeButtons() {
    for (var i = 0; i < codeBlocks.length; i++) {
      codeBlock = codeBlocks[i];
      button = document.createElement('i');
      button.id = 'block-button-' + i;
      button.class = 'bins-buttons glyphicon glyphicon-list-alt'
      codeBlock.style.border = '1px red solid';
      codeBlock.parentNode.insertBefore( button, codeBlock)
    }
  }

  // Inject bin css
  var binStyleNode = createLinkNode(baseUrl + 'bins.css', 'stylesheet', 'text/stylesheet');

  var link = document.getElementsByTagName('link') [0];
  link.parentNode.insertBefore(binStyleNode, link);

  // Inject bootstrap css from cdn
  var bsStyleNode = createLinkNode('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css', 'stylesheet', 'text/stylesheet')
  link.parentNode.insertNode(bsStyleNode, link);

  function createLinkNode(href, rel, type) {
    var linkNode = document.createElement('link');
    linkNode.href = href;
    linkNode.rel = rel;
    linkNode.type = type;

    return linkNode;
  }

  findAndLoadCodeButtons();

})(window, document);
