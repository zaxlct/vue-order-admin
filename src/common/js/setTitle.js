let setTitle = {

}

setTitle.title = function (title) {
  title = title ? title + '' : '';
  window.document.title = title;
}

export default setTitle
