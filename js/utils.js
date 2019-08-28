function updateInputByName(name, value) {
    $("[name="+String(name)+"]").val(value);
}

function updateTextById(id, text) {
    let th = document.getElementById(id);
    if(th) th.innerText = text;
}

function reloadShopInfo() {
    let default_shop_info = [
        {
            shop_id: "SHOP_IOS",
            shop_name: "App Store",
            shop_url: "https://apps.apple.com/cn/app/id1404845879",
            latest_version: "0.0.0"
        },
        {
            shop_id: "SHOP_YYB",
            shop_name: "应用宝",
            shop_url: "https://sj.qq.com/myapp/detail.htm?apkName=com.cccampus.younglife",
            latest_version: "0.0.0"
        },
        {
            shop_id: "SHOP_MI",
            shop_name: "小米",
            shop_url: "http://app.mi.com/details?id=com.cccampus.younglife",
            latest_version: "0.0.0"
        },
        {
            shop_id: "SHOP_HW",
            shop_name: "华为",
            shop_url: "https://appstore.huawei.com/app/C100295325",
            latest_version: "0.0.0"
        },
        {
            shop_id: "SHOP_MZ",
            shop_name: "魅族",
            shop_url: "http://app.meizu.com/apps/public/detail?package_name=com.cccampus.younglife",
            latest_version: "0.0.0"
        },
        {
            shop_id: "SHOP_BD",
            shop_name: "百度",
            shop_url: "https://shouji.baidu.com/software/26255558.html",
            latest_version: "0.0.0"
        },
        {
            shop_id: "SHOP_SG",
            shop_name: "搜狗",
            shop_url: "http://zhushou.sogou.com/apps/detail/667320.html",
            latest_version: "0.0.0"
        }
    ];
    localStorage.setItem("shop_info",JSON.stringify(default_shop_info));
    console.log('保存默认shop_info到本地缓存...');
    return default_shop_info;
}

function loadAppName() {
    let app_name_str = localStorage.getItem("app_name");
    if (app_name_str) {
        // 如果有缓存，则返回缓存内容
        return String(app_name_str);
    } else {
        // 没有缓存就加载默认设置并存入缓存
        let default_app_name = "yaktalk";
        localStorage.setItem("app_name", default_app_name);
        console.log('保存默认app_name到本地缓存...');
        return default_app_name;
    }
}

function loadShopInfo() {
    let shop_info_str = localStorage.getItem("shop_info");
    if (shop_info_str) {
        // 如果有缓存，则返回缓存内容
        return JSON.parse(shop_info_str);
    }
    else {
        // 没有缓存就加载默认设置并存入缓存
        return reloadShopInfo();
    }
}

function updateShopUrlInStorage(shop_id, new_shop_url) {
    let shop_info_str = localStorage.getItem("shop_info");
    if (shop_info_str) {
        // 如果有缓存，则更新
        let new_shop_info = JSON.parse(shop_info_str);
        for (let i=0; i<new_shop_info.length; i++) {
            if (new_shop_info[i].shop_id == shop_id) {
                new_shop_info[i].shop_url = String(new_shop_url);
                localStorage.setItem("shop_info",JSON.stringify(new_shop_info));
                console.log('更新'+shop_id+'地址到本地缓存...');
                return true;
            }
        }
        return false;
    } else {
        // 没有缓存，无法更新
        return false;
    }

}

function updateLatestVersionInStorage(shop_id, new_version) {
    let shop_info_str = localStorage.getItem("shop_info");
    if (shop_info_str) {
        // 如果有缓存，则更新
        let new_shop_info = JSON.parse(shop_info_str);
        for (let i=0; i<new_shop_info.length; i++) {
            if (new_shop_info[i].shop_id == shop_id) {
                new_shop_info[i].latest_version = String(new_version);
                localStorage.setItem("shop_info",JSON.stringify(new_shop_info));
                console.log('更新'+shop_id+'最新版本到本地缓存...');
                return true;
            }
        }
        return false;
    } else {
        // 没有缓存，无法更新
        return false;
    }

}

// 重写localStorage的setItem方法
var orignalSetItem = localStorage.setItem;
localStorage.setItem = function(key,newValue){
    var setItemEvent = new Event("setItemEvent");
    setItemEvent.key = key;
    setItemEvent.newValue = newValue;
    setItemEvent.oldValue = localStorage.getItem(key);
    window.dispatchEvent(setItemEvent);
    orignalSetItem.apply(this,arguments);
}

