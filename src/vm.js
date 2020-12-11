window.NodeVM2 ? "" : window.NodeVM2 = new nodeVM2();
if (typeof module === 'object') {
    window.jQuery = window.$ = module.exports;
};
function nodeVM2() {
    let that = this;
    const {
        NodeVM,
        VMScript
    } = require('vm2');
    let newConsole = {};
    let logString = [];
    let apt = {};
    let _request = {};
    this.vmRun = function (js, globalList, catalogList, envList, headers,response={},testResultList=[]) {
        logString = [];
        _request = {
            url: '',
            method: '',
            timeout: 0,
            contentType: '',
            request_bodys: {},
            request_headers: {}
        };
        NewConsoleInit(newConsole, logString);
        AptInit(apt, globalList, catalogList, envList, headers,testResultList,response);
        console.log(apt);
        const vm = new NodeVM({
            sandbox: {
                console: newConsole,
                apt,
                request: _request,
                response: response,
                $:$
            }
        })
        let script = new VMScript(js);

        try {
            vm.run(script)
            return logString;
        } catch (error) {
            return error.toString();
        }
    }
}

function NewConsoleInit(newConsole, logString) {
    newConsole.log = function (value) {
        if (typeof value === "object") {
            value = JSON.stringify(value);
        } else if (typeof value === "function") {
            value = "[Function]";
        }
        logString.push({
            type: "log",
            value: value,
            date: new Date().getTime()
        });
    }
    newConsole.warn = function (value) {
        if (typeof value === "object") {
            value = JSON.stringify(value);
        } else if (typeof value === "function") {
            value = "[Function]";
        }
        logString.push({
            type: "warn",
            value: value,
            date: new Date().getTime()
        });
    }
    newConsole.info = function (value) {
        if (typeof value === "object") {
            value = JSON.stringify(value);
        } else if (typeof value === "function") {
            value = "[Function]";
        }
        logString.push({
            type: "info",
            value: value,
            date: new Date().getTime()
        });
    }
    newConsole.error = function (value) {
        if (typeof value === "object") {
            value = JSON.stringify(value);
        } else if (typeof value === "function") {
            value = "[Function]";
        }
        logString.push({
            type: "error",
            value: value,
            date: new Date().getTime()
        });
    }
}

function AptInit(apt, globalList, catalogList, envList, headers,testResultList,response) {
    //全局变量
    apt.globals = {};
    /**
     * 全局变量赋值
     */
    apt.globals.set = function (_var, _val) {
        if (globalList[_var]) {
            globalList[_var].value = _val;
        } else {
            globalList[_var] = {
                type: "1",
                description: "",
                value: _val
            }
        }
    }

    /**
     * 获取一个全局变量
     */
    apt.globals.get = function (_var) {
        return typeof globalList[_var] != 'undefined' ? globalList[_var].value : '';
    }

    /**
     * 删除一个全局变量
     */
    apt.globals.delete = function (_var) {
        if (typeof globalList[_var] != 'undefined') {
            delete globalList[_var];
        }

        return true;
    }

    /**
     * 清空全局变量
     */
    apt.globals.clear = function () {
        globalList = {};
        return true;
    }

    //环境变量
    apt.variables = {};

    /**
     * 环境变量赋值
     */
    apt.variables.set = function (_var, _val) {
        if (envList[_var]) {
            envList[_var].value = _val;
        } else {
            envList[_var] = {
                type: 1,
                value: _val,
                description: ""
            }
        }
    }

    /**
     * 获取一个环境变量
     * @returns {apt}
     */
    apt.variables.get = function (_var) {
        return typeof envList[_var] != 'undefined' ? envList[_var].value : '';
    }

    /**
     * 删除一个环境变量
     * @returns {apt}
     */
    apt.variables.delete = function (_var) {
        if (typeof envList[_var] != 'undefined') {
            delete envList[_var];
        }
        return true;
    }

    /**
     * 清空环境变量
     * @returns {apt}
     */
    apt.variables.clear = function () {
        envList = {};

        return true;
    }

    //发送请求
    /**
     * 发送请求
     */
    apt.sendRequest = function(_xhr, _success, _error){
        if(!xhr){
            if(typeof _xhr != 'object'){
                _xhr = {
                    url : _xhr,
                    method : "GET"
                }
            }

            _xhr.async = false; // 同步请求
            _xhr.beforeSend = function () {};
            _xhr.complate = function () {};

            if(typeof _error == 'function'){
                _xhr.error = _error;
            }else{
                _xhr.error = function () {};
            }

            if(typeof _success == 'function'){
                _xhr.success = _success;
            }else{
                _xhr.success = function () {};
            }

            $.ajax(_xhr);
        }
    }

    //断言测试
    /**
     * 断言测试
     */
    apt.assert = function (_exp) {
        let _res = false;

        try {
            _res = eval(_exp);
        } catch (e) {
            _res = false;
        };
        testResultList.push({
            "exp" : _exp,
            "result" : _res
        })
        return _res;
    }

    /**
     * 赋值
     * @returns {apt}
     */
    apt.setRequestHeader = function (_var, _val) {
        if (typeof _var == 'string') {
            _var = $.trim(_var);
            _val = _val + '';
            headers[_var] = _val;
        }
    }

    /**
     * xml转json
     * v3.2.3
     */
    apt.xml2json = function (_xml_str) {
        var X2JS = require("x2js");
        let x2js = new X2JS();
        let json = x2js.xml2js(_xml_str);
        return JSON.parse(json);
    }

}