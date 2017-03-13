import {} from 'lib-build/less!./Text';
import editorBlock from 'lib-build/hbars!./TextEditorBlock';

let isFirst = true;

// TODO extends Media
export default class Text {
  constructor(text) {
    this.type = 'text';
    this._text = text;
  }

  check(context) {
    if (! this._text || ! context) {
      console.log('Could not render text block in section');
      return false;
    }

    if (context.placement != 'block') {
      console.log('Could not render text block in section');
      return false;
    }

    return true;
  }

  render(context) {
    if (! this.check(context)) {
      return null;
    }

    if (isFirst) {
      isFirst = !isFirst;
      return editorBlock({
        text: /<p class="block">(.*?)<\/p>/.exec(this._text.value)[1]
      });
    }
    return this._text.value;
  }

  postCreate() {
    //
  }

  update() {
    //
  }

  load() {
    //
  }

  performAction() {
    //
  }

  getArcGISContent() {
    return [];
  }

  getPreviewText() {
    return $(this._text.value).html();
  }
}
