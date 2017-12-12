define(['knockout'], function (ko) {
    
        return {
            install: install
        };
    
        function install() {
            ko.bindingHandlers.preventDefaultTouchEvent = {
                update: function (element, valueAccessor) {
                    if(valueAccessor()) {
                        element.addEventListener("touchmove", preventBehavior, false);
                    }
                    
                    function preventBehavior(e) {
                        e.preventDefault(); 
                    };
                }
            };
        }
    })