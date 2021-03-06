import Media from './Media';
import CommonHelper from 'storymaps/common/utils/CommonHelper';

import {} from 'lib-build/less!./Image';
import viewBlock from 'lib-build/hbars!./ImageBlock';
import viewBackground from 'lib-build/hbars!./ImageBackground';

import i18n from 'lib-build/i18n!resources/tpl/viewer/nls/app';

import UIUtils from 'storymaps/tpl/utils/UI';
import Deferred from 'dojo/Deferred';

const PREVIEW_THUMB = 'resources/tpl/builder/icons/media-placeholder/image.jpg';
const PREVIEW_ICON = 'resources/tpl/builder/icons/immersive-panel/image.png';

const BLOCK_WIDTH_SMALL = 0.4;
const BLOCK_WIDTH_MEDIUM = 0.8;
const BLOCK_HEIGHT_FOR_CAPTION = 200;

export default class Image extends Media {

  constructor(image) {
    // fix sharing url on image constructor...
    const needsFixing = CommonHelper.uploadedImageNeedsFixing(image.url);
    if (needsFixing) {
      image.url = CommonHelper.fixUploadedImageUrl(image.url);
      if (image.thumbUrl) {
        image.thumbUrl = CommonHelper.fixUploadedImageUrl(image.thumbUrl);
      }
    }

    // sizes is an array of objects with {height, width, url}.
    if (image.sizes && image.sizes.length) {
      const screenWidth = $('body').width() || window.screen.width;

      // sort sizes arr by longestSide, with largest first.
      image.sizes.forEach((sizeObj) => {
        sizeObj.longestSide = Math.max(sizeObj.width, sizeObj.height);
        // do this here while we're already iterating through the sizes
        if (needsFixing) {
          sizeObj.url = CommonHelper.fixUploadedImageUrl(sizeObj.url);
        }
      });
      image.sizes.sort((a, b) => {
        if (b.longestSide === a.longestSide) {
          return Math.min(b.width, b.height) - Math.min(a.width, a.height);
        }
        // what if they're the same? then compare shorter side...?
        return b.longestSide - a.longestSide;
      });

      // find the size who's longest side is closest to, without going too far over,
      // the screen width. (remember, image.sizes is already sorted, descending order).
      // start with the largest one, and reduce, in case none of the available photos
      // are larger than the screen width.
      let previewTarget, mainTarget = image.sizes[0];
      image.sizes.every((sizeObj) => {
        if (sizeObj.longestSide > screenWidth - 50) {
          mainTarget = sizeObj;
          return true;
        }
        return false;
      });

      // find the size who's longest side is closest to 250px
      image.sizes.every((sizeObj) => {
        if (sizeObj.longestSide >= 250) {
          previewTarget = sizeObj;
          return true;
        }
        return false;
      });

      // just in case the sizes object wasn't properly formatted, check for mainTarget.
      if (mainTarget.url && mainTarget.width && mainTarget.height) {
        image.url = mainTarget.url;
        image.width = mainTarget.width;
        image.height = mainTarget.height;
      }
      if (previewTarget) {
        image.thumbUrl = previewTarget.url;
      }
    }
    let id = image.url;

    if (image.dataUrl && image.uploadDeferred) {
      id = UIUtils.getUID();
    }

    super({
      type: 'image',
      id: id,
      previewThumb: image.thumbUrl || image.dataUrl || image.url || PREVIEW_THUMB,
      previewIcon: PREVIEW_ICON
    });

    this._image = image;
    this._url = image.url;
    this._placement = null;

    // TODO: shouldn't be needed
    if (! this._image.options) {
      this._image.options = {};
    }

    if (image.dataUrl && image.uploadDeferred) {
      this._isUploadPending = true;
      this._url = image.dataUrl;

      delete this._image.dataUrl;

      image.uploadDeferred.then(
        this._onUploadSuccess.bind(this),
        this._onUploadFail.bind(this)
      );
    }
  }

