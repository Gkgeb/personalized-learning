﻿define(['knockout'], function (ko) {

    return {
        install: install
    };
    function install() {
        ko.bindingHandlers.toggleVisible = {
            update: function (element, valueAccessor) {
                var $element = $(element),
                    isExpanded = valueAccessor().isExpanded,
                    $animationContainer = $element.find('[data-animate]'),
                    speed = 300;

                if (isExpanded()) {
                    $animationContainer.css('height', '').hide().slideDown(speed, function(){$animationContainer.css('overflow', '')});
                } else {
                    $animationContainer.css('overflow', 'hidden').animate({height: 0}, speed);
                }
            }
        }
    }
})