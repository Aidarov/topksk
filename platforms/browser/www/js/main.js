var langItems = ["KAZ", "RUS"];
var body_copy; 
var langData;
var filesToSend = [];

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

function loadingBarShow() {
    document.getElementsByClassName("overlay_progress")[0].style.display = "inline";
}

function getClientData() {
    $.ajax({
        url: config.url.current,
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        processData: false,
        timeout: this.timeout,
        cache: false,
        async: false,
        success: function(data){
            $("#firstName").text(data.user_info.first_name);
            config.authorized = true;
        },
        error: function(xhr, ajaxOptions, thrownError){
            config.authorized = false;
        }
    });
}

function setLanguage() {

    if(!config.savePassword) {
        $("#loginField").val(null);
        $("#passwordField").val(null);
        $("#savePassword").prop("checked", false);
    }
    else
    {
        $("#loginField").val(localStorage.getItem("login"));
        $("#passwordField").val(localStorage.getItem("password"));
        $("#savePassword").prop("checked", true);
    }
    var langTxt = config.langList.rus;

    if(localStorage.getItem("lang") == langTxt)
    {        
        langData = RUS;
        $(".language").text(langTxt);
    }
    else {
        langTxt = config.langList.kaz;
        langData = KAZ;
        $(".language").text(langTxt);
    }

    $("#languageList").val(langTxt);
    $("#contextMenuOpenBtn").show();
}

