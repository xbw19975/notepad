window.mainMethod ? "" : window.mainMethod = new MainMethod();

function MainMethod() {
    let that = this;
    const localForage = require('localforage');
    const {
        ulid
    } = require('ulid');
    this.ulid = function(){
        return ulid();
    };
    const store = localForage.createInstance({
        name: "store"
    });
    const historyStore = localForage.createInstance({
        name: "historyStore"
    });
    this.tabList = function (tabParent, tabSon, tabBody) {
        $(tabParent).on("click", tabSon, function () {
            if (tabParent == ".nowInterface") {
                that.renderPage($(this).attr("data_id"));
            }
            $(this).addClass("current").siblings().removeClass("current");
            if (tabBody)
                $(tabBody).eq($(this).index()).addClass("current").siblings().removeClass("current")
        })
    }
    this.deleteParent = function (table, self) {
        $(table).on("click", self, function (event) {
            event.stopPropagation()
            let id = '';
            if ($(this).parent().prev()) {
                $(this).parent().prev().addClass("current").siblings().removeClass("current");
                id = $(this).parent().prev().attr("data_id");
            } else {
                $(this).parent().next().addClass("current").siblings().removeClass("current");
                id = $(this).parent().next().attr("data_id");
            }
            $(this).parent().remove();
            that.renderPage(id);
        })
    }
    this.saveInterface = function (id) {
        if (!id) {
            id = ulid();
        }
        let body_parameter = [];
        if ($("#paramsTable li").length > 1) {
            let arr = [];
            $("#paramsTable input").each(function () {
                arr.push($(this).val());
            });
            for (let i = 0; i < arr.length; i = i + 2) {
                body_parameter.push({
                    key: arr[i],
                    value: arr[i + 1],
                });
            }
        }
        let api = {
            target_id: id,
            //"parent_id":"1000732",
            //project_id: "3223",
            //"mark": "developing",
            //"target_type": "api",
            name: $(".nowInterface .current").text(),
            method: $("#requestType").find("option:selected").text(),
            //"sort": "0",
            //"type_sort": "1",
            //"update_day": "1587657600",
            //"update_dtime": "1587713977",
            request: {
                url: $(".input_url").val(),
                body: {
                    parameter: body_parameter
                },
                header: {
                    parameter: [{
                        key: "",
                        value: "",
                    }]
                }
            },
            response: {
                success: {
                    header_raw: header_editor.getValue(),
                    raw: response_editor.getValue()
                },
                error: {
                    raw: ""
                }
            }
        };
        //localforage数据储存
        //主要数据存储
        store.setItem(id, api).then(function () {
            alert("保存成功")
        });
    }
    this.renderPage = function (id) {
        store.getItem(id).then(
            function (value) {
                if (value) {
                    $(".input_url").val(value.request.url);
                    $("#requestType").val(value.method);
                    header_editor.setValue(value.response.success.header_raw);
                    response_editor.setValue(value.response.success.raw);
                    if (!$.isEmptyObject(value.response.success.raw)) {
                        loadTemplate(JSON.parse(value.response.success.raw))
                    }
                    if (value.request.body.parameter.length > 0) {
                        let paramsTable = document.getElementById("paramsTable");
                        value.request.body.parameter.forEach((item, index) => {
                            let li = document.createElement("li");
                            li.innerHTML =
                                `<input type='text' value=${item.key} onfocus='cls(this)'  style='color:gray;'><input type='text' value=${item.value} onfocus='cls(this)' style='color:gray;'><button>删除参数</button>`;
                            paramsTable.appendChild(li);
                        })

                    }
                } else {
                    that.defaultPage();
                }
            }
        )
    }
    this.defaultPage = function () {
        $(".input_url").val("");
        header_editor.setValue('');
        response_editor.setValue('');
        mock_editor.setValue('');
        mockdata_editor.setValue('');
        $(".container").empty();
        $("#paramsTable").empty();
        $("#paramsTable").append("<li>参数名称 参数值</li>");
    }
}