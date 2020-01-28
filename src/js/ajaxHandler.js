/**
 * @class AJAXHandler
 * @description This module provides a simple API to communicate with the backend API through
 * asychronous AJAX calls.
 * @author Daniel Krivokuca
 * @version 1.0.0
 */

import Dexie from "dexie"; // Since i cant be bothered to deal with the IndexedDB native API
class AJAXHandler {
  constructor() {
    // 37.120.205.115:27803/
    this.rootURL = "http://localhost:8080/";
    this.apiToken = null;
    this.indexDbStorageName = "omsks";
    this.userCookieValue = "st_";
    this.validStages = ["home", "movie", "tv", "recommended"];
    this.apiEndpoints = {
      get: {
        search: {
          endpoint: `${this.rootURL}api/search?q=%QUERY%&page=%PAGE%`,
          match: ["%QUERY%", "%PAGE%"]
        },
        discover: {
          endpoint: `${this.rootURL}api/discover?q=%QUERY%&torrents=%TQUERY%`,
          match: ["%QUERY%", "%TQUERY%"]
        },
        stream: {
          endpoint: `${this.rootURL}api/stream?vid=%VID%&sid=%SID%`,
          match: ["%VID%", "%SID%"]
        },
        playback: {
          endpoint: `${this.rootURL}api/playback?part=%PID%&sid=%SID%`,
          match: ["%PID%", "%SID%"]
        },
        generate: {
          endpoint: `${this.rootURL}api/generate?stage=%STAGE%&page=%PAGE%`,
          match: ["%STAGE%", "%PAGE%"]
        },
        assign: {
          endpoint: `${this.rootURL}api/assign?token=%TOKEN%`,
          match: ["%TOKEN%"]
        }
      },
      post: {
        gen_token: {
          endpoint: `${this.rootURL}gen_token`,
          body: ["type", "vid", "uid", "vtoken"]
        },
        gen_login: {
          endpoint: `${this.rootURL}gen_login`,
          body: ["nick", "pass"]
        },
        gen_stat: {
          endpoint: `${this.rootURL}gen_stat`,
          body: [
            "mode",
            "user_agent",
            "ip",
            "page",
            "sid",
            "vid",
            "video_duration",
            "session_duration",
            "mode"
          ]
        },
        gen_tools: {
          endpoint: `${this.rootURL}gen_tools`,
          body: ["type"]
        },

        gen_user: {
          endpoint: `${this.rootURL}gen_user`,
          body: ["username", "password", "tel"]
        },

        gen_verification: {
          endpoint: `${this.rootURL}gen_sms_verification`,
          body: ["code", "username"]
        }
      }
    };
    this.db = new Dexie(this.indexDbStorageName);
    this.db.version(1).stores({
      keys: "++id, key", // Stores the one and only API key in this store
      lw: "vid, time", // Stores the last watched data
      vtokens: "vid, token", // stores video stream tokens (to save space in the backend)
      epstore: "vid, eobject" // caches episode objects to save server bandwidth
    });
  }

  /**
   * Creates and assigns a new API token to `this.apiToken`
   */
  assignAPIToken(userToken) {
    return new Promise((resolve, reject) => {
      if (!userToken) {
        resolve(false);
      } else {
        if (this.apiToken) {
          resolve(this.apiToken);
        } else {
          this.db.keys.get(1, res => {
            if (!res) {
              this._accessEndpoint(
                "get",
                this.apiEndpoints.get.assign.endpoint.replace(
                  this.apiEndpoints.get.assign.match[0],
                  userToken
                ),
                null,
                data => {
                  if (data["error"]) {
                    this._generateError("Could not generate valid API Token");
                    reject();
                  } else {
                    this.apiToken = data["APIToken"];
                    // cache the API Token
                    this._writeToKeyCache(this.apiToken, () => {
                      resolve(this.apiToken);
                    });
                  }
                }
              );
            } else {
              this.apiToken = res.key;
              resolve(this.apiToken);
            }
          });
        }
      }
    });
  }

  /**
   * Retrieves data for a stage
   * @param {String} stage Which stage to retrieve the data for
   * @param {Integer} page The page to which to request
   */
  getStageData(stage, page) {
    return new Promise((resolve, reject) => {
      let userToken = this.isUserLoggedIn();
      this.assignAPIToken(userToken).then(token => {
        if (token) {
          stage = stage.toLowerCase();
          // hack since im a retard
          //eslint-disable-next-line
          stage === "movies" ? (stage = "movie") : (stage = stage);
          if (!this.validStages.includes(stage.toLowerCase())) {
            this._generateError(`Stage '${stage}' is not a valid stage`);
            reject(false);
          } else {
            let stageReplace = this.apiEndpoints.get.generate.match[0];
            let pageReplace = this.apiEndpoints.get.generate.match[1];
            this._accessEndpoint(
              "get",
              this.apiEndpoints.get.generate.endpoint
                .replace(stageReplace, stage)
                .replace(pageReplace, page),
              null,
              results => {
                resolve(results);
              }
            );
          }
        } else {
          this._generateError("API Token could not be set");
        }
      });
    });
  }

