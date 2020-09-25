"use strict"

function sortable() {
    this.listSortTable = function () {
        var nestedSortables = [].slice.call(document.querySelectorAll('.container'));
        for (var i = 0; i < nestedSortables.length; i++) {
            new Sortable(nestedSortables[i], {
                group: 'nested',
                animation: 50,
                ghostClass: 'blue-background-class',
                onMove: function ( /**Event*/ evt, /**nextLevel*/ originalEvent) {
                    if ($(evt.dragged).attr("level") != $(evt.related).attr("level")) {
                        return false;
                    }
                    evt.dragged; // dragged HTMLElement
                    evt.draggedRect; // DOMRect {left, top, right, bottom}
                    evt.related; // HTMLElement on which have guided
                    evt.relatedRect; // DOMRect
                    evt.willInsertAfter; // Boolean that is true if Sortable will insert drag element after target by default
                    originalEvent.clientY; // mouse position
                    // return false; — for cancel
                    // return -1; — insert before target
                    // return 1; — insert after target
                }
            });
        }
    }
}

//const Sortable = require("sortablejs");
// $(".container").each((index, item) => {
//     new Sortable(item, {
//         //group: 'shared', // set both lists to same group
//         animation: 50,
//         ghostClass: 'blue-background-class',
//         group: "nested"
//     })
// });
// const sorttable = new Sortable(container, {
//     //group: 'shared', // set both lists to same group
//     animation: 50,
//     ghostClass: 'blue-background-class',
//     //拖动结束后
//     // onEnd: function ( /**Event*/ evt) {
//     //     var itemEl = evt.item; // dragged HTMLElement
//     //     "evt.item.innerHTML====>",
//     //     itemEl.innerHTML,
//     //         "evt.item.dataset.value====>",
//     //         itemEl.dataset.value,
//     //         "evt.item====>",
//     //         itemEl,
//     //         "evt.oldIndex====>",
//     //         evt.oldIndex,
//     //         "evt.item.parentNode====>",
//     //         evt.item.parentNode,
//     //         "evt.to====>",
//     //         evt.to,
//     //         "evt.target====>",
//     //         evt.target,
//     //         "evt===>",
//     //         evt
//     // },
//     // 拖拽移动的时候
//     onMove: function ( /**Event*/ evt, /**nextLevel*/ originalEvent) {
//         // if ($(evt.dragged).attr("level") != $(evt.related).attr("level")) {
//         //     return false;
//         // }
//         // Example: https://jsbin.com/nawahef/edit?js,output
//         evt.dragged; // dragged HTMLElement
//         evt.draggedRect; // DOMRect {left, top, right, bottom}
//         evt.related; // HTMLElement on which have guided
//         evt.relatedRect; // DOMRect
//         evt.willInsertAfter; // Boolean that is true if Sortable will insert drag element after target by default
//         originalEvent.clientY; // mouse position
//         // return false; — for cancel
//         // return -1; — insert before target
//         // return 1; — insert after target
//     },
// });
//sorttable.options.animation = 2000;
//sorttable.options.sort = false;