/**
 * Version: 1.0
 * Author: Michael D'Souza
 */
;(function($, window, document, undefined) {

    var pluginName = 'Sidebar';
    var dataKey = "plugin_" + pluginName;

    var Plugin = function (element, options) {
        this.$element = $(element);
        this._name = pluginName;

        this.settings = {
            touchEvents: true,
            threshold: 20,
            backdrop: this.$element.find('.backdrop'),
            panel: this.$element.find('.panel'),
            touchEventsBreakpoint: 768
        };

        this.touchStartX = null;

        this.init(options);
    };

    Plugin.prototype = {
        init: function (options) {
            var self = this;

            // init settings
            this.settings = $.extend({}, this.settings, this.$element.data(), options);

            // touch events
            this.settings.panel.on('touchstart', function(e)    { self._onTouchStart(e); });
            this.settings.panel.on('touchend', function(e)      { self._onTouchEnd(e); });
            this.settings.panel.on('touchmove', function(e)     { self._onTouchMove(e); });

            // mouse events
            this.settings.panel.mousedown(function(e)           { self._onTouchStart(e); });
            this.settings.panel.mouseup(function(e)             { self._onTouchEnd(e); });
            this.settings.panel.mousemove(function(e)           { self._onTouchMove(e); });
            this.settings.panel.mouseleave(function(e)          { self._onTouchEnd(e); });

            this.settings.backdrop.click(function(e)            { self._onBackdropClick(e); });
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
            if (this.settings.touchEvents && window.innerWidth < this.settings.touchEventsBreakpoint) {
                var xPos = e.touches ? e.touches[0].pageX : e.pageX;
                this.touchStartX = xPos;
            }
        },


        /**
         * Touch end handler
         * @param { touch Event } e
         */
        _onTouchEnd: function(e) {
            if (this.settings.touchEvents && window.innerWidth < this.settings.touchEventsBreakpoint) {
                this.settings.panel.removeClass('no-transition');

                var xPos = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;

                if (this.touchStartX && xPos - this.touchStartX < -this.settings.threshold) {
                    this.settings.panel.css('left', '');
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
            if (this.settings.touchEvents && window.innerWidth < this.settings.touchEventsBreakpoint) {
                var xPos = e.touches ? e.touches[0].pageX : e.pageX;

                if (this.touchStartX) {
                    this.settings.panel.addClass('no-transition');
                    var move = Math.min(0, xPos - this.touchStartX);
                    this.settings.panel.css('left', move + 'px');
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
            this.settings.panel.css('left', '');
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