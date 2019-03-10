
      !(function(){
        var uniAppViewReadyCallback = function(){
          setCssToHead(["#traceControl{ right: 50%; bottom: 50%; }\nwx-cover-View{ position: absolute; bottom: 22%; right: 4%; font-size: ",[0,35],"; background-color:rgba(0, 0, 255, 0.5); float: right; }\nwx-cover-image { width: ",[0,100],"; height: ",[0,100],"; }\n.",[1],"img { position: relative; width: ",[0,60],"; height: ",[0,60],"; bottom:10%; left: 2%; margin-top: ",[0,-50],"; }\n.",[1],"img_zoomin { position: absolute; width: ",[0,60],"; height: ",[0,60],"; top:10%; right: 1%; margin-top: ",[0,-50],"; }\n.",[1],"img_zoomout { position: absolute; width: ",[0,60],"; height: ",[0,60],"; top:5%; right: 1%; margin-top: ",[0,-50],"; }\n.",[1],"_map { position:relative; width: 100%; height: ",[0,1280],"; }\n.",[1],"test{ background: #fff; height: ",[0,100],"; text-align: center; display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; margin: ",[0,30],"; }\n",],"Some selectors are not allowed in component wxss, including tag name selectors, ID selectors, and attribute selectors.(./pages/index/index.wxss:2:1)",{path:"./pages/index/index.wxss"})();
document.dispatchEvent(new CustomEvent("generateFuncReady", { detail: { generateFunc: $gwx('./pages/index/index.wxml') } }));
        }
        if(window.__uniAppViewReady__){
          uniAppViewReadyCallback()
        }else{
          document.addEventListener('uniAppViewReady',uniAppViewReadyCallback)
        }
      })();
      