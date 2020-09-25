"use strict"
var header_editor = ace.edit("header_editor");
var response_editor = ace.edit("response_editor");
var mock_editor = ace.edit("mock_editor");
var mockdata_editor = ace.edit("mockdata_editor");

function loadTemplate(data) {
    //需要渲染的模板数组
    var templateData = [];
    //生成模板需要渲染的数据
    templateData = creatTemplateData(data, templateData);
    //下拉选项的数组
    template.defaults.imports.types = [
        "number",
        "string",
        "boolean",
        "object",
        "array",
        "null"
    ];
    //下一层产生的html代码
    template.defaults.imports.nextHtml = "";
    let array = templateData;
    //取出最大层级
    let maxLevel = Math.max.apply(Math, array.map(function (o) {
        return o.level
    }));

    let arrayList = [];
    //循环层级 从1开始
    for (let i = maxLevel; i > 0; i--) {
        var arryi = array.filter(function (o) {
            return o.level == i;
        });
        arrayList.push(arryi);
    }
    var html = "";
    arrayList.forEach(item => {
        //创建父模板
        html = template("tpl_parent", {
            data: item
        });
        template.defaults.imports.nextHtml = html;
    });
    //模板生成的html插入实际页面div中
    $("#container").html(html);
    //给页面添加拖动功能
    let sortable1 = new sortable();
    sortable1.listSortTable();
    //初始化
    ready();
    //对象属性代理
    const proxyData = new Proxy(templateData, {
        get(obj, index) {
            return obj[index];
        },
        set: function (target, key, value) {
            try {
                value.value = JSON.parse(value.value)
            } catch (error) {

            } finally {
                target[key] = value;
                bind.mouckData();
            }
            return true;
        }
    })
    //数据绑定
    let bind = new dataBind(proxyData);
}
//数据双向绑定
function dataBind(proxyData) {
    //对象属性代理
    this.data = proxyData;
    this.init = function () {
        let that = this;
        this.proxy();
        this.mouckData();
    }
    this.proxy = function () {
        let that = this;
        $('#container input').each(function (index, item) {
            let name = $(item).attr('v-model');
            //输入框发生改变事件
            $(this).on("input", function () {
                let selfId = $(this).parent().parent().attr("selfId");
                that.data.forEach((item, index, arry) => {
                    if (item.id == selfId) {
                        item[name] = $(this).val();
                        arry[index] = item;
                    }
                })
            })
        })
    }
    //页面绑定
    this.proxyDom = function () {

    }


    //生成mock格式 并渲染到页面中
    this.mouckData = function () {
        let that = this;
        let array = that.data;
        //取出最大层级
        let maxLevel = Math.max.apply(Math, array.map(function (o) {
            return o.level
        }));

        let arrayList = [];
        //循环层级 从1开始
        for (let i = maxLevel; i > 0; i--) {
            var arryi = array.filter(function (o) {
                return o.level == i;
            });
            arrayList.push(arryi);
        }
        arrayList = arrayList.map(function (item) {
            return that.setMap(item)
        })
        let exj = /^\d+$/;
        for (let ii = 0; ii < arrayList.length - 1; ii++) {
            Object.keys(arrayList[ii + 1]).forEach(item => {
                let items = item.split('|');
                let temp = "";
                if (item.includes("|")) {
                    if (items[1].toLowerCase() == "object") {
                        delete arrayList[ii + 1][item];
                        items[2] > 1 ? temp = items[0] + "|" + items[2] : temp = items[0];
                        arrayList[ii + 1][temp] = arrayList[ii]
                    } else if (items[1].toLowerCase() == "array" && exj.test(items[2])) {
                        delete arrayList[ii + 1][item];
                        items[2] > 1 ? temp = items[0] + "|" + items[2] : temp = items[0];
                        arrayList[ii + 1][temp] = [arrayList[ii]];
                    }
                }
            })
        }
        //渲染响应模板
        let mockString = JSON.stringify([...arrayList].pop(), null, '\t');
        setEditor(mock_editor, mockString);
        //渲染响应数据
        let mockString_1 = JSON.stringify(Mock.mock([...arrayList].pop()), null, '\t')
        setEditor(mockdata_editor, mockString_1);
    }
    this.setMap = function (list) {
        let exj = /^\d+$/;
        let mockData = {}
        list.map(item => {
            if (exj.test(item.rule) || item.type.toLowerCase() == "array" || item.type.toLowerCase() == "object") {
                if (exj.test(item.rule)) {
                    item.rule ? mockData[item.name + "|" + item.type + "|" + item.rule] = item.value : mockData[item.name] = item.value;
                } else {
                    item.rule ? mockData[item.name + "|" + item.rule] = item.value : mockData[item.name] = item.value;
                }
            } else {
                item.value == null ? mockData[item.name] = "null" : mockData[item.name] = item.value;;
            }
        })
        return mockData;
    }
    this.init();
}

