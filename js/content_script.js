var optimize = setInterval(function(){
    let data = document.getElementsByClassName("data-json");
    for (let i=0;i<data.length;i++) {
		let old_json_str = JSON.stringify(JSON.parse(data[i].innerText)[0]);
		let raw_json = JSON.parse($(".parse > button").eq(2*i+1).attr("data-origin"))[0];
        if (raw_json) {
            let new_obj = {};
            let prop = JSON.parse(JSON.stringify(raw_json.properties));
            // 发送消息给background以获得完整的屏蔽属性
            chrome.runtime.sendMessage("GET_ALL_BLOCK_PROPS", function(response){
                if (response.success) {
                    for (let j=0;j<response.data.length;j++) {
                        delete prop[response.data[j]];
                    }
                    // new_obj.time = raw_json.time;
                    // new_obj.event = raw_json.event;
                    new_obj.prop = JSON.parse(JSON.stringify(prop));     
                    
                    let new_obj_str = JSON.stringify(new_obj,null,2);
					let new_json_str = JSON.stringify(new_obj);
					if (old_json_str!==new_json_str) {
						data[i].innerHTML = "<pre><code class=\"json\">[" + new_obj_str + "]</code></pre>";
						// highlight json
						data[i].querySelectorAll('pre code').forEach((block) => {
							hljs.highlightBlock(block);
                        });
                        // 滚动到底部
						$("#debug-content-container").scrollTop($("#debug-content-container").prop("scrollHeight"));
					}
                }
            });
        } 
    }
}, 500);