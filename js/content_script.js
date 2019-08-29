var optimize = setInterval(function(){
    let data = document.getElementsByClassName("data-json");
    for (let i=0;i<data.length;i++) {
        let old_obj = JSON.parse(data[i].innerText)[0];    
        if (old_obj) {
            if (old_obj.hasOwnProperty("prop")) continue;
            
            let new_obj = {};
            let prop = JSON.parse(JSON.stringify(old_obj.properties));

            // 发送消息给background以获得完整的屏蔽属性
            chrome.runtime.sendMessage("GET_ALL_BLOCK_PROPS", function(response){
                if (response.success) {
                    for (let j=0;j<response.data.length;j++) {
                        delete prop[response.data[j]];
                    }
                }
            });
            // new_obj.time = old_obj.time;
            new_obj.event = old_obj.event;
            new_obj.prop = JSON.parse(JSON.stringify(prop));     
            
            let new_obj_str = JSON.stringify(new_obj);
            // new_obj_str = new_obj_str.replace(/,/g, ",<br>");
            data[i].innerHTML = "[" + new_obj_str + "]";
        } 
    }
}, 500);