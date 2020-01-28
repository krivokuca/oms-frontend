/**
 * Some utilities that are good to have
 */

/**
 * Calculates the screen width and height
 * @returns An array : [width, height]
 */

export default class OrwellUtils {
  constructor() {
    this.meta = new MetaUtils();
    return this;
  }
  /**
   * Calculates the screen width and length
   * @returns Array : [width, length]
   */
  screenSize() {
    let width = window.screen.width ? window.screen.width : "";
    let height = window.screen.height ? window.screen.height : "";
    return [width, height];
  }
  userAgent() {
    return window.navigator.userAgent;
  }
  osName() {
    var OSName = "Unknown";
    if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1)
      OSName = "Windows 10";
    if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1)
      OSName = "Windows 8";
    if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1)
      OSName = "Windows 7";
    if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1)
      OSName = "Windows Vista";
    if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1)
      OSName = "Windows XP";
    if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1)
      OSName = "Windows 2000";
    if (window.navigator.userAgent.indexOf("Mac") != -1) OSName = "Mac/iOS";
    if (window.navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX";
    if (window.navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";
    return OSName;
  }

  /**
   * Returns the browser name, version and the navigator appname
   * @returns Array : [browserName, browserVersion, navigatorAppName]
   */
  browserInfo() {
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = "" + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
      browserName = "Opera";
      fullVersion = nAgt.substring(verOffset + 6);
      if ((verOffset = nAgt.indexOf("Version")) != -1)
        fullVersion = nAgt.substring(verOffset + 8);
    } else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
      browserName = "Microsoft Internet Explorer";
      fullVersion = nAgt.substring(verOffset + 5);
    } else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
      browserName = "Chrome";
      fullVersion = nAgt.substring(verOffset + 7);
    } else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
      browserName = "Safari";
      fullVersion = nAgt.substring(verOffset + 7);
      if ((verOffset = nAgt.indexOf("Version")) != -1)
        fullVersion = nAgt.substring(verOffset + 8);
    } else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
      browserName = "Firefox";
      fullVersion = nAgt.substring(verOffset + 8);
    } else if (
      (nameOffset = nAgt.lastIndexOf(" ") + 1) <
      (verOffset = nAgt.lastIndexOf("/"))
    ) {
      browserName = nAgt.substring(nameOffset, verOffset);
      fullVersion = nAgt.substring(verOffset + 1);
      if (browserName.toLowerCase() == browserName.toUpperCase()) {
        browserName = navigator.appName;
      }
    }
    if ((ix = fullVersion.indexOf(";")) != -1)
      fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
      fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt("" + fullVersion, 10);
    if (isNaN(majorVersion)) {
      fullVersion = "" + parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
    }
    return [browserName, fullVersion, navigator.appName];
  }

  /**
   * Retrieves the user cookies present on the current browser
   * @returns Object : {cookieName : cookieValue, ...}
   */
  userCookies() {
    return this.meta._parseCookie(document.cookie);
  }

  /**
   * @param {Object} sessionObject The most recent state
   */
  createSession(sessionObject) { 
  }
}

class MetaUtils {
  _parseCookie(cookieString) {
    let cookieObject = {};
    let cookies = cookieString.split(";");
    for (let k in cookies) {
      let d = k.split("=");
      cookieObject[d[0].trim()] = d[1].trim();
    }
    return cookieObject;
  }

  /**
   * Transforms a session object into a POSTable string
   * @param {Object} sessionObject The session Object
   */
  _parseSessionObject(sessionObject) {
    let append = "";
    for (let k in Object.keys(sessionObject)) {
      let key = Object.keys(sessionObject)[k];
      append += `${key}=${sessionObject[key]}&`;
    }
    append = append.substring(0, append.length - 1);
    return append;
  }
  
}
