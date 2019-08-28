layui.use(['layer', 'form', 'element', 'table'], function(){
    var layer = layui.layer
    ,form = layui.form
    ,element = layui.element
    ,table = layui.table;
    
    // layer.msg('Hello World');
    form.val('search', {
        'app_name': loadAppName()
    });

    // 表单中搜索按钮的有效状态处理
    $('#app_name').bind('input propertychange', function() {  
        let input = $('#app_name').val();
        if (input) {
            $('#search_btn').removeClass('layui-btn-disabled');
        }
        else {
            $('#search_btn').addClass('layui-btn-disabled');
        }
    });

    // 监听提交
    form.on('submit(search_app)', function(data){
        let input = data.field.app_name;
        if (input && !$('#search_btn').hasClass('layui-btn-disabled')) {
            localStorage.setItem('app_name', input);
            let shops = loadShopInfo();
            let app_name = loadAppName();
            for (let i=0; i<shops.length; i++) {
                getShopUrlByAppName(shops[i].shop_id, app_name, true);
            }
        }
        return false;
    });

    // render表格
    table.render({
        elem: '#shops'
        ,id: 'shops'
        ,data: loadShopInfo()
        ,cols: [[
        {field: 'shop_id', title: 'shop_id', hide: true}
        ,{field: 'shop_name', title: '渠道', width: 95}
        ,{field: 'latest_version', title: '最新版本', width: 90}
        ,{field: 'shop_url', title: '详情页地址'}
        ,{fixed: 'right', title:'操作', toolbar: '#editBar', width: 65}
        ]]
    });

    window.addEventListener('setItemEvent', function (e) {
        if (e.key == 'shop_info') {
            if (e.oldValue != e.newValue) {
                // shop_info 变化，则重新加载表格
                let new_shop_info = JSON.parse(e.newValue);
                console.log('shop_info变化！重新加载表格...');
                table.reload('shops', {
                    data: new_shop_info
                });
            }
        }
    });

    //监听工具条
    table.on('tool(shops)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        
        if (layEvent == 'edit') { //编辑
            layer.prompt({title: '修改网址...',value: data.shop_url}, function(val, index){
                //同步更新缓存对应的值
                obj.update({
                    shop_url: val
                });
                layer.close(index);
                updateShopUrlInStorage(data.shop_id, val);
                tr.removeClass('layui-table-click');
            });
        }
    });
});

function checkUpdate() {
    $.get("manifest.json", function(manifest){
        let current_version = manifest.version;
        $.ajax({
            type: "GET",
            url: manifest.check_update_url,
            dataType: "json",
            success: function (resp) {
                let latest_version = resp.latest_version;
                if (compareVersion(latest_version, current_version)>0) {
                    layer.msg('检测到插件新版本:'+latest_version, {
                        time: 10000
                        ,btn: ['立即更新', '继续使用']
                        ,yes: function(index){
                            layer.close(index);
                            window.open(manifest.gitHub_homePage, "_blank");
                        }
                    });
                }
            }
        });
    }); 
}

checkUpdate();