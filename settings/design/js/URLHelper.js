(function(app){
    app.validateUrl = function (url) {
        var defer = $.Deferred();
        if (isHttp(url)) {
            defer.resolve('');
        } else if (isHttps(url)) {
            defer.resolve(url);
        } else if (isUrl(url)) {
            return getElementAvailability(normalizeUrl(url)).then(function(isAvailable) {
                if(!isAvailable) {
                    return '';
                }

                return normalizeUrl(url);
            });        
        } else {    
            defer.resolve(''); 
        }
        return defer.promise();   
    }
    function isHttps(url) {
        return /^(?:https:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&\'\(\)\*\+,;=.%]+$/gm.test(url);
    }
    function isHttp(url) {
        return /^(?:http:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&\'\(\)\*\+,;=.%]+$/gm.test(url);
    }
    function isUrl(url) {
        return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&\'\(\)\*\+,;=.%]+$/gm.test(url);
    }
    function normalizeUrl(url) {
        return /^https/gm.test(url) ? url : 'https://' + url;
    }
    function getElementAvailability(url) {
        var defer = $.Deferred();
        $.ajax({ url: url, type: 'HEAD' })
            .then(function () {
                defer.resolve(true);
            }).fail(function () {
                defer.resolve(false);
            });
        return defer.promise();
    }
})(window.app = window.app || {});