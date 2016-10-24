var rhost="https://demo.topksk.kz/";
var config = {
    timeout: 15000,
    url : {
        current : rhost + "supplierProfile/employees/current",
        login : rhost + "login",
        notify_list : rhost + "sprav/other",
        register : rhost + "regist/register_user",
        restore_password : rhost + "auth?send_pass_reset_code&role_code=",
        uploadImage2 : rhost + "reqs/uploadImage2",
        insReq : rhost + "reqs/insreq",
        reqType: rhost + "sprav/main",
        orderList: rhost + "search/reqs",
        userAddresses: rhost + "sprav/other",
        imageUrl: rhost + "sprav/subid",
        logout: rhost + "logout",
        root: rhost
    },
    lang: function() {
        return (localStorage.getItem("lang") == "RUS") ? 1 : 2;
    },    
    guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },
    langList: {
        rus: "RUS",
        kaz: "KAZ"
    },
    authorized: false,
    savePassword: false,
    availableContextMenu: ["notifyListPage", "orderListPage", "orderLookUpPage", "notifyLookUpPage", "languagePage"]
};