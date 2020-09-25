// function ajax(method, url, data, callback) {
// 	var xhr = null;
// 	if (window.XMLHttpRequest) {
// 		xhr = new XMLHttpRequest();
// 	} else {
// 		xhr = new ActiveXObject('Microsoft.XMLHttp');
//     }
//     if (method == 'GET') {
//         xhr.open(method, url + '?' + data);
//         xhr.send();
//     } else if (method == 'POST') {
//         xhr.open(method, url);
//         xhr.setRequestHeader(, );
//         xhr.send(data);
//     }
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState == 4) {
//             if (xhr.status == 200) {
//                 callback(xhr.responseText);
//                 console.log(xhr.responseText);
//             }
//         }
//     }

// }

function ajax(type, url, data, headers) {
  if ($.isEmptyObject(headers) && type == "POST") {
    headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
  }
  $.ajax({
    url,
    type,
    data,
    headers,
    success: (data, status, xhr) => {
      setEditor(response_editor, JSON.stringify(data, null, "\t"));
      setEditor(header_editor, xhr.getAllResponseHeaders());
      loadTemplate(data);
    },
  });
}