function arrTemplate() {
    this.name = ""; //模板行名称
    this.type = ""; //模板行值类型
    this.value = ""; //模板行初始值
    this.level = 0; //模板行层级
    this.rule = ""; //模板行生成规则
    this.nextLevel = false; //是否有子集
    this.id = 1;
    this.parentId = 0;
}
//传入对象递归
function creatTemplateData(data, templateData, level = 0, id = 1, parentId = 0) {
    //递归后层级+1
    level++
    //遍历最外层json数据对象
    $.each(data, function (index, item) {
        //插入模板数组的格式对象
        var _arr = new arrTemplate();
        _arr.level = level;
        item == null ? _arr.type = "null" : _arr.type = $.type(item);
        _arr.name = index;
        _arr.value = item;
        _arr.id = id;
        _arr.parentId = parentId;

        //判断对象的值为object或者数组时
        if ($.isPlainObject(item) || Array.isArray(item)) {
            //当对象的值为数组时
            if (Array.isArray(item)) {
                templateData = arrayRecursion(index, item, templateData, level, id, _arr.parentId)
            } else {
                _arr.nextLevel = true;
                _arr.value = "";
                _arr.rule = 1;
                templateData = templateData.concat(_arr);
                id++;
                //当对象的值为object
                templateData = creatTemplateData(item, templateData, level, id, _arr.parentId)
            };
        } else {
            id++;
            //对象的值既不为object也不为数组
            templateData = templateData.concat(_arr);
        }
    });
    return templateData;
}
//数组递归
function arrayRecursion(arrayName, array, templateData, level, id = 1, parentId = 0) {
    var arr = {};
    //数组模板
    let _arr = new arrTemplate();
    //模板数组添加当前数组行 
    _arr.name = arrayName;
    _arr.value = "[]";
    _arr.rule = array.length;
    _arr.level = level;
    _arr.type = "Array";
    _arr.nextLevel = true;
    _arr.id = id;
    _arr.parentId = parentId;
    templateData = templateData.concat(_arr);
    id++;
    //递归后层级+1
    level++;
    if (array.length == 1) {
        templateData = creatTemplateData(array[0], templateData, _arr.level, id, _arr.id);
    } else {
        //遍历数组 模板数组添加数组里内容所有行
        $.each(array, function (index_1, item_1) {
            if (!$.isPlainObject(item_1)) {
                _arr.value = array;
                _arr.rule="";
                return false;
            } else {
                //遍历数组里的对象
                $.each(item_1, function (i, val) {
                    if (Array.isArray(val) || $.isPlainObject(val)) {
                        if ($.isPlainObject(val)) {
                            //对象继续递归
                            templateData = creatTemplateData(val, templateData, level, id, _arr.id);
                        }
                    } else {
                        if (typeof (arr[i]) == "undefined") {
                            //未累加 值
                            let value = [val]
                            arr[i] = value;
                        } else {
                            //已经累加 值 
                            arr[i] = arraySetAdd(arr[i], val)
                        }
                    }
                })
            }
        });
        if (!$.isEmptyObject(arr)) {
            $.each(arr, function (i1, val2) {
                let _arr1 = new arrTemplate();
                _arr1.name = i1;
                _arr1.level = level;
                _arr1.id = id;
                _arr1.parentId = _arr.id;
                id++;
                if (val2.length > 1) {
                    _arr1.type = $.type(val2);
                    _arr1.rule = "+1";
                    _arr1.value = val2;
                } else {
                    _arr1.type = $.type(val2[0]);
                    _arr1.value = val2[0];
                }
                templateData = templateData.concat(_arr1);
            });
        }
        if ($.isPlainObject(array[0])) {
            $.each(array[0], function (i, val) {
                if (Array.isArray(val)) {
                    //数组拼接+递归
                    templateData = arrayRecursion(i, val, templateData, level, id, _arr.id)
                }
            });
        }

    }
    return templateData;
}
//初始化
function init() {
    //添加缩进
    $("#table #nameTd").each(function () {
        let paddingleft = ($(this).attr("level") - 1) * 20;
        $(this).css("paddingLeft", paddingleft + "px");
    });
    $("#table tr").each(function () {

        let level = $(this).attr("level");
        let type = $(this).attr("dataType");
        if (type && (type.toLowerCase() == "object" || type.toLowerCase() == "array")) {
            $(this).find(".add").show();
            if ($(this).next().attr("level") > level) {
                $(this).find(".out").show();
            } else {
                $(this).find(".out").hide();
            }
        } else {
            $(this).find(".add").hide();
            $(this).find(".out").hide();
        }
    });
}

