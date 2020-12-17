var request = require("request");
var requestApi = new apiAll();
var fs = require("fs");
// var iconv = require('iconv-lite');

function apiAll() {
  let that = this;

  this.nowApiRequest = "";

  this.apiSend = function (
    url,
    method = "GET",
    params,
    headers = {},
    gvalBody,
    timeOut,
    cookies
  ) {
    try {
      //#region 对params做处理
      if (params instanceof Array) {
        let tempParams = {};
        if (gvalBody.length > 0) {
          for (let index = 0; index < gvalBody.length; index++) {
            if (gvalBody[index].key.length > 0 && gvalBody[index].is_checked == "1") {
              if (gvalBody[index].type == "File") {
                let arr = [];
                if (gvalBody[index].value.length > 0) {

                  gvalBody[index].value.forEach((item) => {
                    arr.push(fs.createReadStream(item));
                  });
                  tempParams[gvalBody[index].key] = arr;
                }
              } else {
                tempParams[gvalBody[index].key] = gvalBody[index].value;
              }
            }
          }
        }
        if (params instanceof Array) {
          for (let index = 0; index < params.length; index++) {
            if (params[index].key.length > 0 && params[index].is_checked == "1") {
              if (params[index].type == "File") {
                let arr = [];
                if (params[index].value.length > 0) {

                  params[index].value.forEach((item) => {
                    arr.push(fs.createReadStream(item));
                  });
                  tempParams[params[index].key] = arr;
                }
              } else {
                tempParams[params[index].key] = params[index].value;
              }
            }
          }
        }
        params = tempParams;
      }

      console.log(params);
      //#endregion

      var j = request.jar();
      // if (cookies != "") {
      //   j.setCookie(cookies, url)
      // }
      //#region 根据contentType在发送请求时如何传参
      var obj = {
        url: url,
        method: method,
        headers: headers,
        encoding: null,
        request: true,
        jar: j,
        timeout: timeOut,
        //json:params
      };
      console.log(headers["Accept-Encoding"]);
      if (headers["Accept-Encoding"] != undefined) {
        obj["gzip"] = true;
      }
      if (headers["content-type"] != undefined) {
        let contentType = headers["content-type"];
        switch (contentType) {
          case "none":
            break;
          case "application/x-www-form-urlencoded":
            obj["form"] = params
            break;
          case "multipart/form-data":
            obj["formData"] = params
            break;
          default:
            obj["body"] = params
            break;
        }
      }

      //#endregion
      //对url做解码
      obj.url = encodeURI(obj.url);
      obj.url = obj.url.replace(/\%25/ig, "\%");
      console.log(obj.url);
    } catch (error) {
      console.log(error);
    }
   
    return new Promise((resolve, reject) => {
      console.log(obj);
      try {
        that.nowApiRequest = request(obj, (error, response, body) => {
          //判断是否请求成功
          if (!error && response.statusCode) {
            response.responseCookies = j.getCookies(obj.url);
            response.cookies = j.getCookieString(obj.url);
            // response.body = iconv.decode(response.body, 'gb2312').toString('utf-8');
            response.body = response.body.toString('utf-8');
            console.log(response, body);
            resolve(response);
          } else if (error) {
            console.log(error);
            reject(error);
          }
        }); //.mode="no-cors";//跨域问题
      } catch (err) {
        reject(err);
      }
    });
  }

  this.stopSend = function () {
    if (that.nowApiRequest != "") {
      that.nowApiRequest.abort();
    }
  }

}