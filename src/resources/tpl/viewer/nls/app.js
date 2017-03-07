/* eslint quotes: ["error", "double"] */
/* nls files need to use double quotes */

define({
  root: ({
    viewer: {
      common: {
        save: "Save",
        close: "Close"
      },
      errors: {
        boxTitle: "An error has occurred",
        invalidConfig: "Invalid configuration",
        invalidConfigNoApp: "Web Mapping Application identifier not specified in index.html.",
        invalidConfigNoAppDev: "No Web Mapping Application identifier is specified in URL parameters (?appid=). In development mode, the appid configuration in index.html is ignored.",
        unspecifiedConfigOwner: "Authorized owner hasn't been configured.",
        invalidConfigOwner: "Story owner is not authorized.",
        invalidConfignoOAuth: "This story requires authentication, please configure an ArcGIS OAuth ID in index.html or make the story public.",
        appLoadingFail: "Something went wrong, the {TPL_NAME} did not load correctly.",
        notConfiguredDesktop: "The story is not configured yet.",
        notConfiguredMobile: "The {TPL_NAME} builder is not supported at this display size. If possible, resize your browser to access the builder or please build your story on a device with a larger screen.",
        notConfiguredMobile2: "Please rotate your device to landscape orientation to use the {TPL_NAME} builder.",
        notAuthorized: "You are not authorized to access this story",
        notAuthorizedBuilder: "You are not authorized to use {TPL_NAME} builder.",
        noViewerIE: "This story is not supported in Internet Explorer before version ${VERSION}. ${UPGRADE}.",
        upgradeBrowser: "Please update your browser",
        mapLoadingFail: "Something went wrong, the map did not load correctly.",
        signOut: "Sign Out",
        builderSupport1: "Story Map Cascade is in beta and its builder is supported only in ${CHROME} and ${SAFARI}. Cascade stories that you create and share will work on those browsers and Internet Explorer 11+ and Firefox.",
        builderSupport2: "Story Map Cascade is in beta and its builder is not supported on iPad. Cascade stories that you create and share will work on iPad.",
        sorry: "Sorry!"
      },
      mobileWarning: {
        message1: "You've read the mobile version of this story. For the full version, with richer media elements try it out on a desktop computer.",
        email: "Email a link to this story"
      },
      media: {
        captionPlaceholder: "Your caption here...",
        loadingError: "Sorry, this content is not accessible",
        explore: "Explore",
        exploreMap: "Explore Map",
        exploreStop: "Stop Exploring",
        sceneNotSupported: "Sorry this 3D map is not supported on your device."
      },
      headerFromCommon: {
        defaultTagline: "A ${STORY_MAP}",
        share: "Share",
        tooltipAutoplayDisabled: "This isn't available in autoplay mode"
      },
      shareFromCommon: {
        copy: "Copy",
        copied: "Copied",
        open: "Open",
        embed: "Embed in web page",
        embedExplain: "Use the following HTML code to embed the story in a web page.",
        size: "Size (width/height):",
        autoplayLabel: "Autoplay mode",
        autoplayExplain1: "Autoplay mode will advance through your story at a regular interval. This is ideal on a kiosk or public display monitor, but be aware that in other situations it may make the story harder to read. This feature isn't supported on small displays.",
        autoplayExplain2: "When this mode is active there are controls to play/pause the story and adjust the navigation speed.",
        linksupdated: "Links updated!"
      }
    }
  }),
  "ar": 1,
  "bs": 1,
  "cs": 1,
  "da": 1,
  "de": 1,
  "el": 1,
  "es": 1,
  "et": 1,
  "fi": 1,
  "fr": 1,
  "he": 1,
  "hr": 1,
  "id": 1,
  "it": 1,
  "ja": 1,
  "ko": 1,
  "lt": 1,
  "lv": 1,
  "nl": 1,
  "nb": 1,
  "pl": 1,
  "pt-br": 1,
  "pt-pt": 1,
  "ro": 1,
  "ru": 1,
  "sr": 1,
  "sv": 1,
  "th": 1,
  "tr": 1,
  "vi": 1,
  "zh-cn": 1,
  "zh-hk": 1,
  "zh-tw": 1
});