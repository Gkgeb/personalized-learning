define(['translation'],
    function(translation) {

        "use strict";

        var
            windowOperations = {
                alert: alert,
                close: close
            };

        return windowOperations;

        function alert(message) {
            window.alert(message);
        }

        function close(onClosed) {
            window.close();
            _.delay(function () {
                if (onClosed) {
                    onClosed();
                }
                if (!inIframe()) {
                    window.alert(translation.getTextByKey('[thank you message]'));
                }
            }, 100);
        }
        
        function inIframe() {
            // browsers can block access to window.top due to same origin policy, so exception can be thrown here.
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        }
    }
);