var optimize = setInterval(function(){
    let data = document.getElementsByClassName("data-json");
    for (let i=0;i<data.length;i++) {
        //let old_obj = JSON.parse(data[i].innerText)[0];
		let old_obj = JSON.parse($(".parse > button").eq(2*i+1).attr("data-origin"))[0];
        if (old_obj) {
            // if (old_obj.hasOwnProperty("prop")) continue;
            let new_obj = {};
            let prop = JSON.parse(JSON.stringify(old_obj.properties));

            // 发送消息给background以获得完整的屏蔽属性
            chrome.runtime.sendMessage("GET_ALL_BLOCK_PROPS", function(response){
                if (response.success) {
                    for (let j=0;j<response.data.length;j++) {
                        delete prop[response.data[j]];
                    }
                    // new_obj.time = old_obj.time;
                    new_obj.event = old_obj.event;
                    new_obj.prop = JSON.parse(JSON.stringify(prop));     
                    
                    let new_obj_str = JSON.stringify(new_obj,null,2);//参数 null,2 可以格式化json
                    data[i].innerHTML = "<pre><code class=\"json\">[" + new_obj_str + "]</code></pre>";
                    
                    //highlight json
                    data[i].querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightBlock(block);
					});
                }
            });
        } 
    }
}, 500);