  render(context) {
    var output = '',
        options = [];

    if (! this._image || ! context) {
      console.log('Could not render image in section');
      return output;
    }

    this._placement = context.placement;

    /*
    if (this._image.href) {
      options.push('has-link');
    }
    */

    if (this._placement == 'block') {
      var style = this._computeBlockStyle();

      options.push('block-size-' + style.size);

      // This set a max-height in CSS that is needed for large image
      if (style.fitHeight) {
        options.push('fit-height');
      }
      output += viewBlock({
        id: this._domID,
        classes: ['block', 'image'].concat(options).join(' '),
        padding: style.padding,
        caption: this._image.caption,
        placeholder: i18n.viewer.media.captionPlaceholder,
        captionEditable: app.isInBuilder
      });
    }
    else if (context.placement == 'background') {
      if (UIUtils.isMobileBrowser() && this._image.alternate) {
        this._image.url = this._image.alternate;
        this._url = this._image.url;
      }

      output += viewBackground({
        id: this._domID,
        classes: ['image', 'image-background'].join(' '),
        caption: this._image.caption
      });
    }

    return output;
  }

  postCreate(params = {}) {
    super.postCreate(params);

    if (! params.container) {
      return;
    }

    /*
     * Background Image behave a little differently than other medias because
     *  - they can be in the story while they are getting uploaded and we need to support duplicate of it's view/section
     *  - in Immersive you may want to use the same image twice in the section and have different transition
     * So background Image are always duplicated inside the section
     * That's ok as browser will cache them
     */
    if (this._placement == 'block') {
      this._node = params.container.find('#' + this._domID);
    }
    else {
      this._node = params.container.find('#' + this._domID).parent();
    }

    if (this._isUploadPending) {
      this._onUploadStart();
    }

    this._applyConfig();
  }

  _applyConfig() {
    var options = this._image.options;

    this._applyPlacement();

    // Test
    options.size = options.size || 'small';

    super._applyConfig(options);
  }

  _applyPlacement() {
    if (this._image.options && this._image.options.placement) {
      let backgroundImage = this._node.find('.image-background');
      let placement = this._image.options.placement;
      // only things with these properties explicitly set should be applied
      if (placement.type === 'fill') {
        backgroundImage.css('background-size', 'cover');

        // if there's also a particular placement of the image, apply that (else just center the image)
        if (placement.fill) {
          let containerDimensions = {
            width: backgroundImage.width(),
            height: backgroundImage.height()
          };
          let rawItemDimensions = {
            width: this._image.width,
            height: this._image.height
          };
          let itemDimensions = Media.getTargetDimensions(rawItemDimensions, containerDimensions);
          let cropDistance = Media.findCropDistance(itemDimensions, backgroundImage, placement.fill);

          backgroundImage.css('background-position', `${cropDistance.x}px ${cropDistance.y}px`);
        }
        else {
          backgroundImage.css('background-position', '50% 50%');
        }
      }
      else if (placement.type === 'fit') {
        backgroundImage.css('background-color', placement.fit.color);
        backgroundImage.css('background-size', 'contain');
        backgroundImage.css('background-position', '50% 50%');
      }
    }
  }

  // Loading through an invisible image
  preload() {
    var resultDeferred = new Deferred();

    var im = new window.Image();

    im.onload = function(e) {
      var width = e.currentTarget.naturalWidth,
          height = e.currentTarget.naturalHeight;

      resultDeferred.resolve({
        width: width,
        height: height
      });
      // if app isn't in builder mode, and the
      // image has, in fact, loaded, take off the error
      if (!app.builder) {
        this.removeError();
      }
    }.bind(this);

    im.onerror = function() {
      if (app.builder) {
        this.setError({showLoadingError: true});
      }
      else {
        this.setError({minimizeInViewer: true});
      }
    }.bind(this);

    im.src = Media.addToken(this._url);

    return resultDeferred;
  }

