function getDefaultBlockProps() {
    let default_block_props_str = localStorage.getItem("default_block_props");
    if (!default_block_props_str) {
        $.ajaxSettings.async = false;
        //如果不存在，则从本地json读取并存入storage
        $.get("/js/defaultBlockProps.json", function(data){
            let data_str = JSON.stringify(data);
            localStorage.setItem("default_block_props", data_str);
        }); 
        $.ajaxSettings.async = true;
        default_block_props_str = localStorage.getItem("default_block_props");
    }
    return JSON.parse(default_block_props_str);
}

function getAllBlockProps() {
    let all_block_props = [];
    let input_block_props_str = localStorage.getItem("input_block_props");
    if (input_block_props_str) {
        let input_block_props = JSON.parse(input_block_props_str);
        all_block_props.push.apply(all_block_props,input_block_props);
    }
    let default_block_props = getDefaultBlockProps();
    if (default_block_props) {
        for (let i=0;i<default_block_props.length;i++) {
            if (default_block_props[i].checked) {
                all_block_props.push(default_block_props[i].name);
            }
        }
    }
    console.log(all_block_props);
    return all_block_props;
}

// background中响应来自content-scripts的消息，发送回应
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message == "GET_ALL_BLOCK_PROPS"){
        let resp = getAllBlockProps();
        sendResponse(resp);
    }
});