function ready() {
    //隐藏下级元素和添加层级渐变色
    $("#table tr").each(function () {
        let level = $(this).attr("level");
        if (level > 1) {
            $(this).hide();
        }
        $(this).css("background", "rgba(0,0,255," + (level * 4) / 100 + ")");
    });
    //委托类型下拉列表option改变事件
    $("#container").on("change", "#select", function (index, item) {
            let tr = $(this).parent().parent();
            let tdDom = $(this).parent().prev().prev();
            tr.attr("dataType", $(this).val());
            init();
        }) //委托添加按钮点击事件;
        .on("click", " .add", function () {
            let option = "";
            $(template.defaults.imports.types).each(function (index, item) {
                option += "<option>" + item + "</option>";
            });
            let select = "<select id='select'>" + option + "</select>";
            let level = parseInt($(this).parent().parent().attr("level")) + 1;

            let tr =
                "<tr id='row' level=" +
                level +
                " dataType='number' style='background:rgba(0,0,255,0.5)'><td><button class='delete'>删除</button></td><td id='nameTd' level=" +
                level +
                "><input type='text'></td><td>" +
                select +
                "</td><td><input type='text'></td><td><input type='text'></td><td>" +
                level +
                "</td></tr>";
            $(this).parent().parent().after(tr);
            init();
        }) //委托展开按钮点击事件;
        .on("click", ".out", function () {
            let level = parseInt($(this).parent().parent().attr("level")) + 1;
            let number = 0;
            let a = "tr[level = " + level + "]";
            if ($(this).text() == ">") {
                $(this).text("^");
                $("#table").find(a).hide();
                while (true) {
                    if (number > 100) {
                        break;
                    } else {
                        a = "tr[level = " + level + "]";
                        if ($("#table").find(a).length <= 0) {
                            break;
                        }
                        $("#table")
                            .find(a)
                            .each(function () {
                                if ($(this).find(".out").length > 0) {
                                    $(this).find(".out").text("^");
                                }
                            });
                        $("#table").find(a).hide();
                    }
                    number += 1;
                    level++;
                }
            } else {
                $(this).text(">");
                $("#table").find(a).show();
            }
        }) //委托删除按钮点击事件;
        .on("click", " .delete", function () {
            let tr = $(this).parent().parent();
            let level = parseInt(tr.attr("level"));
            let dataType = tr.attr("dataType");
            $(this).parent().parent().remove();
            if (dataType.toLowerCase() == "object" || dataType.toLowerCase() == "array") {
                let number = 0;
                while (true) {
                    level++;
                    if (number > 100) {
                        break;
                    } else {
                        let a = "tr[level = " + level + "]";
                        if ($("#table").find(a).length <= 0) {
                            break;
                        }
                        $("#table").find(a).remove();
                    }
                    number++;
                }
            }
            init();
        })
    //初始化
    init();
}
//数组添加元素去重，并放回新的数组
function arraySetAdd(arr, addData) {
    let set = new Set(arr);
    set.add(addData);
    return Array.from(set);
}

function setEditor(editor, data) {
    editor.setValue(data);
}