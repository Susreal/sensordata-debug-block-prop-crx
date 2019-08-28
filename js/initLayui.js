function loadDefaultPropSettings() {
    let default_prop_settings = localStorage.getItem("default_prop_settings");
    if (!default_prop_settings) {
        //如果不存在，则按照checkbox状态存入storage
        updateDefaultPropSettings();
        default_prop_settings = localStorage.getItem("default_prop_settings");
    }
    let default_prop_settings_checkboxs = $("#default-prop-settings > input");
    let default_prop_settings_list = [];
    for (let i=0;i<default_prop_settings.length;i++) {
        if (default_prop_settings[i].checked) {
            default_prop_settings_list.push(default_prop_settings[i].name);
        }
    }
    localStorage.setItem("default_prop_settings",JSON.stringify(default_prop_settings_list));
}

// LOAD: 从storage加载/没有就全选并保存到storage，并渲染前端
// UPDATE: 根据前端设置保存到storage

function updateDefaultPropSettings() {
    let default_prop_settings_checkboxs = $("#default-prop-settings > input");
    let default_prop_settings_list = [];
    for (let i=0;i<default_prop_settings_checkboxs.length;i++) {
        let current_default_pro = {};
        current_default["default_prop_settings_checkboxs[i].name"] = default_prop_settings_checkboxs[i].checked;

        // if (default_prop_settings_checkboxs[i].checked) {
        //     default_prop_settings_list.push(default_prop_settings_checkboxs[i].name);
        // }
    }
    localStorage.setItem("default_prop_settings",JSON.stringify(default_prop_settings_list));
}

loadDefaultPropSettings();

layui.use(['layer', 'form'], function(){
    var layer = layui.layer
    ,form = layui.form;

    form.on('checkbox(checkbox-default-prop)', function(data){
        // console.log(data.elem); //得到checkbox原始DOM对象
        // console.log(data.elem.checked); //是否被选中，true或者false
        // console.log(data.value); //复选框value值，也可以通过data.elem.value得到
        // console.log(data.othis); //得到美化后的DOM对象

        updateDefaultPropSettings();
    }); 
});
