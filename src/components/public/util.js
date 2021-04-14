import $axios from "axios";
var util = {
    loginUrl : "http://119.90.33.35:8065/login?service=",
    casOutUrl : "http://119.90.33.35:8065/logout",
    downLoad: function (postData, url, fileName) {
        $axios({
            url: url,
            data: postData,
            method: 'post',
            responseType: 'blob'
        }).then(function (res) {
            let data = res.data;
            if (!data) {
                return
            }
            let url = window.URL.createObjectURL(new Blob([data]))
            let a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.setAttribute('download', fileName);
            document.body.appendChild(a)
            a.click() //执行下载
            window.URL.revokeObjectURL(a.href)
            document.body.removeChild(a)
        })
    },
}
export default util;