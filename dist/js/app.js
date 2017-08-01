; (function ($, window, document, undefined) {

    var pluginName = 'Sidebar';
    var dataKey = "plugin_" + pluginName;

    var Plugin = function (element, options) {
        this.$element = $(element);
        this._name = pluginName;

        this.settings = {
            hideOnSelect: true,
            toggleSelector: '',
            threshold: 20
        };

        this.$backdrop = this.$element.find('.backdrop');
        this.$panel = this.$element.find('.panel');

        this.touchStartX = null;

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

            // touch events
            this.$panel.bind('touchstart', function(e)  { self._onTouchStart(e); });
            this.$panel.bind('touchend', function(e)    { self._onTouchEnd(e); });
            this.$panel.bind('touchmove', function(e)   { self._onTouchMove(e); });

            // mouse events
            this.$panel.mousedown(function(e)           { self._onTouchStart(e); });
            this.$panel.mouseup(function(e)             { self._onTouchEnd(e); });
            this.$panel.mousemove(function(e)           { self._onTouchMove(e); });
            this.$panel.mouseleave(function(e)          { self._onTouchEnd(e); });

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

        _backdropClickHandler: function(e) {
            this.close();
        },

        _onTouchStart: function(e) {
            e.preventDefault();
            var xPos = e.touches ? e.touches[0].pageX : e.pageX;
            this.touchStartX = xPos;
            return false;
        },

        _onTouchEnd: function(e) {
            e.preventDefault();

            this.$panel.removeClass('no-transition');

            var xPos = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;

            if (this.touchStartX && xPos - this.touchStartX < -this.settings.threshold) {
                this.$panel.css('left', '');
                this.close();
            }
            
            this.touchStartX = null;

            return false;
        },

        _onTouchMove: function (e) {
            e.preventDefault();

            var xPos = e.touches ? e.touches[0].pageX : e.pageX;

            if (this.touchStartX) {
                this.$panel.addClass('no-transition');
                var move = Math.min(0, xPos - this.touchStartX);
                this.$panel.css('left', move + 'px');
            }

            return false;
        },

        open: function() {
            this.$element.addClass('open');
        },

        close: function() {
            this.$panel.css('left', '');
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