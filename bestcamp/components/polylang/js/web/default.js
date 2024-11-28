;(function (window, document, $, polylangConfig) {
    var Polylang = function (options) {
        this.options = {
            actionUrl: '/assets/components/polylang/action.php',
            trigger: 'polylang-toggle',
        };
        this.options = $.extend(this.options, options || {});
        this.setup();
    };
    Polylang.prototype.setup = function () {
        this.$doc = $(document);
        this.bindEvents();
    };
    Polylang.prototype.bindEvents = function () {
        var self = this;
        this.$doc.on('click', '.' + this.options.trigger, function (e) {
            e.preventDefault();
            var $this = $(this);
            self.toggleLanguage($this.attr('href'), $this.data('id'));
        });
    };
    Polylang.prototype.toggleLanguage = function (url, id) {
        if (url == undefined) return;
        $.ajax({
            dataType: 'json',
            type: 'POST',
            cache: false,
            url: this.options.actionUrl,
            data: {
                id: id,
                action: 'language/toggle',
            },
            complete: function (e) {
                window.location.href = url;
            },
            error: function (e) {
                console.error('error toggle language', e);
            }
        });
    };
    $(document).ready(function () {
        var polylang = new Polylang(polylangConfig || {});
    });
})(window, document, jQuery, polylangConfig);