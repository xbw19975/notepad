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
    var inputUrl = document.getElementById("input_url");
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
      $(el).css("color", "black");
    }
  }
  //保存按钮
  function saveInterface() {
    mainMethod.saveInterface($(".nowInterface li[class=current]").attr("data_id"));
  }

  function init1() {
    //tab 切换
    mainMethod.tabList(".tabList", "li", ".header>div");
    mainMethod.tabList(".nowInterface", "li");
    mainMethod.tabList(".catalog", "li");
    //删除
    mainMethod.deleteParent(".nowInterface", "i");
    Mousetrap.bind(['command+t', 'ctrl+t'], () => {
      const BrowserWindow = require('electron').remote.getCurrentWebContents();
      BrowserWindow.toggleDevTools();
      return false;
    })
    $(".newInterface").on("click", function () {
      let id = mainMethod.ulid();
      $(this).before(`<li data_id='${id}'>新建接口<i>X</i></li>`);
      $(`.nowInterface li[data_id=${id}]`).addClass("current").siblings().removeClass("current")
      mainMethod.defaultPage();
    });
    let sortable1 = new sortable();
    sortable1.nowInterfaceTab();
  }
  init1();



  //数据存储 electron-store相关
  // const Store = require('electron-store');
  // const store=new Store();
  // for (let index = 0; index < array.length; index++) {
  //   const element = array[index];

  // }
  // store.set('firstStore', '🦄');
  // console.log(store.get("firstStore"));



  // otherStore.setItem("name","123123123131",function(){
  //   otherStore.getItem("name",function(err,value){
  // console.log(value);
  //  });
  // });
  // store.removeItem('name').then(function() {
  //   // 当值被移除后，此处代码运行
  //   console.log('Key is cleared!');
  // }).catch(function(err) {
  //   // 当出错时，此处代码运行
  //   console.log(err);
  // });
  // const { app, globalShortcut } = require('electron')

  // app.whenReady().then(() => {
  //   globalShortcut.register('CommandOrControl+t', () => {
  //     alert(123123)
  //     const BrowserWindow  = require('electron').remote.getCurrentWebContents();
  //     BrowserWindow.toggleDevTools();
  //   })
  // })