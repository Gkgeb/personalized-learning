(function (app) {

    app.UserAccessModel = UserAccessModel;
    app.LogoModel = LogoModel;
    app.BackgroundModel = BackgroundModel;

    function UserAccessModel(userData) {
        this.hasStarterPlan = userData && userData.accessType > 0;
    }

    function LogoModel(logoSettings, saveChanges) {
        var that = this;

        that.url = ko.observable('');
        that.logoUrl = ko.observable('');
        that.clear = function () {
            that.url('');
            that.logoUrl('');
            saveChanges();
        };
        that.isError = ko.observable(false);
        that.isValidUrl = ko.observable(true);
        that.errorText = ko.observable('');
        that.errorDescription = ko.observable('');
        that.isLoading = ko.observable(false);
        that.hasLogo = ko.computed(function () {
            that.isError(false);
            return that.logoUrl() !== '';
        });

        that.setUrl = setUrl;
        that.setLogoUrl = setLogoUrl;
        that.getData = getData;

        that.upload = upload;

        that.validateUrl = validateUrl;

        init(logoSettings);

        return that;

        function init(logoSettings) {
            if (!logoSettings) {
                return;
            }
            that.setUrl(logoSettings.url);
            that.setLogoUrl(logoSettings.url);
        }

        function upload() {
            if (that.isLoading()) {
                return;
            }

            app.upload(function () {
                setLoadingStatus();
            }).done(function (url) {
                setUrl(url);
                setLogoUrl(url);
                setDefaultStatus();
                saveChanges();
            }).fail(function (reason) {
                setFailedStatus(reason.title, reason.description);
                saveChanges();
            });
        }

        function setDefaultStatus() {
            that.isLoading(false);
            that.isError(false);
        }

        function setFailedStatus(reasonTitle, reasonDescription) {
            that.clear();
            that.isLoading(false);
            that.isError(true);
            that.errorText(reasonTitle);
            that.errorDescription(reasonDescription);
        }

        function setLoadingStatus() {
            that.clear();
            that.isLoading(true);
        }

        function setUrl(url) {
            that.url(url || '');
        }

        function setLogoUrl(url) {
            that.logoUrl(url || '');
        }

        function getData() {
            return {
                url: that.logoUrl()
            };
        }

        function validateUrl(){
            url = that.url();
            if(!url) {
                that.setLogoUrl();
                that.isValidUrl(true);
            } else {
                return app.validateUrl(url).then(function(validUrl) {
                    if(!validUrl){
                        that.isValidUrl(false);
                        that.errorText(app.localize('httpIsNotAllowed'));
                        return; 
                    } 
                    
                    that.isValidUrl(true);
                    that.setLogoUrl(validUrl);
                    saveChanges();
                });
            }
        }
    }
    function BackgroundModel(backgroundSettings, saveChanges) {
        var settings = $.extend(true, {
            image: {
                src: null,
                type: 'fullscreen'
            }
        }, backgroundSettings);

        var that = this;
        that.image = ko.observable(settings.image.src);
        that.image.isUploading = ko.observable(false);
        that.image.isEmpty = ko.computed(function () {
            return !(that.image() && that.image().length > 0);
        });

        that.type = ko.observable(settings.image.type);
        that.type.fullscreen = function () {
            that.type('fullscreen');
            saveChanges();
        };
        that.type.repeat = function () {
            that.type('repeat');
            saveChanges();
        };
        that.type.original = function () {
            that.type('original');
            saveChanges();
        };

        that.errorTitle = ko.observable();
        that.errorDescription = ko.observable();
        that.hasError = ko.observable(false);

        that.changeImage = function () {
            if (that.image.isUploading()) {
                return;
            }

            app.upload(function () {
                that.image.isUploading(true);

                that.hasError(false);
                that.errorTitle(undefined);
                that.errorDescription(undefined);
            }).done(function (url) {
                that.image(url);
            }).fail(function (reason) {
                that.image(undefined);
                that.hasError(true);
                that.errorTitle(reason.title);
                that.errorDescription(reason.description);
            }).always(function () {
                that.image.isUploading(false);
                saveChanges();
            });
        };

        that.clearImage = function () {
            that.image(null);
            saveChanges();
        };

        that.getData = function () {
            return {
                image: {
                    src: that.image(),
                    type: that.type()
                }
            };
        };
    }

})(window.app = window.app || {});
