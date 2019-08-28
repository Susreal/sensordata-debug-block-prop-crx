// 从storage加载各项checkbox对应属性的设置
// 没有本地缓存就保存各项checkbox状态到storage
// 并渲染前端
function loadDefaultPropSettings() {
    let default_block_props = localStorage.getItem("default_block_props");
    if (!default_block_props) {
        //如果不存在，则按照checkbox状态存入storage
        updateDefaultPropSettings();
        default_block_props = localStorage.getItem("default_block_props");
    }
    let default_block_props_checkboxs = $("#default_block_props > input");
    let default_block_props_list = JSON.parse(default_block_props);
    for (let i=0;i<default_block_props_checkboxs.length;i++) {
        default_block_props_checkboxs[i].checked = default_block_props_list[i].checked;
    }
}

// 保存各项checkbox状态到storage
function updateDefaultPropSettings() {
    let default_block_props_checkboxs = $("#default_block_props > input");
    let default_block_props_list = [];
    for (let i=0;i<default_block_props_checkboxs.length;i++) {
        let current_default_prop = {};
        current_default_prop.name = default_block_props_checkboxs[i].name;
        current_default_prop.checked = default_block_props_checkboxs[i].checked;
        default_block_props_list.push(current_default_prop);
    }
    localStorage.setItem("default_block_props",JSON.stringify(default_block_props_list));
}

// 从缓存中读取用户的自定义属性，并渲染前端
function loadInputPropSettings() {
    let input_block_props_str = localStorage.getItem("input_block_props");
    if (input_block_props_str) {
        let input_block_props = JSON.parse(input_block_props_str);
        let input_area_text = "";
        for (let i=0;i<input_block_props.length;i++) {
            input_area_text += input_block_props[i];
            if (i!=input_block_props.length-1) input_area_text += "\n";
        }
        $("#input_block_props").val(input_area_text);
    }
}

// 保存用户输入内容到storage
function updateInputPropSettings() {
    let inputText = $("#input_block_props").val();
    let input_block_props_list = inputText.trim().split(/\n+/);
    for (let i=0;i<input_block_props_list.length;i++) {
        input_block_props_list[i] = input_block_props_list[i].trim();
    }
    localStorage.setItem("input_block_props",JSON.stringify(input_block_props_list));
}

// 获取所有屏蔽属性
function getAllBlockProps() {
    let all_block_props = [];
    let input_block_props_str = localStorage.getItem("input_block_props");
    if (input_block_props_str) {
        let input_block_props = JSON.parse(input_block_props_str);
        all_block_props.push.apply(all_block_props,input_block_props);
    }
    let default_block_props_str = localStorage.getItem("default_block_props");
    if (default_block_props_str) {
        console.log(default_block_props_str);
        let default_block_props = JSON.parse(default_block_props_str);
        console.log(default_block_props);
        for (let i=0;i<default_block_props.length;i++) {
            if (default_block_props[i].checked) {
                all_block_props.push(default_block_props[i].name);
            }
        }
    }
    console.log(all_block_props);
    localStorage.setItem("all_block_props", JSON.stringify(all_block_props));

}

loadDefaultPropSettings();
loadInputPropSettings();
getAllBlockProps();

layui.use(['layer', 'form'], function(){
    var layer = layui.layer
    ,form = layui.form;

    form.on('checkbox(checkbox-default-prop)', function(data){
        updateDefaultPropSettings();
    }); 

    form.on('submit(demo1)', function(data){
        updateInputPropSettings();
        return false;
    });
});
