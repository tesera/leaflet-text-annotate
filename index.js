(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['leaflet'], factory);
    } else if (typeof module !== 'undefined') {
        // Node/CommonJS
        module.exports = factory(require('leaflet'));
    } else {
        // Browser globals
        if (typeof window.L === 'undefined') {
            throw new Error('Leaflet must be loaded first');
        }
        factory(window.L);
    }
}(function (L) {
    L.Control.TextAnnotate = L.Control.extend({
        options: {
            position: 'topleft'
        },

        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-control-textannotate leaflet-bar leaflet-control');

            this.link = L.DomUtil.create('a', 'leaflet-control-textannotate-button leaflet-bar-part leaflet-disabled', container);
            this.link.innerText = 'T';
            this.link.href = '#';

            this._map = map;

            L.DomEvent.on(this.link, 'click', this._toggle, this);

            return container;
        },

        _toggle: function (e) {
            e.preventDefault();
            e.stopPropagation();

            var map = this._map;

            if (L.DomUtil.hasClass(this.link, 'leaflet-disabled')) {
                L.DomUtil.removeClass(this.link, 'leaflet-disabled');
                map.on('click', this._showPopup, this);
            } else {
                L.DomUtil.addClass(this.link, 'leaflet-disabled');
                map.off('click', this._showPopup, this);
            }
        },

        _showPopup: function (e) {
            var map = this._map;
            var latlng = e.latlng;

            var wrapper = L.DomUtil.create('div');
            var input = L.DomUtil.create('input', null, wrapper);
            var saveBtn = L.DomUtil.create('button', null, wrapper);
            saveBtn.innerText = 'save';

            var popup = L.popup()
                .setLatLng(latlng)
                .setContent(wrapper)
                .openOn(map);

            L.DomEvent.on(saveBtn, 'click', function () {
                var val = input.value;
                map.closePopup();
                var marker = L.circleMarker(latlng, {radius: 2}).addTo(map);
                marker.bindTooltip(val, { permanent: true }).openTooltip();
            });
        }
    });

    L.Control.textAnnotate = function (options) {
        return new L.Control.TextAnnotate(options);
    };
}));