  /**
   * Generates search results for a search term
   * @param {String} searchTerm The query to search
   * @param {Integer} page The numeric page to fetch
   */
  generateSearchResults(searchTerm, page) {
    return new Promise((resolve, reject) => {
      searchTerm = encodeURIComponent(searchTerm);
      page = !page ? 0 : page;
      let replacements = this.apiEndpoints.get.search.match;
      let searchEndpoint = this.apiEndpoints.get.search.endpoint
        .replace(replacements[0], searchTerm)
        .replace(replacements[1], page);

      let loggedIn = this.isUserLoggedIn();
      if (!loggedIn) {
        reject("Not logged in!");
        this._generateError(
          "User is not logged in and therefore not allowed to do that!"
        );
      } else {
        this.assignAPIToken(loggedIn).then(() => {
          // make sure a valid API-key is set
          if (!this.apiToken) {
            this._generateError(
              `No valid API Token set. GET request '${searchEndpoint}' failed!`
            );
            reject("error");
          } else {
            this._accessEndpoint("get", searchEndpoint, null, searchResults => {
              // filter the search results to get rid of duplicate shows
              let filteredSearchResults = [];
              let keys = [];
              for (let k in searchResults) {
                if (!keys.includes(searchResults[k]["imdbid"])) {
                  filteredSearchResults.push(searchResults[k]);
                  keys.push(searchResults[k]["imdbid"]);
                }
              }
              resolve(filteredSearchResults);
            });
          }
        });
      }
    });
  }

  /**
   * Gets the last watched vid given a ShowID, returns false if there is no last watched
   * @param {String} showid The showid to check
   */
  generateLastWatched(showid) {
    return new Promise((resolve, reject) => {
      let lastWatchedEndpoint =
        this.rootURL +
        `api/generate?stage=episodes&id=${showid}&lastwatched=true`;
      this._accessEndpoint("get", lastWatchedEndpoint, null, results => {
        resolve(results);
      });
    });
  }

  /**
   * Returns a list of episodes from a given showid
   * @param {String} showid The showid to list the episodes from
   * @TODO - Add cache mechanism (because full episode loads are super duper slow)
   */
  listEpisodes(showid) {
    return new Promise((resolve, reject) => {
      let episodeEndpoint =
        this.rootURL + `api/generate?stage=episodes&id=${showid}`;

      this._accessEndpoint("get", episodeEndpoint, null, episodes => {
        resolve(episodes);
      });
    });
  }

  /**
   * Sends a request to generate media metadata
   * @param {String} mediaTerm the media term to which to send
   * @param {Boolean} enableTorrents If true, torrent results are also shown
   */
  generateDiscovery(mediaTerm, enableTorrents) {
    return new Promise((resolve, reject) => {
      if (!this.apiToken) reject("Error No Token");
      let match = this.apiEndpoints.get.discover.match;
      let discoverEndpoint = this.apiEndpoints.get.discover.endpoint
        .replace(match[0], mediaTerm)
        .replace(match[1], enableTorrents);

      this._accessEndpoint("get", discoverEndpoint, null, discoverResults => {
        resolve(discoverResults);
      });
    });
  }

  /**
   * Tries to log in a user. If the log in is successful a verification token is returned to the user
   * @param {String} nickname The users nickname
   * @param {String} password The users password
   */
  tryLogin(nickname, password, callback) {
    let loginEndpoint = this.apiEndpoints.post.gen_login.endpoint;
    let constructParams = { nick: nickname, pass: password };
    this._accessEndpoint("post", loginEndpoint, constructParams, results => {
      callback(results);
    });
  }