// 按照app_name搜索各应用市场的url并更新至storage
// updateLatestVersion为true，则同时更新最新版本号
function getShopUrlByAppName(shop_id, app_name, updateLatestVersion=false) {
    switch(shop_id) {
        case "SHOP_YYB": {
            $.ajax({
                type: "POST",
                url: "https://sj.qq.com/myapp/searchAjax.htm?kw="+String(app_name)+"&pns=&sid=",
                success: function (resp) {
                    let pkgName = resp.obj.items[0].appDetail.pkgName;
                    if (pkgName) {
                        let shop_url = "https://sj.qq.com/myapp/detail.htm?apkName="+pkgName;
                        updateShopUrlInStorage(shop_id, shop_url);
                        if (updateLatestVersion) updateLatestVerion2(shop_id, shop_url);
                    }
                }
            });
            break;
        }
        case "SHOP_MI": {
            $.ajax({
                type: "GET",
                url: "http://app.mi.com/searchAll?keywords="+String(app_name)+"&typeall=phone",
                success: function (resp) {
                    let doms = $.parseHTML(resp);
                    let data = $(doms).find(".applist > li > a");
                    if (data.length>0) {
                        let shop_url = "http://app.mi.com"+data[0].getAttribute("href");
                        updateShopUrlInStorage(shop_id, shop_url);
                        if (updateLatestVersion) updateLatestVerion2(shop_id, shop_url);
                    }
                }
            });
            break;
        }
        case "SHOP_HW": {
            $.ajax({
                type: "GET",
                url: "https://appstore.huawei.com/search/"+String(app_name),
                success: function (resp) {
                    let doms = $.parseHTML(resp);
                    let data = $(doms).find(".list-game-app > .game-info-ico > a");
                    if (data.length>0) {
                        let shop_url = "https://appstore.huawei.com"+data[0].getAttribute("href");
                        updateShopUrlInStorage(shop_id, shop_url);
                        if (updateLatestVersion) updateLatestVerion2(shop_id, shop_url);
                    }
                }
            });
            break;
        }
        case "SHOP_MZ": {
            $.ajax({
                type: "GET",
                url: "http://app.meizu.com/apps/public/search/page?cat_id=1&keyword="+String(app_name)+"&start=0&max=18",
                success: function (resp) {
                    let pkgName = resp.value.list[0].package_name;
                    if (pkgName) {
                        let shop_url = "http://app.meizu.com/apps/public/detail?package_name="+pkgName;
                        updateShopUrlInStorage(shop_id, shop_url);
                        if (updateLatestVersion) updateLatestVerion2(shop_id, shop_url);
                    }
                }
            });
            break;
        }
        case "SHOP_BD": {
            $.ajax({
                type: "GET",
                url: "https://shouji.baidu.com/s?wd="+String(app_name)+"&data_type=app",
                success: function (resp) {
                    let doms = $.parseHTML(resp);
                    let data = $(doms).find(".app-list > .app-outer > .app > .icon > a");
                    if (data.length>0) {
                        let shop_url = "https://shouji.baidu.com/"+data[0].getAttribute("href");
                        updateShopUrlInStorage(shop_id, shop_url);
                        if (updateLatestVersion) updateLatestVerion2(shop_id, shop_url);
                    }
                }
            });
            break;
        }
        case "SHOP_SG": {
            $.ajax({
                type: "GET",
                url: "http://zhushou.sogou.com/apps/search.html?key="+String(app_name),
                success: function (resp) {
                    let doms = $.parseHTML(resp);
                    let data = $(doms).find(".list > li > a");
                    if (data.length>0) {
                        let shop_url = data[0].getAttribute("href");
                        updateShopUrlInStorage(shop_id, shop_url);
                        if (updateLatestVersion) updateLatestVerion2(shop_id, shop_url);
                    }
                }
            });
            break;
        }
        default: break;
    }
}

// 版本号比较
// 0代表相等，1代表左边大，-1代表右边大
function compareVersion(v1, v2) {
    let v1Array = String(v1).split(".");
    let v2Array = String(v2).split(".");
    let minLength = Math.min(v1Array.length, v2Array.length);
    let index = 0;
    let diff = 0;

    while (index < minLength && (diff = parseInt(v1Array[index]) - parseInt(v2Array[index])) == 0) {
        index++;
    }
    if (diff == 0) {
        for (let i = index; i < v1Array.length; i++) {
            if (parseInt(v1Array[i]) > 0) {
                return 1;
            }
        } 
        for (let i = index; i < v2Array.length; i++) {
            if (parseInt(v2Array[i]) > 0) {
                return -1;
            }
        }
        return 0;
    } else {
        return diff > 0 ? 1 : -1;
    }
}