function getOrderReqType()
{
    var langId = config.lang();

    var dataToPost = {
        lang_id: langId,
        name: "req_type"
    };

    var response = [];

    $.ajax({
        url: config.url.reqType,
        type: 'post',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(dataToPost),
        timeout: config.timeout,
        async: false,
        success: function (result) {                    
                response = result;
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });

    return response;
}

function getStatuses()
{
    var langId = config.lang();

    var dataToPost = {
        lang_id: langId,
        name: "req_status"
    };

    var response = [];

    $.ajax({
        url: config.url.reqType,
        type: 'post',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(dataToPost),
        timeout: config.timeout,
        async: false,
        success: function (result) {                    
                response = result;
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });

    return response;
}

function getUserAddress()
{
    var langId = config.lang();

    var response = [];

    var dataToPost = {
        sqlpath: "sprav/user_address",
        t_language_id: 1,
        userId: 1, t_rel_status: 4        
    };

    $.ajax({
        url: config.url.userAddresses,
        type: 'post',
        contentType: 'application/json;charset=UTF-8',
        timeout: config.timeout,
        data: JSON.stringify(dataToPost),
        async: false,
        success: function (result) {                    
                response = result;
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });

    return response;    
}

function Authorize() {
    $.ajax({
        url: config.url.current,
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        processData: false,
        timeout: config.timeout,
        cache: false,
        success: function(data){
            if(!config.savePassword) {
                $("#loginField").val(null);
                $("#passwordField").val(null);
                localStorage.removeItem("login");
                localStorage.removeItem("password");              
            }
            else
            {
                localStorage.setItem("login", $("#loginField").val());
                localStorage.setItem("password", $("#passwordField").val());
            }
            $("#firstName").text(data.user_info.first_name);
            //window.plugins.PushbotsPlugin.updateAlias(data.user_info.recid);
            config.authorized = true;
            $(this).attr("type", "password");
            $("#visiblePassword").removeClass("visiblePassword-show");
            localStorage.setItem("userFirstName", data.user_info.first_name);
            document.location.hash = "notifyListPage";
            DrawNotifyList();
        },
        error: function(xhr, ajaxOptions, thrownError){
            alert("Authorize fails");
        }
    });
}

function GetList(date, status, theme, notifid) {

    var response = {};
    var langId = config.lang();

    if(date == "")
    {
        date = "1111-11-11";
    }

    var dataToPost = {  t_language_id: langId,
                        userId: 1,
                        notifid: notifid,
                        notifDate1: date,
                        status: status,
                        theme1: theme,
                        sqlpath: 'sprav/get_notification'
                    };

    $.ajax({url: config.url.notify_list,
        type: 'post',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(dataToPost),
        timeout: config.timeout,
        async: false,
        beforeSend : function(xhr, opts){
            $(".overlay_progress").show();
        },
        success: function (data, textStatus, request) {
            response = data;            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            response = null;
        },
        complete: function(event,xhr,options) {
            $(".overlay_progress").hide();
        }
    });
    
    return response;
}

function DrawNotifyList(){
     $(".listData").html("");
    var response = GetList("1111-11-11", 0, "", -1);
    if(response != null)
    {
        var date2 ="";
        for(var i = 0; i < response.length; i++)
        {
            $(".listData").append("<li><div class=\"notif_sender_field\">" + response[i].notif_sender +
                "</div><div class=\"notif_text_field\">" + response[i].notif_text + "</div><div class=\"id_field\">" + response[i].notif_number +
                "</div><div class=\"type_field\">" + response[i].notif_theme + "</div><div class=\"state_field\">" + response[i].notif_status +
                "</div><div class=\"date_field\">" + new Date(response[i].dat_notif).toLocaleDateString('ru-RU') + "</div><div class=\"clear\"></div></li>");
        }
    }
}

$("document").ready(function() {
    getClientData();
    hashChange();
    body_copy = $("body").html();


    $("body").html(tmpl(body_copy, langData));

    $(document).on("click", "#contextMenuOpenBtn",  function() {
        $(this).hide();
        $(".overlay").fadeIn("slow");
    });

    $(document).on("click", "#contextMenuOpenClose",  function() {
        $(".overlay").fadeOut("slow", function() {
            $("#contextMenuOpenBtn").show();
        });
        
    });

    function updateLanguage() {
        var lang = $(".language").text().trim();
        var index = ((langItems.indexOf(lang) + 1) == langItems.length) ? 0 : langItems.indexOf(lang) + 1;
        localStorage.setItem("lang",  langItems[index]);        
        $(".language").text(langItems[index]);
        setLanguage();        
        $("body").html(tmpl(body_copy, langData)); 
        $("#firstName").text(localStorage.getItem("userFirstName"));
    }

    $(document).on("click", "#loginBtn", function(){
        var login = $("#loginField").val().trim();
        var password = $("#passwordField").val().trim();
        var validated = true;
        if(login == "")
        {
            $("[for=\"loginField\"]").show();
            validated = false;
        }
        else
        {
            $("[for=\"loginField\"]").hide();
        }

        if(password == "")
        {
            $("[for=\"passwordField\"]").show();
            validated = false;
        }
        else
        {
            $("[for=\"passwordField\"]").hide();
        }

        if(validated)
        {
//alert(config.url.login);
            $.ajax({
                url: config.url.login,
                data: "role="+login+"&password="+password+"&authurl=login.html",
                contentType: 'application/x-www-form-urlencoded',
                timeout: config.timeout,
                type: 'POST',
                processData: false,
                crossDomain: true,
                beforeSend : function(xhr, opts){
                    $(".overlay_progress").show();
                },
                success: function(data){
                    Authorize();
                },
                error: function(xhr, ajaxOptions, thrownError){
                    alert("please check the internet connection");                    
                },
                complete: function(event,xhr,options) {
                    $(".overlay_progress").hide();
                }
            });            
        }
        

    });
    
    $(window).on('hashchange',function(){
        hashChange();           
    });

     function hashChange() {
        var hash = window.location.hash;
        hash = hash.substring(1, hash.length);

        //getClientData();

        if(config.availableContextMenu.indexOf(hash) != -1)
        {
            $("#contextMenuOpenBtn").show();
        }
        else
        {
            $("#contextMenuOpenBtn").hide();            
        }

        if(hash == "" || hash == "mainPage" || hash == null)
        {
            if(config.authorized) {
                //window.history.forward();
                //return;
                hash = "notifyListPage";
                DrawNotifyList();
            }
            else {
                $(".page").hide();
                $("#mainPage").css("display", "block");
                return;
            }
        }
        else {
            if(!config.authorized) {
                if(hash != "forgotPassword" && hash != "registration")
                {
                    $(".page").hide();
                    $("#mainPage").css("display", "block");
                    return;
                }                                
            }            
        }
        
        $(".page").hide();
        $("#"+hash).css("display", "block");

        if(hash == "orderAddPage")
        {
            $("#orderType option").not(':first').remove();
            $("#orderAddress option").not(':first').remove();

            var reqtype = getOrderReqType();

            for(var i = 0; i < reqtype.length; i++)
            {
                $("#orderType").append($("<option/>", { 
                    value: reqtype[i].id,
                    text : reqtype[i].text 
                }));
            }
            var addresses = getUserAddress();

            for(var i = 0; i < addresses.length; i++)
            {
                $("#orderAddress").append($("<option/>", { 
                    value: addresses[i].id,
                    text : addresses[i].text 
                }));
            }
        }
        else if(hash == "orderListPage")
        {
            var langId = config.lang();
            var today = new Date();
            var yesterday = new Date(today);
            yesterday.setMonth(today.getMonth() - 1);
            var dataToPost = {
                citreqs: 1,            
                dat_reg_beg: yesterday.toJSON().slice(0, 10),
                dat_reg_end: today.toJSON().slice(0, 10) + "23:59:59",
                lang_id: langId,
                req_status: 0,
                userId: 1
            };

            if($("#orderDateFrom").val() != "")
            {
                return;
            }

            $.ajax({
                url: config.url.orderList,
                type: 'post',
                contentType: 'application/json;charset=UTF-8',
                async: false,
                timeout: config.timeout,
                data: JSON.stringify(dataToPost),
                beforeSend : function(xhr, opts){
                    $(".overlay_progress").show();
                },
                success: function (response) {
                    $(".listOrderData").html("");
                    if(response != null)
                    {
                        for(var i = 0; i < response.length; i++)
                        {
                            $(".listOrderData").append("<li><div class=\"notif_sender_field\">" + response[i].req_user +
                                "</div><div class=\"notif_text_field\">" + response[i].req_note + "</div><div class=\"id_field\">" +
                                response[i].recid + "</div><div class=\"type_field\">" + response[i].req_type + "</div><div class=\"state_field\">" +
                                response[i].req_status + "</div><div class=\"date_field\">" + new Date(response[i].dat_reg).toLocaleString('ru-RU') +
                                "</div><div class=\"clear\"></div></li>");
                        }
                    }

                    document.location.href="#orderListPage";
                },
                error: function (result) {
                },
                complete: function(event,xhr,options) {
                    $(".overlay_progress").hide();
                }
            });
        }
        else if(hash == "orderFilterPage")
        {
            $('#orderDateFrom').val(new Date().toDateInputValue());
            $('#orderDateTo').val(new Date().toDateInputValue());
            
            $("#orderFilterType option").not(':first').remove();
            $("#orderFilterAddress option").not(':first').remove();
            $("#orderFilterStatus option").remove();

            var reqtype = getOrderReqType();
            var addresses = getUserAddress();
            var statuses = getStatuses();

            for(var i = 0; i < reqtype.length; i++)
            {
                $("#orderFilterType").append($("<option/>", { 
                    value: reqtype[i].id,
                    text : reqtype[i].text 
                }));
            }

            for(var i = 0; i < addresses.length; i++)
            {
                $("#orderFilterAddress").append($("<option/>", { 
                    value: addresses[i].id,
                    text : addresses[i].text 
                }));
            }

            for(var i = 0; i < statuses.length; i++)
            {
                $("#orderFilterStatus").append($("<option/>", { 
                    value: statuses[i].id,
                    text : statuses[i].text 
                }));
            }

        }
        else if(hash == "exit" && config.authorized)
        {
            $.ajax({
                url: config.url.logout,
                type: 'POST',
                timeout: config.timeout,
                data: {},
                success: function() {
                    config.authorized = false;
                },
                error: function() {
                    //todo: 
                },
                complete: function() {                    
                    document.location.hash = "";
                }
            });               
        }
        else {

        }
    };

    $(document).on("click", "#orderFilterBtn", function(){
        var langId = config.lang();

        var dataToPost = {};

        if($("#orderId").val().trim() == "")
        {
            dataToPost = {
                citreqs: 1,            
                dat_reg_beg: $("#orderDateFrom").val(),
                dat_reg_end: $("#orderDateTo").val() + "23:59:59",
                lang_id: langId,
                req_status: parseInt($("#orderFilterStatus").val()),
                req_type: parseInt($("#orderFilterType").val()),
                t_req_subtype_id: parseInt($("#orderReqSubType").val()),
                userId: 1
            };
        }
        else
        {
            dataToPost = {
                citreqs: 1,
                id: parseInt($("#orderId").val()),
                lang_id: langId
            };
        }

        $.ajax({
            url: config.url.orderList,
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            async: false,
            timeout: config.timeout,
            data: JSON.stringify(dataToPost),
            beforeSend : function(xhr, opts){
                $(".overlay_progress").show();
            },
            success: function (response) {
                $(".listOrderData").html("");
                if(response != null)
                {
                    for(var i = 0; i < response.length; i++)
                    {
                        $(".listOrderData").append("<li><div class=\"notif_sender_field\">" + response[i].req_user +
                            "</div><div class=\"notif_text_field\">" + response[i].req_note + "</div><div class=\"id_field\">" + response[i].recid +
                            "</div><div class=\"type_field\">" + response[i].req_type + "</div><div class=\"state_field\">" + response[i].req_status +
                            "</div><div class=\"date_field\">" + new Date(response[i].dat_reg).toLocaleString('ru-RU') + "</div><div class=\"clear\"></div></li>");
                    }
                }

                document.location.href="#orderListPage";
            },
            error: function (result) {
            },
            complete: function(event,xhr,options) {
                $(".overlay_progress").hide();
            }
        });

    });

    $(document).on("click","#notifyFilterSearchBtn", function(){
        $(".listData").html("");
        //alert("notifyFilterSearchBtn");
        var date = $("#notifyDate").val();
        var status = parseInt($("#notifyStatus").val());
        var theme = $("#notifyTheme").val();
        var id = ($("#notifyId").val() == "") ? -1 : parseInt($("#notifyId").val());
        var response = GetList(date, status, theme, id);

        if(response != null)
        {
            for(var i = 0; i < response.length; i++)
            {
                $(".listData").append("<li><div class=\"notif_sender_field\">" + response[i].notif_sender + "</div><div class=\"notif_text_field\">" +
                    response[i].notif_text + "</div><div class=\"id_field\">" + response[i].notif_number + "</div><div class=\"type_field\">" +
                    response[i].notif_theme + "</div><div class=\"state_field\">" + response[i].notif_status + "</div><div class=\"date_field\">" +
                    new Date(response[i].dat_notif).toLocaleDateString('ru-RU') + "</div><div class=\"clear\"></div></li>");
            }
        }
        document.location.href="#notifyListPage";
    });

    $(document).on("click","ul.listData li", function(){
        var thisElem = this;
        $(".overlay_progress").show();
        setTimeout(function(){
            $("#notifyLookUpId").val($(thisElem).find(".id_field").text());
            $("#notifyLookUpDate").val($(thisElem).find(".date_field").text());
            $("#notifyLookUpFioSender").val($(thisElem).find(".notif_sender_field").text());
            $("#notifyLookUpTheme").val($(thisElem).find(".type_field").text());
            $("#notifyLookUpText").val($(thisElem).find(".notif_text_field").text());

            document.location.href="#notifyLookUpPage";
            //alert($("#notifyLookUpId").val());
            $(".overlay_progress").hide();
            $.ajax({
                url: config.url.insReq,
                type: 'post',
                contentType: 'application/json;charset=UTF-8',
                async: false,
                data: JSON.stringify({sqlpath: 'view_notification', notifid: Number($("#notifyLookUpId").val()), userId: 1}),
                success: function (result) {
                    //search();
                    //alert(JSON.stringify(result))
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    response = null;
                    //alert("Error");
                    //alert(JSON.stringify(thrownError));
                    alert(JSON.stringify(xhr));
                }
            });
            DrawNotifyList();
        }, 500);
        
    });
    
    $(document).on("click","ul.listOrderData li", function(){
        var thisElem = this;
        $(".overlay_progress").show();
        setTimeout(function(){
            document.location.href="#orderLookUpPage";
            var id = parseInt($(thisElem).find(".id_field").text());
            var data = getOrderByid(id)[0];
            var images = getImage(id);
            $("#orderLookUpPhotoPage .content").html("");
            for(var i = 0; i < images.length; i++)
            {
                $("#orderLookUpPhotoPage .content").append("<img src=" + config.url.root + images[i].file_id + " class=\"gallery\" />");
            }
            $("#orderSubTypeLookUp").val(data.req_subtype);
            $("#orderTypeLookUp").val(data.req_type);
            $("#orderAddressLookUp").val(data.req_address);
            $("#orderUrgentLookUp").val(data.req_priority);
            $("#orderLookUpText").val(data.req_note);            
        }, 500);        
    });

    $(document).on("click", "#orderPhotoShowBtn", function(){
        document.location.hash = "orderLookUpPhotoPage";
    });
    
    $(document).on("click", "#reg_btn", function(){
        var dataToPost = {
            email: $('#reg_email').val(),
            password: $('#reg_password').val(),
            name: $('#reg_firstname').val(),
            surname: $('#reg_lastname').val(),
            mobilephone: $('#reg_phone').val()
        };
        
        var validated = true;
        
        if(dataToPost.email == "")
        {
            $("[for=\"reg_email\"]").show();
            validated = false;
        }
        else
        {
            $("[for=\"reg_email\"]").hide();
        }

        if(dataToPost.password == "")
        {
            $("[for=\"reg_password\"]").show();
            validated = false;
        }
        else
        {
            $("[for=\"reg_password\"]").hide();
        }
        
        if(dataToPost.name == "")
        {
            $("[for=\"reg_firstname\"]").show();
            validated = false;
        }
        else
        {
            $("[for=\"reg_firstname\"]").hide();
        }
        
        if(dataToPost.surname == "")
        {
            $("[for=\"reg_lastname\"]").show();
            validated = false;
        }
        else
        {
            $("[for=\"reg_lastname\"]").hide();
        }
        
        if(dataToPost.mobilephone == "")
        {
            $("[for=\"reg_phone\"]").show();
            validated = false;
        }
        else
        {
            $("[for=\"reg_phone\"]").hide();
        }
        
        $.ajax({
            url: config.url.register,
            type: 'put',
            timeout: config.timeout,
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(dataToPost),
            beforeSend : function(xhr, opts){
                $(".overlay_progress").show();
            },
            success: function (result) {                    
                    document.location.href="#mainPage";
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
            complete: function(event,xhr,options) {
                $(".overlay_progress").hide();
            }
        });
    });

    $(document).on("click","#restore_btn", function(){
        var email = $("#restore_email").val();
        if(isValidEmailAddress(email))
        {
            $.post(config.url.restore_password + email,
            function (result) {
                if (result.email == "email_not_found") {
                    alert("messages.email_not_found");
                }
                else {
                    alert("messages.resetPasswordMailSent" + result.email);
                    document.location.href="#mainPage";
                }                
            });
        }
        else
        {
             alert("messages.invalidLogin");
        }
    });

    function isValidEmailAddress(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    };
    
    function getImage(suid)
    {
        var dataToPost = {
            name: "cur_image",
            sid: parseInt(suid)            
        };
        
        var response = {};
        
        $.ajax({url: config.url.imageUrl,
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(dataToPost),
            timeout: config.timeout,
            async: false,
            success: function (data, textStatus, request) {
                response = data;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                response = null;
            },
            complete: function(event,xhr,options) {
                $(".overlay_progress").hide();
            }
        });        
        return response;
    }
    
    function getOrderByid(id)
    {
        var langId = config.lang();
        
        var dataToPost = {
            citreqs: 1,
            id: parseInt(id),
            lang_id: langId
        };
        
        var response = [];
        
        $.ajax({
            url: config.url.orderList,
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            timeout: config.timeout,
            async: false,
            data: JSON.stringify(dataToPost),
            beforeSend : function(xhr, opts){
                $(".overlay_progress").show();
            },
            success: function (result) {
                response = result;
            },
            error: function (result) {
                response = [];
            },
            complete: function(event,xhr,options) {
                $(".overlay_progress").hide();
            }
        });
        
        return response;
    }

    $(document).on("change", "#languageList", function(){
        updateLanguage();
        $(".page").hide();
        $("#languagePage").show();
    });

    $(document).on("click", ".language", function(){
        updateLanguage();
    });
    function getBase64(file) {
        $(".overlay_progress").show();
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            var fileContent = this.result.substring(this.result.indexOf("base64") + 7);
            var guid = config.guid();
            filesToSend.push({
                content: fileContent,
                file: {},
                modified: file.lastModifiedDate.toISOString(),
                name: file.name,
                size: file.size,
                type: file.type,
                req_id: guid
            });

            $(".overlay_progress").hide();
            drawBase64(this.result, guid);
            
        };
        reader.onerror = function (error) {
            alert("file not formatted");
        };
    }
    
    /*$(".attachFileBtn").on("click", function() {
        $("#imageUploadBtn").trigger("click");
    });*/
    
    $(document).on("change", "#imageUploadBtn", function(){
        var file = document.querySelector('input[type=file]').files[0]
        getBase64(file);        
    });

    function getFileContentAsBase64(path,callback){
        window.resolveLocalFileSystemURL(path, gotFile, fail);
                
        function fail(e) {
                alert('Cannot found requested file');
        }
    
        function gotFile(fileEntry) {
                fileEntry.file(function(file) {
                    var reader = new FileReader();
                    reader.onloadend = function(e) {
                        var content = this.result,
                            fileSize = file.size,
                            fileName = file.name,
                            fileType = file.type,
                            fileModifiedTime = new Date(file.lastModifiedDate).toISOString();                       
                        
                            
                        callback(content, fileSize, fileName, fileType, fileModifiedTime);
                    };
                    reader.readAsDataURL(file);
                });
        }
    }

    $(document).on("click", ".cameraBtn", function() {
        var options = {
            quality: 20,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            cameraDirection: 1,
            saveToPhotoAlbum: true,
            correctOrientation : true
        };
        $(".overlay_progress").show();
        try{
            navigator.camera.getPicture(
                function(fileName){
                    getFileContentAsBase64(fileName, function(base64Image, fileSize, fileShortName, fileType, fileModifiedTime){                        
                        var fileContent = base64Image.substring(base64Image.indexOf("base64") + 7);
                        var guid = config.guid();                        
                        filesToSend.push({
                            content: fileContent,
                            file: {},
                            modified: fileModifiedTime,
                            name: fileShortName,
                            size: fileSize,
                            type: fileType,
                            req_id: guid
                        });
                        $(".overlay_progress").hide();
                        drawBase64(base64Image, guid);

                    });
                }, 
                function(error){
                    console.log(error);
                    $(".overlay_progress").hide();
                }, 
                options
            );
        }
        catch(e)
        {
            alert(e.message);
        }
    });

    $(document).on("click", ".file-delete-button", function(){
        var index = $(this).parent().attr("index");
        var index2 = -1;
        for(var i = 0; i < filesToSend.length; i++)
        {
            if(filesToSend[i].req_id == index)
            {
                index2 = i - 1;
                break;
            }
        }
        filesToSend.splice(index2, 1);
        $(this).parent().remove();
    });

    function drawBase64(base64Image, guid) {
        $(".cameraButtons").after("<div class=\"upload-images\" index="+guid+">\
            <img src="+base64Image+" /><span class=\"file-delete-button\"></span>\
        </div>");
    }

    function sendImageXHR() {
        $.ajax({url: config.url.uploadImage2,
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            timeout: config.timeout,
            data: JSON.stringify(filesToSend),
            async: false,
            success: function (data, textStatus, request) {
                response = data;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                response = null;
            },
            complete: function(data)
            {
                document.location.href="#orderListPage";
            }
        });
    }

    $(document).on("click", ".orderAddBtn", function(){
        $(".overlay_progress").show();

        setTimeout(function() {
            var dataToPost = {
                req_subtype: parseInt($("#orderType").val()),
                //req_priority: rec.cr_req_priority,
                req_flat: parseInt($("#orderAddress").val()),
                note: $("#orderText").val(),
                userId: 1,
                req_status: 1,
                dead_line: 'null',
                sqlpath: 'insert_cit_req',
                t_language_id: 1,
                userMail: 1
            };

            $.ajax({
                url: config.url.insReq,
                type: 'post',
                timeout: config.timeout,
                contentType: 'application/json;charset=UTF-8',
                async: false,
                data: JSON.stringify(dataToPost),
                beforeSend : function(xhr, opts){
                    $(".overlay_progress").show();
                },
                success: function (result) {
                    var req_id = parseInt(result);
                    for(var i = 0; i < filesToSend.length; i++)
                    {
                        filesToSend[i].req_id = req_id;
                    }
                    sendImageXHR();                
                },
                error: function() {
                    alert("error occured while adding order");
                },
                complete: function(event,xhr,options) {
                    $(".overlay_progress").hide();
                }
            });
        }, 500);
    });

    $(document).on("keyup", "#passwordField", function(){
        if ($(this).val()) {
            $("#visiblePassword").addClass("visiblePassword-show");
        } else {
            $(this).attr("type", "password");
            $("#visiblePassword").removeClass("visiblePassword-show");
        }
    });

    $(document).on("click", "#visiblePassword", function(){
        var elem = $("#passwordField");
        var type = elem.attr("type");

        if (type == "password") {
            elem.attr("type", "text");
            $(".visiblePassword").css("background", "url('img/not-visible.png') center center no-repeat");
        }
        else {
            elem.attr("type", "password");
            $(".visiblePassword").css("background", "url('img/visible.png') center center no-repeat");
        } 
    });

    $(document).on("click", ".savePasswordCls", function(){
        if($("#savePassword").prop("checked")){
            $("#savePassword").prop("checked", false);
            config.savePassword = false;
        }
        else
        {
            $("#savePassword").prop("checked", true);
            config.savePassword = true;
        }
    });

    $(document).on("click", "ul.overlay-menu-list li a", function() {
        $(".overlay").fadeOut("slow", function() {
            $("#contextMenuOpenBtn").show();
        });
    });
    
});