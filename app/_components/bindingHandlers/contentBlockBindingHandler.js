define(['durandal/composition','knockout', 'helpers/documentBlock'], function (composition, ko, documentBlockHelper) {
    'use strict';
    
    return {
        install: install
    };
    
    function install(){
        ko.bindingHandlers.contentBlock = {
            init: function (element, valueAccessor) {
                var $element = $(element),
                    html = valueAccessor();

                var dataType = getContentBlockType(html);

                switch(dataType){
                    case 'hotspot': {
                        var hotspotOnImage = HotspotStorage.create($(html)[0]);
                        
						$element.html(hotspotOnImage.element);
                        $element.addClass('hotspot-container');

						ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
							HotspotStorage.remove(hotspotOnImage);
						});
                        break;
                    }
                    case 'document': {
                        var content = documentBlockHelper.getDocumentBlockContent(html);
                        $element.append(content);
                        break;
                    }
                    default:{
                        $element.html(html);
                        return ko.bindingHandlers.wrapElements.init(element, valueAccessor);
                    }
                }
            }
        };

        composition.addBindingHandler('contentBlock');

        function getContentBlockType(data) {
            var $output = $('<output>').html(data),
                dataType = $('[data-type]', $output).attr('data-type');

            return dataType;
        }
    }
});