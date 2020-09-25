  var showParamsChecked = document.getElementById("showParams");
  var params = document.getElementById("params");
  var sendHeader = document.getElementById("sendHeader");
  var showSendHeaderChecked = document.getElementById("showSendHeader");


  function showParams() {
    if (showParamsChecked.checked) {
      params.style.display = "block";
    } else {
      params.style.display = "none";
    }
  }

  function showSendHeader() {
    if (showSendHeaderChecked.checked) {
      sendHeader.style.display = "block";
    } else {
      sendHeader.style.display = "none";
    }
  }

  function sendRequest() {
    var requestType = document.getElementById("requestType");
    var index = requestType.selectedIndex;
    var type = requestType.options[index].value;
    var inputUrl = document.getElementById("input_1");
    var url = inputUrl.value;
    let arr = [];
    let arr1 = [];
    let data = {};
    let headers = {};
    $("#paramsTable input").each(function () {
      arr.push($(this).val());
    });
    for (let i = 0; i < arr.length; i = i + 2) {
      data[arr[i]] = arr[i + 1];
    }
    $("#paramsHeader input").each(function () {
      arr1.push($(this).val());
    });
    for (let i = 0; i < arr1.length; i = i + 2) {
      headers[arr1[i]] = arr1[i + 1];
    }
    var callback = new Function();
    ajax(type, url, data, headers);
  }

  function addParams() {
    var paramsTable = document.getElementById("paramsTable");
    var li = document.createElement("li");
    li.innerHTML =
      "<input type='text' value='参数名称' onfocus='cls(this)'  style='color:gray;'><input type='text' value='参数数值' onfocus='cls(this)' style='color:gray;'><button>删除参数</button>";
    paramsTable.appendChild(li);
  }

  function addHeader() {
    var paramsTable = document.getElementById("paramsHeader");
    var li = document.createElement("li");
    li.innerHTML =
      "<input type='text' value='参数名称' onfocus='cls(this)' style='color:gray;'><input type='text' value='参数数值' onfocus='cls(this)' style='color:gray;'><button>删除参数</button>";
    paramsTable.appendChild(li);
  }
  function cls(el) {
    if ($(el).val().includes('参数')) {
      $(el).val('');
      $(el).css("color","black");
    }
  }
  //保存按钮
  function saveInterface(){

  }
  //tab 切换
  mainMethod.tabList(".tabList li",".header>div");
  mainMethod.tabList(".nowInterface li");
  mainMethod.tabList(".catalog li");
  Mousetrap.bind(['command+t', 'ctrl+t'],()=>{
    const BrowserWindow  = require('electron').remote.getCurrentWebContents();
    BrowserWindow.toggleDevTools();
    return false
  })

// const { app, globalShortcut } = require('electron')

// app.whenReady().then(() => {
//   globalShortcut.register('CommandOrControl+t', () => {
//     alert(123123)
//     const BrowserWindow  = require('electron').remote.getCurrentWebContents();
//     BrowserWindow.toggleDevTools();
//   })
// })
 
    
  
  