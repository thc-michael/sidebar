/**
 * Version: 0.1
 * Author: Michael D'Souza
 */
;(function($, window, document, undefined) {

    var pluginName = 'Sidebar';
    var dataKey = "plugin_" + pluginName;

    var Plugin = function (element, options) {
        this.$element = $(element);
        this._name = pluginName;

        this.baseSettings = {};
        this.settings = {
            touchEvents: true,
            threshold: 20,
            backdrop: '.backdrop',
            panel: '.panel',
            responsive: []
        };

        this.$backdrop;
        this.$panel;

        this.touchStartX = null;

        this.init(options);
    };

    Plugin.prototype = {
        init: function (options) {
            var self = this;

            // init settings
            // we need to keep a copy of the user's original settings as all settings can be overridden with responsive design
            this.baseSettings = $.extend({}, this.settings, this.$element.data(), options);
            this.refreshSettings();

            // touch events
            this.$panel.on('touchstart', function(e)    { self._onTouchStart(e); });
            this.$panel.on('touchend', function(e)      { self._onTouchEnd(e); });
            this.$panel.on('touchmove', function(e)     { self._onTouchMove(e); });

            // mouse events
            this.$panel.mousedown(function(e)           { self._onTouchStart(e); });
            this.$panel.mouseup(function(e)             { self._onTouchEnd(e); });
            this.$panel.mousemove(function(e)           { self._onTouchMove(e); });
            this.$panel.mouseleave(function(e)          { self._onTouchEnd(e); });

            this.$backdrop.click(function(e)            { self._onBackdropClick(e); });

            $(window).resize(function()                 { self._onWindowResize(); });
        },


        /**
         * Refreshes settings based on provided breakpoints
         */
        refreshSettings: function() {
            var self = this;

            // reinitialize settings with base settings
            this.settings = $.extend({}, this.baseSettings);

            this._setElements();

            // override settings based on breakpoints (mobile first)
            this.settings.responsive.forEach(function(item) {
                if (window.innerWidth >= item.breakpoint) {
                    self.settings = $.extend({}, self.settings, item.settings);

                    // elements
                    self._setElements();
                }
            });
        },


        _setElements: function() {
            this.$backdrop = this.$element.find(this.settings.backdrop);
            this.$panel = this.$element.find(this.settings.panel);
        },


        /**
         * Window resize handler
         */
        _onWindowResize: function () {
            if (this.settings.responsive.length) {
                this.refreshSettings();
            }
        },


        /**
         * Backdrop click handler
         * @param { click Event } e
         */
        _onBackdropClick: function(e) {
            this.close();
        },


        /**
         * Touch start handler
         * @param { touch Event } e
         */
        _onTouchStart: function(e) {
            if (this.settings.touchEvents) {
                var xPos = e.touches ? e.touches[0].pageX : e.pageX;
                this.touchStartX = xPos;
            }
        },


        /**
         * Touch end handler
         * @param { touch Event } e
         */
        _onTouchEnd: function(e) {
            if (this.settings.touchEvents) {
                this.$panel.removeClass('no-transition');

                var xPos = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;

                if (this.touchStartX && xPos - this.touchStartX < -this.settings.threshold) {
                    this.$panel.css('left', '');
                    this.close();
                }
                
                this.touchStartX = null;
            }
        },


        /**
         * Touch move handler
         * @param { touch Event } e
         */
        _onTouchMove: function(e) {
            if (this.settings.touchEvents) {
                var xPos = e.touches ? e.touches[0].pageX : e.pageX;

                if (this.touchStartX) {
                    this.$panel.addClass('no-transition');
                    var move = Math.min(0, xPos - this.touchStartX);
                    this.$panel.css('left', move + 'px');
                }

            }
        },


        /**
         * Opens sidebar
         */
        open: function() {
            this.$element.addClass('open');
        },


        /**
         * Closes sidebar
         */
        close: function() {
            this.$panel.css('left', '');
            this.$element.removeClass('open');
        },


        /**
         * Toggles between open/close state
         */
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