  /**
   * Tries to create a new user account user the registration
   * post endpoint. Takes SMS verification into account as well
   * *NOTE* The response for this string is an array with the first
   * index of the array being either 0 for no SMS verification required
   * or 1 for sms verification and the second index being the users userid
   * @param {String} nickname The nickname of the user
   * @param {String} password The selected user password
   * @param {String} number The users telephone number used for SMS verification
   */
  registerAccount(nickname, password, betacode, number) {
    return new Promise((resolve, reject) => {
      let registrationEndpoint = this.apiEndpoints.post.gen_user.endpoint;
      let payload = {
        username: nickname,
        password: password,
        tel: number,
        betacode: betacode
      };
      // send the payload to the endpoint
      this._accessEndpoint(
        "post",
        registrationEndpoint,
        payload,
        registrationResults => {
          if (Object.keys(registrationResults).includes("error")) {
            // cast the error out
            reject(registrationResults);
          } else {
            // check to see if sms verification is required
            if (Object.keys(registrationResults).includes("scope")) {
              // sms verification is required
              resolve([1, registrationResults["uid"]]);
            } else {
              resolve([0, registrationResults["uid"]]);
            }
          }
        }
      );
    });
  }

  /**
   * Verifies and validates an sms code
   * @param {String} code The sms code to verify
   * @param {String} uid The users UserID
   */
  validateSMSCode(code, uid, callback) {
    let validationEndpoint = this.apiEndpoints.post.gen_verification.endpoint;
    let payload = {
      verification: code,
      uid: uid
    };
    this._accessEndpoint("post", validationEndpoint, payload, results => {
      if (Object.keys(results).includes("error")) {
        callback(false);
      } else {
        callback(true);
      }
    });
  }

  /**
   * Checks to see whether or not the user is logged in.
   * Returns false if there is no cookie and the value of the user token if there is
   */
  isUserLoggedIn() {
    let cookieRegex = new RegExp("(^| )" + this.userCookieValue + "=([^;]+)");
    let match = document.cookie.match(cookieRegex);
    return match ? match[2] : false;
  }

  /**
   * Generates a new stream/user token depending on the type
   * @param {String} type Either `user` for a user token or `stream` for a stream token
   * @param {Object} tokenObject the parameters needed to instantiate the token. For example, to
   * instantiate a user token, the tokenObject would be:
   * {
   *  uid : 'userid',
   *  vtoken : 'verification_token_value`
   * }
   */
  generateNewToken(type, tokenObject) {
    return new Promise((resolve, reject) => {
      let body = this.apiEndpoints.post.gen_token.body;
      if (
        type.toLowerCase() === "user" &&
        Object.keys(tokenObject).includes(body[2]) &&
        Object.keys(tokenObject).includes(body[3])
      ) {
        // generate user token
        let bodyParams = {
          type: "user",
          uid: tokenObject["uid"],
          vtoken: tokenObject["vtoken"]
        };

        this._accessEndpoint(
          "post",
          this.apiEndpoints.post.gen_token.endpoint,
          bodyParams,
          results => {
            resolve(results);
          }
        );
      } else if (
        type.toLowerCase() === "stream" &&
        Object.keys(tokenObject).includes(body[1])
      ) {
        // generate stream token
        this._accessEndpoint(
          "post",
          this.apiEndpoints.post.gen_token.endpoint,
          { type: "stream", vid: tokenObject["vid"] },
          results => {
            resolve(results);
          }
        );
      } else {
        this._generateError(
          "Token Object mismatch. Please check that you're calling to correct body parameters."
        );
        reject();
      }
    });
  }

  /**
   * Returns a pre-formatted stream URL
   * @param {String} vid The video id of the file
   * @param {*} streamToken The stream token for the vid
   */
  createStreamURL(vid, streamToken) {
    return this.rootURL + `api/stream.m3u8?vid=${vid}&sid=${streamToken}`;
  }

  /**
   * Manually sets the `oms-api-token` header token
   * @param {String} token The token to set
   * @deprecated Use `assignAPIToken()` to automatically assign instead
   */
  setToken(token) {
    this.apiToken = token;
  }

  /**
   * Returns the API Token
   */
  getToken() {
    return this.apiToken;
  }

  /**
   * Returns the stream token if it exists or false if it does not exist
   * @param {String} vid The vid to get the stream token for
   */
  getStreamToken(vid, callback) {
    this.db.vtokens.get(vid, results => {
      results ? callback(results.token) : callback(false);
    });
  }
  /**
   * Assigns a stream token to a vid
   * @param {String} vid The videoID to set the token for
   * @param {String} token the stream token
   */
  setStreamToken(vid, token, callback) {
    this.db.vtokens.add({ vid: vid, token: token });
    callback(true);
  }

