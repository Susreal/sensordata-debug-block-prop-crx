
var change = setInterval(function(){
    // chrome.runtime.sendMessage("GET_ALL_BLOCK_PROPS", function(response){
    //     console.log(response);
    // });

    let data = document.getElementsByClassName("data-json");
    for (let i=0;i<data.length;i++) {
        let temp = JSON.parse(data[i].innerText)[0];
        if (temp.hasOwnProperty("prop")) continue;
        let new_obj = new Object();
        if (temp) {
            let prop = temp.properties;

            // 发送消息，回调函数把接收到的回应写到网页中
            chrome.runtime.sendMessage("GET_ALL_BLOCK_PROPS", function(response){
                let all_block_props = response;
                for (let j=0;j<all_block_props.length;j++) {
                    delete prop[all_block_props[j]];
                }
                
            });
            // new_obj.time = temp.time;
            new_obj.event = temp.event;
            new_obj.prop = prop;            
        }
        let new_obj_str = JSON.stringify(new_obj);
        new_obj_str = new_obj_str.replace(/,/g, ",<br>");
        data[i].innerHTML = "[" + new_obj_str + "]";
    }
}, 500);