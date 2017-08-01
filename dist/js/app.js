; (function ($, window, document, undefined) {

    var pluginName = 'Sidebar';
    var dataKey = "plugin_" + pluginName;

    var Plugin = function (element, options) {
        this.$element = $(element);
        this._name = pluginName;

        this.settings = {
            hideOnSelect: true,
            toggleSelector: ''
        };

        this.$backdrop = this.$element.find('.backdrop');
        this.$panel = this.$element.find('.panel');

        this.init(options);
    };

    Plugin.prototype = {
        init: function (options) {
            var self = this;

            // init settings
            this.settings = $.extend(true, this.settings, this.$element.data(), options);

            if (this.settings.hideOnSelect) {
                this._initHideOnSelect();
            }

            if (this.settings.toggleSelector.length) {
                this._initToggleSelector();
            }

            this.$backdrop.click(function(e) { self._backdropClickHandler(e); });
        },

        _initHideOnSelect: function() {
            var self = this;
            this.$element.find('a').click(function(e) { 
                self.close(); 
            });
        },

        _initToggleSelector: function() {
            var self = this;
            $(this.settings.toggleSelector).click(function(e) { 
                e.preventDefault();
                self.toggle(); 
                return false;
            });
        },

        _backdropClickHandler: function (e) {
            this.close();
        },

        open: function() {
            this.$element.addClass('open');
        },

        close: function() {
            this.$element.removeClass('open');
        },

        toggle: function() {
            this.$element.toggleClass('open');
        }
    };

    $.fn[pluginName] = function (options) {
        var plugin = this.data(dataKey);
        if (plugin instanceof Plugin) {
            if (typeof options !== 'undefined') {
                plugin.init(options);
            }
        } else {
            plugin = new Plugin(this, options);
            this.data(dataKey, plugin);
        }
        return plugin;
    };

}(jQuery, window, document));