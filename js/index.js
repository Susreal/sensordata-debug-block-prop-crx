function updateLatestVerion2(shop_id, shop_url) {
    let latestVerion = "0.0.0";

    updateLatestVersionInStorage(shop_id, "loading...");

    $.ajax({
        type: "GET",
        url: shop_url,
        success: function (resp) {
            let doms = $.parseHTML(resp);
            switch(shop_id) {
                case "SHOP_IOS": {
                    let data = $(doms).find(".whats-new__latest__version");
                    if (data.length>0) latestVerion = data[0].innerText.substring(2);
                    break;
                }
                case "SHOP_YYB": {
                    let data = $(doms).find(".det-othinfo-data");
                    if (data.length>0) latestVerion = data[0].innerText.substring(1);
                    break;
                }
                case "SHOP_MI": {
                    let data = $(doms).find(".cf > .weight-font + li");
                    if (data.length>0) latestVerion = data[1].innerText;
                    break;
                }
                case "SHOP_HW": {
                    let data = $(doms).find(".app-info-ul > .ul-li-detail > span");
                    if (data.length>0) latestVerion = data[3].innerText;
                    break;
                }
                case "SHOP_MZ": {
                    let data = $(doms).find(".app_content");
                    if (data.length>0) latestVerion = data[3].innerText;
                    break;
                }
                case "SHOP_BD": {
                    let data = $(doms).find(".detail > .version");
                    if (data.length>0) latestVerion = data[0].innerText.substring(3);
                    break;
                }
                case "SHOP_SG": {
                    let data = $(doms).find(".info td");
                    if (data.length>0) {
                        let splitText = data[1].innerText.split("：");
                        if (splitText.length>0) latestVerion = splitText[splitText.length-1].trim();
                    }
                    break;
                }
                default:
                    break;
            } 
            updateLatestVersionInStorage(shop_id, latestVerion);
        }
    });
}

$("#reset_btn").click(function() {
    reloadShopInfo();
});

$("#search_btn").click(function() {
    // let shops = loadShopInfo();
    // let app_name = loadAppName();
    // for (let i=0; i<shops.length; i++) {
    //     getShopUrlByAppName(shops[i].id, app_name);
    // }
});

$("#update_btn").click(function() {
    // $(this).removeClass("layui-icon-refresh-3");
    // $(this).addClass("layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop");
    let shops = loadShopInfo();
    for (let i=0; i<shops.length; i++) {
        updateLatestVerion2(shops[i].shop_id, shops[i].shop_url);
    }
});

let shops = loadShopInfo();
for (let i=0; i<shops.length; i++) {
    updateLatestVerion2(shops[i].shop_id, shops[i].shop_url);
}

checkUpdate();