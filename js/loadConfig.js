function renderInput() {
    $.ajaxSettings.async = false;
    let default_block_props_str = localStorage.getItem("default_block_props");
    if (!default_block_props_str) {
        $.get("/js/defaultBlockProps.json", function(data){
            let data_str = JSON.stringify(data);
            localStorage.setItem("default_block_props", data_str);
        }); 
        default_block_props_str = localStorage.getItem("default_block_props");
    }
    $.ajaxSettings.async = true;
    let default_block_props = JSON.parse(default_block_props_str);
    // let pNode = $("#default_block_props");
    for (let i=0;i<default_block_props.length;i++) {
        let html_str = "<input type=\"checkbox\" lay-filter=\"checkbox-default-prop\" name=\""+default_block_props[i].name+"\" lay-skin=\"primary\" title=\""+default_block_props[i].name+"\" checked=\"\"></input>";
        $("#default_block_props").append(html_str);
    }
}

renderInput();