  load() {
    var resultDeferred = new Deferred();

    if (this._isLoaded || ! this._node) {
      //resultDeferred.reject();
      return resultDeferred;
    }

    this._isLoaded = true;

    // Preload to get/update image dimension and hide loading indicator
    this.preload().then(function(p) {
      if (p && p.width && p.height) {
        this._image.width = p.width;
        this._image.height = p.height;

        this._node.find('.image-container').css('padding-top', this._computeBlockStyle().padding + '%');
      }
      this._node.find('.media-loading').hide();
    }.bind(this));

    if (this._placement == 'block') {
      this._node.find('.image-container').css('backgroundImage', 'url("' + Media.addToken(this._url) + '")');

      /*
      if (this._image.href) {
        this._node.find('img').click(function() {
          window.open(this._image.href, '_blank');
        });
      }
      else {
        var img = node.find('img'),
            fluidbox = img.parent();

        var onImageMaximized = function() {
          fluidbox.trigger('close.fluidbox');
          $(window).off('scroll', onImageMaximized);
        };

        fluidbox
          .on('openend.fluidbox', function() {
            $(window).scroll(onImageMaximized);
          })
          .fluidbox();
      }*/

    }
    else {
      this._node.find('.image-background').css('backgroundImage', 'url("' + Media.addToken(this._url) + '")');

      if (this._image['mobile-pos'] && UIUtils.isMobileBrowser()) {
        this._node.find('.image-background').css('backgroundPositionX', this._image['mobile-pos']);
      }
    }

    resultDeferred.resolve();
    return resultDeferred;
  }

  performAction() {
    if (! this._isLoaded) {
      this.load();
    }
  }

  resize() {
    //
    this._applyPlacement();
  }

  isLoaded() {
    return true; // TODO need to load image async
  }

  getNode() {
    return this._node;
  }

  update() {
    //
  }

  isPlaceholder() {
    return !! this._image.isPlaceholder;
  }

  _computeBlockStyle() {
    var size = 'small',
        fitHeight = true;

    if (this._image.options) {
      if (this._image.options.size) {
        size = this._image.options.size;
      }

      if (this._image.options.fitHeight !== undefined) {
        fitHeight = this._image.options.fitHeight;
      }

      //options.push(this._image.options.filter ? ('filter-' + this._image.options.filter) : '');
    }

    /*
     * The image sizing in block using the padding technique
     * The vertical padding is relative to the width so this offer
     *  when coupled with background-image a really convenient way to avoid
     *  any JS running when resizing the app
     */
    var imHeight = this._image.height,
        avaWidth = this._image.width,
        imPadding = null;

    // Small and medium are constrained in width
    // So first need to apply that and recompute the height
    if (size == 'small' || size == 'medium') {
      var imRatio = this._image.width / imHeight;

      if (size == 'small') {
        avaWidth = app.display.windowWidth * BLOCK_WIDTH_SMALL;
      }
      else {
        avaWidth = app.display.windowWidth * BLOCK_WIDTH_MEDIUM;
      }

      imHeight = Math.round(avaWidth / imRatio);
      // Assuming fitHeight = true
      imHeight = Math.min(imHeight, app.display.windowHeight - BLOCK_HEIGHT_FOR_CAPTION);
    }

    // If the image is smaller than available width and
    //  - user doesn't want it to fit browser height
    //  - or the image height is smaller than browser height
    if (this._image.width < avaWidth && (! fitHeight || this._image.height < app.display.windowHeight - BLOCK_HEIGHT_FOR_CAPTION)) {
      imPadding = this._image.height / this._image.width * (this._image.width / avaWidth) * 100;
    }
    else {
      imPadding = imHeight / Math.min(this._image.width, avaWidth) * 100;
    }

    imPadding = Math.round(imPadding * 10) / 10;

    return {
      size: size,
      fitHeight: fitHeight,
      padding: imPadding
    };
  }
}
