(function (a) {
    var c = {},
        d = a.prototype.stopCallback;
    a.prototype.stopCallback = function (e, b, a, f) {
        return this.paused ? !0 : c[a] || c[f] ? !1 : d.call(this, e, b, a)
    };
    a.prototype.bindGlobal = function (a, b, d) {
        this.bind(a, b, d);
        if (a instanceof Array)
            for (b = 0; b < a.length; b++) c[a[b]] = !0;
        else c[a] = !0
    };
    a.init()
})(Mousetrap);

Mousetrap.bindGlobal(["option+s", 'alt+s'], () => {
    $(".apipost_Send").trigger("click");
    return false;
})
Mousetrap.bindGlobal(['command+s', 'ctrl+s'], () => {
    console.log("保存接口");
    $(".apipost_Save").trigger("click");
    return false;
})
Mousetrap.bindGlobal(['command+t', 'ctrl+t'], () => {
    const BrowserWindow = require('electron').remote.getCurrentWebContents();
    BrowserWindow.toggleDevTools();
    return false;
})