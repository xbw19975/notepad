window.mainMethod ? "" : window.mainMethod = new MainMethod();

function MainMethod() {
    let that = this;

    this.tabList = function (tabHeader,tabBody) {
        $(tabHeader).on("click", function () {
            $(this).addClass("current").siblings().removeClass("current");
            if(tabBody)
            $(tabBody).eq($(this).index()).addClass("current").siblings().removeClass("current")
        })
    }
}