  /**
   *
   * @param {String} vid The vid to get the time for
   * @param {*} callback
   */
  getTime(vid, callback) {
    this._getFromVidCache(vid, getResults => {
      getResults ? callback(getResults.time) : callback(false);
    });
  }
  /**
   * Sets a vid's current time
   * @param {String} vid The videoID to set for
   * @param {Integer} time The time to get
   */
  setTime(vid, time, callback) {
    this._getFromVidCache(vid, getResults => {
      if (!getResults) {
        this._writeToVidCache(vid, time, res => {
          callback(res);
        });
      } else {
        // modify the existing time
        this._modifyVidCache(vid, time, res => {
          callback(res);
        });
      }
    });
  }
  /**
   * Private function for accessing the API Endpoints
   * @param {String} type Either `post` for the post endpoints or `get` for the get endpoints
   * @param {String} endpoint The Endpoint to access (assumes all params were matched and parsed)
   * @param {String} postData The POST data to send to the URL (null for GET requests) (formatted as POST data)
   */
  _accessEndpoint(type, endpoint, postData, callback) {
    let xml = new XMLHttpRequest();
    xml.onreadystatechange = () => {
      if (xml.readyState === 4 && xml.status === 200) {
        callback(JSON.parse(xml.responseText));
      }
    };
    if (type.toLowerCase() === "get") {
      xml.open("GET", endpoint);
      // set the xml Client token
      xml.setRequestHeader("oms-api-token", this.apiToken);
      xml.send();
    }
    if (type.toLowerCase() === "post") {
      xml.open("POST", endpoint);
      xml.setRequestHeader("oms-api-token", this.apiToken);
      xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

      xml.send(this._formatPostData(postData));
    }
  }

  /**
   * Prints errors to the console
   */
  _generateError(errorMessage) {
    console.log(`%c [OMS-Error] ${errorMessage}`, "color: #e74c3c");
  }

  /**
   * Generates a status message and prints it to the consol
   */
  _generateStatus(statusMessage) {
    console.log(`%c [OMS-Status] ${statusMessage}`, "color: #2ecc71");
  }

  /**
   * Sends a Heartbeat Pulse to the server
   * @param {HeartBeatObject} HeartBeatObject The Object which to send to the server
   * HeartbeatObject{
   *    user_agent,
   *    ip,
   *    page,
   *    sid,
   *    vid,
   *    video_duration,
   *    session_duration
   * }
   * The object could be all of those parameters or it could be just the ones being updated
   * @param {String} mode either `create` to create a new heartbeat or `update` to update one
   */
  _pulse(HeartBeatObject, mode, callback) {
    let heartbeatEndpoint = this.apiEndpoints.post.gen_stat.endpoint;
    if (
      mode.toLowerCase() === "create" &&
      Object.keys(HeartBeatObject).length === 7
    ) {
      HeartBeatObject["mode"] = "create";
      this._accessEndpoint(
        "post",
        heartbeatEndpoint,
        HeartBeatObject,
        results => {
          callback(results);
        }
      );
    }
    if (mode.toLowerCase() === "update") {
      HeartBeatObject["mode"] = "update";
      this._accessEndpoint(
        "post",
        heartbeatEndpoint,
        HeartBeatObject,
        results => {
          callback(results);
        }
      );
    } else {
      callback(false);
    }
  }

  /**
   * Writes a data entry to the local key storage cache
   * @param {String} key The identifier key to which to write to the cache
   * @param {*} data Data to write to the cache
   */
  _writeToKeyCache(data, callback) {
    this.db.keys.add({
      key: data
    });
    callback(true);
  }

  _writeToVidCache(vid, time, callback) {
    this.db.lw.add({ vid: vid, time: time });
    callback(true);
  }

  _modifyVidCache(vid, newTime, callback) {
    this.db.lw
      .where("vid")
      .equals(vid)
      .modify({ time: newTime });
    callback(true);
  }

  /**
   * Caches an Episode Data Object
   * @param {String} vid The video object of the episode to add
   * @param {EpisodeDataObject} EpisodeData The episode data object to cache
   */
  addEpisodeObject(vid, EpisodeData, callback) {
    this.db.epstore.add({
      vid: vid,
      eobject: EpisodeData
    });
    callback(true);
  }

  /**
   * Gets a shows episode data provided the shows Vid
   * @param {String} key The videoID to retrieve the episode data for
   */

  getEpisodeObject(showid, callback) {
    this.db.epstore.get(showid, res => {
      callback(res);
    });
  }
  /**
   * Retrieves a lastwatched
   * @param {String} key The videoID to retrieve the time for
   */
  _getFromVidCache(key, callback) {
    this.db.lw.get(key, res => {
      callback(res);
    });
  }
  /**
   * Returns a formatted version of the data that is inline with the POST requirements
   * @param {Object} postData Postdata to format
   */
  _formatPostData(postData) {
    let append = "";
    for (let k in Object.keys(postData)) {
      let key = Object.keys(postData)[k];
      append += `${key}=${postData[key]}&`;
    }
    append = append.substring(0, append.length - 1);
    return append;
  }
}
export default AJAXHandler;
