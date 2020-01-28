/**
 * Orwell Client
 * Creates the `1984` worker that tracks users through the page
 */
import OrwellUtils from "./OrwellUtils";

class Orwell {
  constructor() {
    this.utils = new OrwellUtils();
    this.isLogging = false;
    this.globalSession = false;
    this.otid = false;
    this.globalTimeInterval = 5000; // refresh time
    this.mouseActivityCache = [];
  }

  /**
   * Starts the main tracking loop
   */
  startTracking(callback) {
    let browserInfo = this.utils.browserInfo();
    let screenSize = this.utils.screenSize();
    //eslint-disable-next-line
    this.otid = oot.o.otid;
    // TODO: don't hardcode the config file and write a parser instead
    this.globalSession = {
      A: {
        1: this.utils.osName(),
        2: browserInfo[0],
        3: this.utils.userAgent(),
        //eslint-disable-next-line
        4: oot.o.ip, // Globally defined variable injected by the backend into the page
        5: this.utils.userCookies()
      },
      B: {
        6: "QUICKPLAY",
        7: window.location.href,
        8: document.title,
        8: screenSize[1],
        9: screenSize[0]
      },
      C: {},
      D: {},
      E: {
        //eslint-disable-next-line
        18: oot.v.vid,
        //eslint-disable-next-line
        19: oot.snowflake,
        //eslint-disable-next-line
        20: oot.v.token,
        //eslint-disable-next-line
        21: oot.v.keywords,
        //eslint-disable-next-line
        22: oot.v.type,
        23: new Date().getTime() / 1000
      }
    };
  }

  /**
   * Stops the background logging service
   */
  stopTracker() {
    this.ajax.assignAPIToken().then(() => {});
  }

  /**
   * This tracker is instantiated everytime the mouse moves, updating the X and Y
   * coordinates of the mouse on the page. This function in turn them updates the
   * this.mouseActivityCache 2d array.
   */
  _handleMouseMove(event) {
    // fuck ie
    let x = event.pageX;
    let y = event.pageY;
    this.mouseActivityCache.push([x, y]);
  }

  /**
   *
   * @param {String} id The html id
   * @param {String} type What type of click
   * @param {Bool/String} vid Was a vid triggered?
   */
  click(id, type, vid) {}
}
export default Orwell;
