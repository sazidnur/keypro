L.Control.Fullscreen = L.Control.extend({ options: { position: "topleft", title: { "false": "View Fullscreen", "true": "Exit Fullscreen" } }, onAdd: function (map) { var container = L.DomUtil.create("div", "leaflet-control-fullscreen leaflet-bar leaflet-control"); this.link = L.DomUtil.create("a", "leaflet-control-fullscreen-button leaflet-bar-part", container); this.link.href = "#"; this._map = map; this._map.on("fullscreenchange", this._toggleTitle, this); this._toggleTitle(); L.DomEvent.on(this.link, "click", this._click, this); return container }, _click: function (e) { L.DomEvent.stopPropagation(e); L.DomEvent.preventDefault(e); this._map.toggleFullscreen(this.options) }, _toggleTitle: function () { this.link.title = this.options.title[this._map.isFullscreen()] } }); L.Map.include({ isFullscreen: function () { return this._isFullscreen || false }, toggleFullscreen: function (options) { var container = this.getContainer(); if (this.isFullscreen()) { if (options && options.pseudoFullscreen) { this._disablePseudoFullscreen(container) } else if (document.exitFullscreen) { document.exitFullscreen() } else if (document.mozCancelFullScreen) { document.mozCancelFullScreen() } else if (document.webkitCancelFullScreen) { document.webkitCancelFullScreen() } else if (document.msExitFullscreen) { document.msExitFullscreen() } else { this._disablePseudoFullscreen(container) } } else { if (options && options.pseudoFullscreen) { this._enablePseudoFullscreen(container) } else if (container.requestFullscreen) { container.requestFullscreen() } else if (container.mozRequestFullScreen) { container.mozRequestFullScreen() } else if (container.webkitRequestFullscreen) { container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT) } else if (container.msRequestFullscreen) { container.msRequestFullscreen() } else { this._enablePseudoFullscreen(container) } } }, _enablePseudoFullscreen: function (container) { L.DomUtil.addClass(container, "leaflet-pseudo-fullscreen"); this._setFullscreen(true); this.invalidateSize(); this.fire("fullscreenchange") }, _disablePseudoFullscreen: function (container) { L.DomUtil.removeClass(container, "leaflet-pseudo-fullscreen"); this._setFullscreen(false); this.invalidateSize(); this.fire("fullscreenchange") }, _setFullscreen: function (fullscreen) { this._isFullscreen = fullscreen; var container = this.getContainer(); if (fullscreen) { L.DomUtil.addClass(container, "leaflet-fullscreen-on") } else { L.DomUtil.removeClass(container, "leaflet-fullscreen-on") } }, _onFullscreenChange: function (e) { var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement; if (fullscreenElement === this.getContainer() && !this._isFullscreen) { this._setFullscreen(true); this.fire("fullscreenchange") } else if (fullscreenElement !== this.getContainer() && this._isFullscreen) { this._setFullscreen(false); this.fire("fullscreenchange") } } }); L.Map.mergeOptions({ fullscreenControl: false }); L.Map.addInitHook(function () { if (this.options.fullscreenControl) { this.fullscreenControl = new L.Control.Fullscreen(this.options.fullscreenControl); this.addControl(this.fullscreenControl) } var fullscreenchange; if ("onfullscreenchange" in document) { fullscreenchange = "fullscreenchange" } else if ("onmozfullscreenchange" in document) { fullscreenchange = "mozfullscreenchange" } else if ("onwebkitfullscreenchange" in document) { fullscreenchange = "webkitfullscreenchange" } else if ("onmsfullscreenchange" in document) { fullscreenchange = "MSFullscreenChange" } if (fullscreenchange) { var onFullscreenChange = L.bind(this._onFullscreenChange, this); this.whenReady(function () { L.DomEvent.on(document, fullscreenchange, onFullscreenChange) }); this.on("unload", function () { L.DomEvent.off(document, fullscreenchange, onFullscreenChange) }) } }); L.control.fullscreen = function (options) { return new L.Control.Fullscreen(options) };

/*! Version: 0.78.0
Copyright (c) 2016 Dominik Moritz */
!function (t, i) { "function" == typeof define && define.amd ? define(["leaflet"], t) : "object" == typeof exports && (void 0 !== i && i.L ? module.exports = t(L) : module.exports = t(require("leaflet"))), void 0 !== i && i.L && (i.L.Control.Locate = t(L)) }(function (l) { const s = (i, s, t) => { (t = t.split(" ")).forEach(function (t) { l.DomUtil[i].call(this, s, t) }) }, i = (t, i) => s("addClass", t, i), o = (t, i) => s("removeClass", t, i); var t = l.Marker.extend({ initialize(t, i) { l.Util.setOptions(this, i), this._latlng = t, this.createIcon() }, createIcon() { var t = this.options; let i = ""; void 0 !== t.color && (i += `stroke:${t.color};`), void 0 !== t.weight && (i += `stroke-width:${t.weight};`), void 0 !== t.fillColor && (i += `fill:${t.fillColor};`), void 0 !== t.fillOpacity && (i += `fill-opacity:${t.fillOpacity};`), void 0 !== t.opacity && (i += `opacity:${t.opacity};`); t = this._getIconSVG(t, i); this._locationIcon = l.divIcon({ className: t.className, html: t.svg, iconSize: [t.w, t.h] }), this.setIcon(this._locationIcon) }, _getIconSVG(t, i) { var s = t.radius, t = s + t.weight, o = 2 * t; return { className: "leaflet-control-locate-location", svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${o}" version="1.1" viewBox="-${t} -${t} ${o} ${o}">` + '<circle r="' + s + '" style="' + i + '" /></svg>', w: o, h: o } }, setStyle(t) { l.Util.setOptions(this, t), this.createIcon() } }), e = t.extend({ initialize(t, i, s) { l.Util.setOptions(this, s), this._latlng = t, this._heading = i, this.createIcon() }, setHeading(t) { this._heading = t }, _getIconSVG(t, i) { var s = t.radius, o = t.width + t.weight, s = 2 * (s + t.depth + t.weight), t = `M0,0 l${t.width / 2},${t.depth} l-${o},0 z`; return { className: "leaflet-control-locate-heading", svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${s}" version="1.1" viewBox="-${o / 2} 0 ${o} ${s}" style="${`transform: rotate(${this._heading}deg)`}">` + '<path d="' + t + '" style="' + i + '" /></svg>', w: o, h: s } } }), t = l.Control.extend({ options: { position: "topleft", layer: void 0, setView: "untilPanOrZoom", keepCurrentZoomLevel: !1, initialZoomLevel: !1, getLocationBounds(t) { return t.bounds }, flyTo: !1, clickBehavior: { inView: "stop", outOfView: "setView", inViewNotFollowing: "inView" }, returnToPrevBounds: !1, cacheLocation: !0, drawCircle: !0, drawMarker: !0, showCompass: !0, markerClass: t, compassClass: e, circleStyle: { className: "leaflet-control-locate-circle", color: "#136AEC", fillColor: "#136AEC", fillOpacity: .15, weight: 0 }, markerStyle: { className: "leaflet-control-locate-marker", color: "#fff", fillColor: "#2A93EE", fillOpacity: 1, weight: 3, opacity: 1, radius: 9 }, compassStyle: { fillColor: "#2A93EE", fillOpacity: 1, weight: 0, color: "#fff", opacity: 1, radius: 9, width: 9, depth: 6 }, followCircleStyle: {}, followMarkerStyle: {}, followCompassStyle: {}, icon: "leaflet-control-locate-location-arrow", iconLoading: "leaflet-control-locate-spinner", iconElementTag: "span", textElementTag: "small", circlePadding: [0, 0], metric: !0, createButtonCallback(t, i) { var t = l.DomUtil.create("a", "leaflet-bar-part leaflet-bar-part-single", t), s = (t.title = i.strings.title, t.href = "#", t.setAttribute("role", "button"), l.DomUtil.create(i.iconElementTag, i.icon, t)); return void 0 !== i.strings.text && (l.DomUtil.create(i.textElementTag, "leaflet-locate-text", t).textContent = i.strings.text, t.classList.add("leaflet-locate-text-active"), t.parentNode.style.display = "flex", 0 < i.icon.length) && s.classList.add("leaflet-locate-icon"), { link: t, icon: s } }, onLocationError(t, i) { alert(t.message) }, onLocationOutsideMapBounds(t) { t.stop(), alert(t.options.strings.outsideMapBoundsMsg) }, showPopup: !0, strings: { title: "Show me where I am", metersUnit: "meters", feetUnit: "feet", popup: "You are within {distance} {unit} from this point", outsideMapBoundsMsg: "You seem located outside the boundaries of the map" }, locateOptions: { maxZoom: 1 / 0, watch: !0, setView: !1 } }, initialize(t) { for (const i in t) "object" == typeof this.options[i] ? l.extend(this.options[i], t[i]) : this.options[i] = t[i]; this.options.followMarkerStyle = l.extend({}, this.options.markerStyle, this.options.followMarkerStyle), this.options.followCircleStyle = l.extend({}, this.options.circleStyle, this.options.followCircleStyle), this.options.followCompassStyle = l.extend({}, this.options.compassStyle, this.options.followCompassStyle) }, onAdd(t) { var i = l.DomUtil.create("div", "leaflet-control-locate leaflet-bar leaflet-control"), t = (this._container = i, this._map = t, this._layer = this.options.layer || new l.LayerGroup, this._layer.addTo(t), this._event = void 0, this._compassHeading = null, this._prevBounds = null, this.options.createButtonCallback(i, this.options)); return this._link = t.link, this._icon = t.icon, l.DomEvent.on(this._link, "click", function (t) { l.DomEvent.stopPropagation(t), l.DomEvent.preventDefault(t), this._onClick() }, this).on(this._link, "dblclick", l.DomEvent.stopPropagation), this._resetVariables(), this._map.on("unload", this._unload, this), i }, _onClick() { this._justClicked = !0; var i = this._isFollowing(); if (this._userPanned = !1, this._userZoomed = !1, this._active && !this._event) this.stop(); else if (this._active) { var s = this.options.clickBehavior; let t = s.outOfView; switch (t = s[t = this._map.getBounds().contains(this._event.latlng) ? i ? s.inView : s.inViewNotFollowing : t] ? s[t] : t) { case "setView": this.setView(); break; case "stop": this.stop(), this.options.returnToPrevBounds && (this.options.flyTo ? this._map.flyToBounds : this._map.fitBounds).bind(this._map)(this._prevBounds) } } else this.options.returnToPrevBounds && (this._prevBounds = this._map.getBounds()), this.start(); this._updateContainerStyle() }, start() { this._activate(), this._event && (this._drawMarker(this._map), this.options.setView) && this.setView(), this._updateContainerStyle() }, stop() { this._deactivate(), this._cleanClasses(), this._resetVariables(), this._removeMarker() }, stopFollowing() { this._userPanned = !0, this._updateContainerStyle(), this._drawMarker() }, _activate() { if (!this._active && (this._map.locate(this.options.locateOptions), this._map.fire("locateactivate", this), this._active = !0, this._map.on("locationfound", this._onLocationFound, this), this._map.on("locationerror", this._onLocationError, this), this._map.on("dragstart", this._onDrag, this), this._map.on("zoomstart", this._onZoom, this), this._map.on("zoomend", this._onZoomEnd, this), this.options.showCompass)) { const t = "ondeviceorientationabsolute" in window; if (t || "ondeviceorientation" in window) { const i = this, s = function () { l.DomEvent.on(window, t ? "deviceorientationabsolute" : "deviceorientation", i._onDeviceOrientation, i) }; DeviceOrientationEvent && "function" == typeof DeviceOrientationEvent.requestPermission ? DeviceOrientationEvent.requestPermission().then(function (t) { "granted" === t && s() }) : s() } } }, _deactivate() { this._map.stopLocate(), this._map.fire("locatedeactivate", this), this._active = !1, this.options.cacheLocation || (this._event = void 0), this._map.off("locationfound", this._onLocationFound, this), this._map.off("locationerror", this._onLocationError, this), this._map.off("dragstart", this._onDrag, this), this._map.off("zoomstart", this._onZoom, this), this._map.off("zoomend", this._onZoomEnd, this), this.options.showCompass && (this._compassHeading = null, "ondeviceorientationabsolute" in window ? l.DomEvent.off(window, "deviceorientationabsolute", this._onDeviceOrientation, this) : "ondeviceorientation" in window && l.DomEvent.off(window, "deviceorientation", this._onDeviceOrientation, this)) }, setView() { var t; this._drawMarker(), this._isOutsideMapBounds() ? (this._event = void 0, this.options.onLocationOutsideMapBounds(this)) : this._justClicked && !1 !== this.options.initialZoomLevel ? (t = this.options.flyTo ? this._map.flyTo : this._map.setView).bind(this._map)([this._event.latitude, this._event.longitude], this.options.initialZoomLevel) : this.options.keepCurrentZoomLevel ? (t = this.options.flyTo ? this._map.flyTo : this._map.panTo).bind(this._map)([this._event.latitude, this._event.longitude]) : (t = this.options.flyTo ? this._map.flyToBounds : this._map.fitBounds, this._ignoreEvent = !0, t.bind(this._map)(this.options.getLocationBounds(this._event), { padding: this.options.circlePadding, maxZoom: this.options.initialZoomLevel || this.options.locateOptions.maxZoom }), l.Util.requestAnimFrame(function () { this._ignoreEvent = !1 }, this)) }, _drawCompass() { var t, i; this._event && (t = this._event.latlng, this.options.showCompass && t && null !== this._compassHeading && (i = this._isFollowing() ? this.options.followCompassStyle : this.options.compassStyle, this._compass ? (this._compass.setLatLng(t), this._compass.setHeading(this._compassHeading), this._compass.setStyle && this._compass.setStyle(i)) : this._compass = new this.options.compassClass(t, this._compassHeading, i).addTo(this._layer)), !this._compass || this.options.showCompass && null !== this._compassHeading || (this._compass.removeFrom(this._layer), this._compass = null)) }, _drawMarker() { void 0 === this._event.accuracy && (this._event.accuracy = 0); var t, i = this._event.accuracy, s = this._event.latlng; this.options.drawCircle && (t = this._isFollowing() ? this.options.followCircleStyle : this.options.circleStyle, this._circle ? this._circle.setLatLng(s).setRadius(i).setStyle(t) : this._circle = l.circle(s, i, t).addTo(this._layer)); let o, e; e = this.options.metric ? (o = i.toFixed(0), this.options.strings.metersUnit) : (o = (3.2808399 * i).toFixed(0), this.options.strings.feetUnit), this.options.drawMarker && (t = this._isFollowing() ? this.options.followMarkerStyle : this.options.markerStyle, this._marker ? (this._marker.setLatLng(s), this._marker.setStyle && this._marker.setStyle(t)) : this._marker = new this.options.markerClass(s, t).addTo(this._layer)), this._drawCompass(); const n = this.options.strings.popup; function a() { return "string" == typeof n ? l.Util.template(n, { distance: o, unit: e }) : "function" == typeof n ? n({ distance: o, unit: e }) : n } this.options.showPopup && n && this._marker && this._marker.bindPopup(a())._popup.setLatLng(s), this.options.showPopup && n && this._compass && this._compass.bindPopup(a())._popup.setLatLng(s) }, _removeMarker() { this._layer.clearLayers(), this._marker = void 0, this._circle = void 0 }, _unload() { this.stop(), this._map.off("unload", this._unload, this) }, _setCompassHeading(t) { !isNaN(parseFloat(t)) && isFinite(t) ? (t = Math.round(t), this._compassHeading = t, l.Util.requestAnimFrame(this._drawCompass, this)) : this._compassHeading = null }, _onCompassNeedsCalibration() { this._setCompassHeading() }, _onDeviceOrientation(t) { this._active && (t.webkitCompassHeading ? this._setCompassHeading(t.webkitCompassHeading) : t.absolute && t.alpha && this._setCompassHeading(360 - t.alpha)) }, _onLocationError(t) { 3 == t.code && this.options.locateOptions.watch || (this.stop(), this.options.onLocationError(t, this)) }, _onLocationFound(t) { if ((!this._event || this._event.latlng.lat !== t.latlng.lat || this._event.latlng.lng !== t.latlng.lng || this._event.accuracy !== t.accuracy) && this._active) { switch (this._event = t, this._drawMarker(), this._updateContainerStyle(), this.options.setView) { case "once": this._justClicked && this.setView(); break; case "untilPan": this._userPanned || this.setView(); break; case "untilPanOrZoom": this._userPanned || this._userZoomed || this.setView(); break; case "always": this.setView() }this._justClicked = !1 } }, _onDrag() { this._event && !this._ignoreEvent && (this._userPanned = !0, this._updateContainerStyle(), this._drawMarker()) }, _onZoom() { this._event && !this._ignoreEvent && (this._userZoomed = !0, this._updateContainerStyle(), this._drawMarker()) }, _onZoomEnd() { this._event && this._drawCompass(), this._event && !this._ignoreEvent && this._marker && !this._map.getBounds().pad(-.3).contains(this._marker.getLatLng()) && (this._userPanned = !0, this._updateContainerStyle(), this._drawMarker()) }, _isFollowing() { return !!this._active && ("always" === this.options.setView || ("untilPan" === this.options.setView ? !this._userPanned : "untilPanOrZoom" === this.options.setView ? !this._userPanned && !this._userZoomed : void 0)) }, _isOutsideMapBounds() { return void 0 !== this._event && this._map.options.maxBounds && !this._map.options.maxBounds.contains(this._event.latlng) }, _updateContainerStyle() { this._container && (this._active && !this._event ? this._setClasses("requesting") : this._isFollowing() ? this._setClasses("following") : this._active ? this._setClasses("active") : this._cleanClasses()) }, _setClasses(t) { "requesting" == t ? (o(this._container, "active following"), i(this._container, "requesting"), o(this._icon, this.options.icon), i(this._icon, this.options.iconLoading)) : "active" == t ? (o(this._container, "requesting following"), i(this._container, "active"), o(this._icon, this.options.iconLoading), i(this._icon, this.options.icon)) : "following" == t && (o(this._container, "requesting"), i(this._container, "active following"), o(this._icon, this.options.iconLoading), i(this._icon, this.options.icon)) }, _cleanClasses() { l.DomUtil.removeClass(this._container, "requesting"), l.DomUtil.removeClass(this._container, "active"), l.DomUtil.removeClass(this._container, "following"), o(this._icon, this.options.iconLoading), i(this._icon, this.options.icon) }, _resetVariables() { this._active = !1, this._justClicked = !1, this._userPanned = !1, this._userZoomed = !1 } }); return l.control.locate = t => new l.Control.Locate(t), t }, window);
//# sourceMappingURL=L.Control.Locate.min.js.map

/*!
 * 
 *  leaflet.browser.print - v2.0.2 (https://github.com/Igor-Vladyka/leaflet.browser.print) 
 *  A leaflet plugin which allows users to print the map directly from the browser
 *  
 *  MIT (http://www.opensource.org/licenses/mit-license.php)
 *  (c) 2022  Igor Vladyka <igor.vladyka@gmail.com> (https://github.com/Igor-Vladyka/)
 * 
*/!function (t) { var e = {}; function i(n) { if (e[n]) return e[n].exports; var r = e[n] = { i: n, l: !1, exports: {} }; return t[n].call(r.exports, r, r.exports, i), r.l = !0, r.exports } i.m = t, i.c = e, i.d = function (t, e, n) { i.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n }) }, i.r = function (t) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 }) }, i.t = function (t, e) { if (1 & e && (t = i(t)), 8 & e) return t; if (4 & e && "object" == typeof t && t && t.__esModule) return t; var n = Object.create(null); if (i.r(n), Object.defineProperty(n, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t) for (var r in t) i.d(n, r, function (e) { return t[e] }.bind(null, r)); return n }, i.n = function (t) { var e = t && t.__esModule ? function () { return t.default } : function () { return t }; return i.d(e, "a", e), e }, i.o = function (t, e) { return Object.prototype.hasOwnProperty.call(t, e) }, i.p = "", i(i.s = 0) }([function (t, e, i) { i(1), i(2), i(3), i(4), i(5), t.exports = i(6) }, function (t, e) { L.BrowserPrint = L.Class.extend({ options: { documentTitle: "", printLayer: null, closePopupsOnPrint: !0, contentSelector: "[leaflet-browser-print-content]", pagesSelector: "[leaflet-browser-print-pages]", manualMode: !1, customPrintStyle: { color: "gray", dashArray: "5, 10", pane: "customPrintPane" }, cancelWithEsc: !0, printFunction: window.print, debug: !1 }, initialize: function (t, e) { this._map = t, L.setOptions(this, e), this.options.customPrintStyle.pane && !t.getPane(this.options.customPrintStyle.pane) && (t.createPane(this.options.customPrintStyle.pane).style.zIndex = 9999), document.getElementById("browser-print-css") || this._appendControlStyles(document.head) }, cancel: function () { this._printCancel() }, print: function (t) { t.options.action(this, t)(t) }, _getMode: function (t, e) { return new L.BrowserPrint.Mode(t, e.options) }, _printLandscape: function (t) { this._addPrintClassToContainer(this._map, "leaflet-browser-print--landscape"), this._print(t) }, _printPortrait: function (t) { this._addPrintClassToContainer(this._map, "leaflet-browser-print--portrait"), this._print(t) }, _printAuto: function (t) { this._addPrintClassToContainer(this._map, "leaflet-browser-print--auto"); var e, i = this._getBoundsForAllVisualLayers(); e = "Portrait" === t.options.orientation || "Landscape" === t.options.orientation ? t.options.orientation : this._getPageSizeFromBounds(i), this._print(this._getMode(e, t), i) }, _printCustom: function (t, e) { this._addPrintClassToContainer(this._map, "leaflet-browser-print--custom"), this.options.custom = { mode: t, options: e }, this._map.on("mousedown", this._startAutoPolygon, this) }, _addPrintClassToContainer: function (t, e) { var i = t.getContainer(); -1 === i.className.indexOf(e) && (i.className += " " + e) }, _removePrintClassFromContainer: function (t, e) { var i = t.getContainer(); i.className && i.className.indexOf(e) > -1 && (i.className = i.className.replace(" " + e, "")) }, _startAutoPolygon: function (t) { L.DomEvent.stop(t), this._map.dragging.disable(), this.options.custom.start = t.latlng, this._map.getPane(this.options.customPrintStyle.pane).style.display = "initial", this._map.off("mousedown", this._startAutoPolygon, this), this._map.on("mousemove", this._moveAutoPolygon, this), this._map.on("mouseup", this._endAutoPolygon, this) }, _moveAutoPolygon: function (t) { this.options.custom && (L.DomEvent.stop(t), this.options.custom.rectangle ? this.options.custom.rectangle.setBounds(L.latLngBounds(this.options.custom.start, t.latlng)) : this.options.custom.rectangle = L.rectangle([this.options.custom.start, t.latlng], this.options.customPrintStyle), this.options.custom.rectangle.addTo(this._map)) }, _endAutoPolygon: function (t) { if (L.DomEvent.stop(t), this._removeAutoPolygon(), this.options.custom && this.options.custom.rectangle) { var e, i = this.options.custom.rectangle.getBounds(); this._map.removeLayer(this.options.custom.rectangle), e = "Portrait" === this.options.custom.mode.options.orientation || "Landscape" === this.options.custom.mode.options.orientation ? this.options.custom.mode.options.orientation : this._getPageSizeFromBounds(i), this._print(this._getMode(e, this.options.custom.mode), i), delete this.options.custom } else this._clearPrint() }, _removeAutoPolygon: function () { this._map.off("mousedown", this._startAutoPolygon, this), this._map.off("mousemove", this._moveAutoPolygon, this), this._map.off("mouseup", this._endAutoPolygon, this), this._map.dragging.enable(), this._map.getPane(this.options.customPrintStyle.pane).style.display = "none" }, _getPageSizeFromBounds: function (t) { return Math.abs(t.getNorth() - t.getSouth()) > Math.abs(t.getEast() - t.getWest()) ? "Portrait" : "Landscape" }, _setupPrintPagesWidth: function (t, e, i) { t.style.width = "Landscape" === i ? e.Height : e.Width }, _setupPrintMapHeight: function (t, e, i, n) { var r = n.header && n.header.enabled && n.header.size && !n.header.overTheMap ? n.header.size + " - 1mm" : "0mm", o = n.footer && n.footer.enabled && n.footer.size && !n.footer.overTheMap ? n.footer.size + " - 1mm" : "0mm"; t.style.height = "calc(" + ("Landscape" === i ? e.Width : e.Height) + " - " + r + " - " + o + ")" }, _printCancel: function () { clearInterval(self.printInterval), L.DomEvent.off(document, "keyup", this._keyUpCancel, this); var t = this.activeMode; delete this.options.custom, this._removeAutoPolygon(), this.activeMode = null, delete this.cancelNextPrinting, this._map.fire(L.BrowserPrint.Event.PrintCancel, { mode: t }), this._printEnd() }, _keyUpCancel: function (t) { 27 === t.which && this.cancel() }, _printMode: function (t) { this._map.isPrinting ? console.error("printing is already active") : (this._map.isPrinting = !0, this.cancelNextPrinting = !1, this.activeMode = t, this["_print" + t.mode](t)) }, _print: function (t, e) { this._map.fire(L.BrowserPrint.Event.PrintInit, { mode: t }), this.options.cancelWithEsc && L.DomEvent.on(document, "keyup", this._keyUpCancel, this), L.BrowserPrint.Utils.initialize(); var i = this, n = this._map.getContainer(), r = t.options, o = r.orientation, s = { bounds: e || this._map.getBounds(), width: n.style.width, height: n.style.height, documentTitle: document.title, printLayer: L.BrowserPrint.Utils.cloneLayer(this.options.printLayer), panes: [] }, a = this._map.getPanes(); for (var p in a) s.panes.push({ name: p, container: void 0 }); if (s.printObjects = this._getPrintObjects(s.printLayer), this._map.fire(L.BrowserPrint.Event.PrePrint, { printLayer: s.printLayer, printObjects: s.printObjects, pageOrientation: o, printMode: r.mode, pageBounds: s.bounds }), this.cancelNextPrinting) this._printCancel(); else { var l = this._addPrintMapOverlay(t, o, s); this.options.documentTitle && (document.title = this.options.documentTitle), this._map.fire(L.BrowserPrint.Event.PrintStart, { printLayer: s.printLayer, printMap: l.map, printObjects: l.objects }), r.invalidateBounds ? (l.map.fitBounds(s.bounds, l.map.options), l.map.invalidateSize({ reset: !0, animate: !1, pan: !1 })) : l.map.setView(this._map.getCenter(), this._map.getZoom()), r.zoom ? l.map.setZoom(r.zoom) : r.enableZoom || l.map.setZoom(this._map.getZoom()), this.options.debug || (this.printInterval = setInterval((function () { i.cancelNextPrinting || !i._map.isPrinting ? clearInterval(i.printInterval) : i._map.isPrinting && !i._isTilesLoading(l.map) && (clearInterval(i.printInterval), i.options.manualMode ? i._setupManualPrintButton(l.map, s, l.objects) : i._completePrinting(l.map, s, l.objects)) }), 50)) } }, _completePrinting: function (t, e, i) { var n = this; setTimeout((function () { if (n._map.isPrinting) { n._map.fire(L.BrowserPrint.Event.Print, { printLayer: e.printLayer, printMap: t, printObjects: i }); var r = (n.options.printFunction || window.print)(); r ? Promise.all([r]).then((function () { n._printEnd(t, e), n._map.fire(L.BrowserPrint.Event.PrintEnd, { printLayer: e.printLayer, printMap: t, printObjects: i }) })) : (n._printEnd(t, e), n._map.fire(L.BrowserPrint.Event.PrintEnd, { printLayer: e.printLayer, printMap: t, printObjects: i })) } }), 1e3) }, _getBoundsForAllVisualLayers: function () { var t = null; for (var e in this._map._layers) { var i = this._map._layers[e]; i._url || i._mutant || (t ? i.getBounds ? t.extend(i.getBounds()) : i.getLatLng && t.extend(i.getLatLng()) : i.getBounds ? t = i.getBounds() : i.getLatLng && (t = L.latLngBounds(i.getLatLng(), i.getLatLng()))) } return t && t._southWest || (t = this._map.getBounds()), t }, _clearPrint: function () { this._removePrintClassFromContainer(this._map, "leaflet-browser-print--landscape"), this._removePrintClassFromContainer(this._map, "leaflet-browser-print--portrait"), this._removePrintClassFromContainer(this._map, "leaflet-browser-print--auto"), this._removePrintClassFromContainer(this._map, "leaflet-browser-print--custom") }, _printEnd: function (t, e) { this._clearPrint(), t && (t.remove(), t = null), this.__overlay__ && (document.body.removeChild(this.__overlay__), this.__overlay__ = null), document.body.className = document.body.className.replace(" leaflet--printing", ""), this.options.documentTitle && (document.title = e.documentTitle), this._map.invalidateSize({ reset: !0, animate: !1, pan: !1 }), this._map.isPrinting = !1 }, _getPrintObjects: function (t) { var e = {}; for (var i in this._map._layers) { var n = this._map._layers[i]; if (!t || !n._url || n instanceof L.TileLayer.WMS) { var r = L.BrowserPrint.Utils.getType(n); r && (e[r] || (e[r] = []), e[r].push(n)) } } return e }, _addPrintCss: function (t, e, i) { var n = document.createElement("style"); if (n.className = "leaflet-browser-print-css", n.setAttribute("type", "text/css"), n.innerHTML = " @media print { .leaflet-popup-content-wrapper, .leaflet-popup-tip { box-shadow: none; }", n.innerHTML += " .leaflet-browser-print--manualMode-button { display: none; }", n.innerHTML += " * { -webkit-print-color-adjust: exact!important; printer-colors: exact!important; color-adjust: exact!important; }", e) { var r = e.top + " " + e.right + " " + e.bottom + " " + e.left; n.innerHTML += " @page { margin: " + r + "; }" } switch (n.innerHTML += " @page :first { page-break-after: always; }", i) { case "Landscape": n.innerText += " @page { size : " + t + " landscape; }"; break; default: case "Portrait": n.innerText += " @page { size : " + t + " portrait; }" }return n }, _addPrintMapOverlay: function (t, e, i) { if (this.__overlay__ = document.createElement("div"), this.__overlay__.className = this._map.getContainer().className + " leaflet-print-overlay", document.body.appendChild(this.__overlay__), this.options.debug) { var n = L.DomUtil.create("button", "", this.__overlay__); n.innerHTML = "Cancel", L.DomEvent.on(n, "click", () => { this.cancel() }) } var r = t.options, o = r.pageSize, s = L.BrowserPrint.Helper.getPageMargin(t, "mm"), a = L.BrowserPrint.Helper.getSize(t, e), p = r.rotate, l = r.scale; if (this.__overlay__.appendChild(this._addPrintCss(o, s, e)), r.header && r.header.enabled) { var c = document.createElement("div"); c.id = "print-header", r.header.overTheMap && (c.className = "over-the-map"), c.style.height = r.header.size, c.style.lineHeight = r.header.size; var d = document.createElement("span"); d.innerHTML = r.header.text, c.appendChild(d), this._setupPrintPagesWidth(c, a, e), this.__overlay__.appendChild(c) } var u = document.createElement("div"); if (u.className = "grid-print-container", u.style.width = "100%", u.style.display = "grid", this._setupPrintMapHeight(u, a, e, r), this.options.contentSelector) { var h = document.querySelectorAll(this.options.contentSelector); if (h && h.length) for (var g = 0; g < h.length; g++) { var m = h[g].cloneNode(!0); u.appendChild(m) } } if (this.options.pagesSelector && document.querySelectorAll(this.options.pagesSelector).length) { var _ = document.createElement("div"); _.className = "pages-print-container", _.style.margin = "0!important", this._setupPrintPagesWidth(_, a, e), this.__overlay__.appendChild(_), _.appendChild(u); var f = document.querySelectorAll(this.options.pagesSelector); if (f && f.length) for (g = 0; g < f.length; g++) { var y = f[g].cloneNode(!0); _.appendChild(y) } } else this._setupPrintPagesWidth(u, a, e), this.__overlay__.appendChild(u); var P = document.createElement("div"); if (P.id = this._map.getContainer().id + "-print", P.className = "grid-map-print", P.style.width = "100%", P.style.height = "100%", l && 1 !== l && (P.style.transform += " scale(" + l + ")"), p && (P.style.transform += " rotate(" + 90 * p + "deg)"), u.appendChild(P), r.footer && r.footer.enabled) { var v = document.createElement("div"); v.id = "print-footer", r.footer.overTheMap && (v.className = "over-the-map", v.style.bottom = "0"), v.style.height = r.footer.size, v.style.lineHeight = r.footer.size; var b = document.createElement("span"); b.innerHTML = r.footer.text, v.appendChild(b), this._setupPrintPagesWidth(v, a, e), this.__overlay__.appendChild(v) } return document.body.className += " leaflet--printing", this._setupPrintMap(P.id, this._combineBasicOptions(i.printLayer), i.printLayer, i.printObjects, i.panes) }, _combineBasicOptions: function (t) { var e = L.BrowserPrint.Utils.cloneBasicOptionsWithoutLayers(this._map.options); return e.maxZoom = t ? t.options.maxZoom : this._map.getMaxZoom(), e.zoomControl = !1, e.dragging = !1, e.zoomAnimation = !1, e.fadeAnimation = !1, e.markerZoomAnimation = !1, e.keyboard = !1, e.scrollWheelZoom = !1, e.tap = !1, e.touchZoom = !1, e }, _setupPrintMap: function (t, e, i, n, r) { var o = L.map(t, e); i && i.addTo(o), r.forEach((function (t) { o.createPane(t.name, t.container) })); var s = {}, a = []; for (var p in n) { var l = this.options.closePopupsOnPrint; n[p] = n[p].map((function (t) { var e = L.BrowserPrint.Utils.cloneLayer(t); if (e) { if (t instanceof L.Popup ? (t.isOpen || (t.isOpen = function () { return this._isOpen }), t.isOpen() && !l && a.push({ source: t._source, popup: e })) : e.addTo(o), s[t._leaflet_id] = e, t instanceof L.Layer) { var i = t.getTooltip(); i && (e.bindTooltip(i.getContent(), i.options), t.isTooltipOpen() && e.openTooltip(i.getLatLng())) } return e } })) } for (var c = 0; c < a.length; c++) { var d = a[c]; if (d.source) { var u = s[d.source._leaflet_id]; u && u.bindPopup && u.openPopup && s[d.source._leaflet_id].bindPopup(d.popup).openPopup(d.popup.getLatLng()) } } return { map: o, objects: n } }, _isTilesLoading: function (t) { return parseFloat(L.version) > 1 ? this._getLoadingLayers(t) : t._tilesToLoad || t._tileLayersToLoad }, _getLoadingLayers: function (t) { for (var e in t._layers) { var i = t._layers[e]; if ((i._url || i._mutant) && i._loading) return !0 } return !1 }, _appendControlStyles: function (t) { var e = document.createElement("style"); e.setAttribute("type", "text/css"), e.id = "browser-print-css", e.innerHTML += " .leaflet-control-browser-print { display: flex; } .leaflet-control-browser-print a { background: #fff url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gcCCi8Vjp+aNAAAAGhJREFUOMvFksENgDAMA68RC7BBN+Cf/ZU33QAmYAT6BolAGxB+RrrIsg1BpfNBVXcPMLMDI/ytpKozMHWwK7BJJ7yYWQbGdBea9wTIkRDzKy0MT7r2NiJACRgotCzxykFI34QY2Ea7KmtxGJ+uX4wfAAAAAElFTkSuQmCC') no-repeat 5px; background-size: 16px 16px; display: block; border-radius: 2px; }", e.innerHTML += " .leaflet-control-browser-print a.leaflet-browser-print { background-position: center; }", e.innerHTML += " .browser-print-holder { background-color: #919187; margin: 0px; padding: 0px; list-style: none; white-space: nowrap; align-items: center; display: flex; } .browser-print-holder-left li:last-child { border-top-right-radius: 2px; border-bottom-right-radius: 2px; } .browser-print-holder-right li:first-child { border-top-left-radius: 2px; border-bottom-left-radius: 2px; }", e.innerHTML += " .browser-print-mode { display: none; color: #FFF; text-decoration: none; padding: 0 10px; text-align: center; } .browser-print-holder:hover { background-color: #757570; cursor: pointer; }", e.innerHTML += " .leaflet-browser-print--custom, .leaflet-browser-print--custom path { cursor: crosshair!important; }", e.innerHTML += " .leaflet-print-overlay { width: 100%; height:auto; min-height: 100%; position: absolute; top: 0; background-color: white!important; left: 0; z-index: 1001; display: block!important; } ", e.innerHTML += " .leaflet--printing { height:auto; min-height: 100%; margin: 0px!important; padding: 0px!important; } body.leaflet--printing > * { display: none; box-sizing: border-box; }", e.innerHTML += " .grid-print-container { grid-template: 1fr / 1fr; box-sizing: border-box; overflow: hidden; } .grid-map-print { grid-row: 1; grid-column: 1; } body.leaflet--printing .grid-print-container [leaflet-browser-print-content]:not(style) { display: unset!important; }", e.innerHTML += " .pages-print-container { box-sizing: border-box; }", e.innerHTML += " #print-header, #print-footer { text-align: center; font-size: 20px; }", e.innerHTML += " .over-the-map { position: absolute; left: 0; z-index: 10000; }", t.appendChild(e) }, _setupManualPrintButton: function (t, e, i) { var n = document.createElement("button"); n.className = "leaflet-browser-print--manualMode-button", n.innerHTML = "Print", n.style.position = "absolute", n.style.top = "20px", n.style.right = "20px", this.__overlay__.appendChild(n); var r = this; L.DomEvent.on(n, "click", (function () { r.browserPrint._completePrinting(t, e, i) })) } }), L.browserPrint = function (t, e) { return new L.BrowserPrint(t, e) }, L.BrowserPrint.Event = { PrintInit: "browser-print-init", PrePrint: "browser-pre-print", PrintStart: "browser-print-start", Print: "browser-print", PrintEnd: "browser-print-end", PrintCancel: "browser-print-cancel" } }, function (t, e) { L.Control.BrowserPrint = L.Control.extend({ options: { title: "Print map", position: "topleft", printModes: ["Portrait", "Landscape", "Auto", "Custom"] }, browserPrint: void 0, initialize: function (t, e) { L.setOptions(this, t), e && (this.browserPrint = e, L.setOptions(this.browserPrint, t)) }, onAdd: function (t) { this.browserPrint || (this.browserPrint = new L.BrowserPrint(t, this.options)); var e = L.DomUtil.create("div", "leaflet-control-browser-print leaflet-bar leaflet-control"); return L.DomEvent.disableClickPropagation(e), this.options.printModes.length > 1 ? (L.DomEvent.on(e, "mouseover", this._displayPageSizeButtons, this), L.DomEvent.on(e, "mouseout", this._hidePageSizeButtons, this)) : e.style.cursor = "pointer", this.options.position.indexOf("left") > 0 ? (this._createIcon(e), this._createMenu(e)) : (this._createMenu(e), this._createIcon(e)), t.printControl = this, e }, cancel: function () { this.browserPrint.cancel() }, _createIcon: function (t) { return this.__link__ = L.DomUtil.create("a", "", t), this.__link__.className = "leaflet-browser-print", this.options.title && (this.__link__.title = this.options.title), this.__link__ }, _createMenu: function (t) { for (var e = [], i = 0; i < this.options.printModes.length; i++) { var n = this.options.printModes[i]; if (n.length) { var r = n[0].toUpperCase() + n.substring(1).toLowerCase(); n = L.BrowserPrint.Mode[n]("A4", this._getDefaultTitle(r)) } else if (!(n instanceof L.BrowserPrint.Mode)) throw "Invalid Print Mode. Can't construct logic to print current map."; var o = t; 1 === this.options.printModes.length ? n.Element = t : (o = L.DomUtil.create("ul", "browser-print-holder", t), n.Element = L.DomUtil.create("li", "browser-print-mode", o), n.Element.innerHTML = n.options.title), L.DomEvent.on(o, "click", n.options.action(this.browserPrint, n), this.browserPrint), e.push(n) } this.options.printModes = e }, _getDefaultTitle: function (t) { return this.options.printModesNames && this.options.printModesNames[t] || t }, _displayPageSizeButtons: function () { this.options.position.indexOf("left") > 0 ? (this.__link__.style.borderTopRightRadius = "0px", this.__link__.style.borderBottomRightRadius = "0px") : (this.__link__.style.borderTopLeftRadius = "0px", this.__link__.style.borderBottomLeftRadius = "0px"), this.options.printModes.forEach((function (t) { t.Element.style.display = "inline-block" })) }, _hidePageSizeButtons: function () { this.options.position.indexOf("left") > 0 ? (this.__link__.style.borderTopRightRadius = "", this.__link__.style.borderBottomRightRadius = "") : (this.__link__.style.borderTopLeftRadius = "", this.__link__.style.borderBottomLeftRadius = ""), this.options.printModes.forEach((function (t) { t.Element.style.display = "" })) } }), L.control.browserPrint = function (t, e) { if (t && t.printModes || ((t = t || {}).printModes = [L.BrowserPrint.Mode.Portrait(), L.BrowserPrint.Mode.Landscape(), L.BrowserPrint.Mode.Auto(), L.BrowserPrint.Mode.Custom()]), t && t.printModes && (!t.printModes.filter || !t.printModes.length)) throw "Please specify valid print modes for Print action. Example: printModes: [L.BrowserPrint.Mode.Portrait(), L.control.BrowserPrint.Mode.Auto('Automatic'), 'Custom']"; return new L.Control.BrowserPrint(t, e) } }, function (t, e) { L.BrowserPrint.Utils = { _ignoreArray: [], _cloneFactoryArray: [], _cloneRendererArray: [], _knownRenderers: {}, cloneOptions: function (t) { var e = {}; for (var i in t) { var n = t[i]; n && n.clone ? e[i] = n.clone() : n && n.onAdd ? e[i] = this.cloneLayer(n) : e[i] = n } return e }, cloneBasicOptionsWithoutLayers: function (t) { var e = {}, i = Object.getOwnPropertyNames(t); if (i.length) { for (var n = 0; n < i.length; n++) { var r = i[n]; r && "layers" != r && (e[r] = t[r]) } return this.cloneOptions(e) } return e }, cloneInnerLayers: function (t) { var e = this, i = []; return t.eachLayer((function (t) { var n = e.cloneLayer(t); n && i.push(n) })), i }, initialize: function () { this._knownRenderers = {}, this.registerRenderer(L.SVG, "L.SVG"), this.registerRenderer(L.Canvas, "L.Canvas"), this.registerLayer(L.TileLayer.WMS, "L.TileLayer.WMS", (function (t, e) { return L.tileLayer.wms(t._url, e.cloneOptions(t.options)) })), this.registerLayer(L.TileLayer, "L.TileLayer", (function (t, e) { return L.tileLayer(t._url, e.cloneOptions(t.options)) })), this.registerLayer(L.GridLayer, "L.GridLayer", (function (t, e) { return L.gridLayer(e.cloneOptions(t.options)) })), this.registerLayer(L.ImageOverlay, "L.ImageOverlay", (function (t, e) { return L.imageOverlay(t._url, t._bounds, e.cloneOptions(t.options)) })), this.registerLayer(L.Marker, "L.Marker", (function (t, e) { return L.marker(t.getLatLng(), e.cloneOptions(t.options)) })), this.registerLayer(L.Popup, "L.Popup", (function (t, e) { return L.popup(e.cloneOptions(t.options)).setLatLng(t.getLatLng()).setContent(t.getContent()) })), this.registerLayer(L.Circle, "L.Circle", (function (t, e) { return L.circle(t.getLatLng(), t.getRadius(), e.cloneOptions(t.options)) })), this.registerLayer(L.CircleMarker, "L.CircleMarker", (function (t, e) { return L.circleMarker(t.getLatLng(), e.cloneOptions(t.options)) })), this.registerLayer(L.Rectangle, "L.Rectangle", (function (t, e) { return L.rectangle(t.getBounds(), e.cloneOptions(t.options)) })), this.registerLayer(L.Polygon, "L.Polygon", (function (t, e) { return L.polygon(t.getLatLngs(), e.cloneOptions(t.options)) })), this.registerLayer(L.MultiPolyline, "L.MultiPolyline", (function (t, e) { return L.polyline(t.getLatLngs(), e.cloneOptions(t.options)) })), this.registerLayer(L.MultiPolygon, "L.MultiPolygon", (function (t, e) { return L.multiPolygon(t.getLatLngs(), e.cloneOptions(t.options)) })), this.registerLayer(L.Polyline, "L.Polyline", (function (t, e) { return L.polyline(t.getLatLngs(), e.cloneOptions(t.options)) })), this.registerLayer(L.GeoJSON, "L.GeoJSON", (function (t, e) { return L.geoJson(t.toGeoJSON(), e.cloneOptions(t.options)) })), this.registerIgnoreLayer(L.FeatureGroup, "L.FeatureGroup"), this.registerIgnoreLayer(L.LayerGroup, "L.LayerGroup"), this.registerLayer(L.Tooltip, "L.Tooltip", (function () { return null })) }, _register: function (t, e, i, n) { e && !t.filter((function (t) { return t.identifier === i })).length && t.push({ type: e, identifier: i, builder: n || function (t) { return new e(t.options) } }) }, registerLayer: function (t, e, i) { this._register(this._cloneFactoryArray, t, e, i) }, registerRenderer: function (t, e, i) { this._register(this._cloneRendererArray, t, e, i) }, registerIgnoreLayer: function (t, e) { this._register(this._ignoreArray, t, e) }, cloneLayer: function (t) { if (!t) return null; var e, i = this.__getRenderer(t); return i || ((e = t._group ? this.__getFactoryObject(t._group, !0) : this.__getFactoryObject(t)) && (e = e.builder(t, this)), e) }, getType: function (t) { if (!t) return null; var e = this.__getFactoryObject(t); return e && (e = e.identifier), e }, __getRenderer: function (t) { var e = this._knownRenderers[t._leaflet_id]; if (!e) { for (var i = 0; i < this._cloneRendererArray.length; i++) { var n = this._cloneRendererArray[i]; if (t instanceof n.type) { this._knownRenderers[t._leaflet_id] = n.builder(t.options); break } } e = this._knownRenderers[t._leaflet_id] } return e }, __getFactoryObject: function (t, e) { if (!e) for (var i = 0; i < this._ignoreArray.length; i++) { var n = this._ignoreArray[i]; if (n.type && t instanceof n.type) return null } for (i = 0; i < this._cloneFactoryArray.length; i++) { if ((r = this._cloneFactoryArray[i]).type && t instanceof r.type) return r } for (i = 0; i < this._cloneRendererArray.length; i++) { var r; if ((r = this._cloneRendererArray[i]).type && t instanceof r.type) return null } return this.__unknownLayer__(), null }, __unknownLayer__: function () { console.warn("Unknown layer, cannot clone this layer. Leaflet version: " + L.version), console.info("For additional information please refer to documentation on: https://github.com/Igor-Vladyka/leaflet.browser.print."), console.info("-------------------------------------------------------------------------------------------------------------------") } } }, function (t, e) { L.BrowserPrint.Size = { A: { Width: 840, Height: 1188 }, B: { Width: 1e3, Height: 1414 }, C: { Width: 916, Height: 1296 }, D: { Width: 770, Height: 1090 }, LETTER: { Width: 216, Height: 279 }, HALFLETTER: { Width: 140, Height: 216 }, LEGAL: { Width: 216, Height: 356 }, JUNIORLEGAL: { Width: 127, Height: 203 }, TABLOID: { Width: 279, Height: 432 }, LEDGER: { Width: 432, Height: 279 } } }, function (t, e) { L.BrowserPrint.Mode = L.Class.extend({ options: { title: "", invalidateBounds: !1, margin: {}, enableZoom: !0, zoom: 0, rotate: 0, scale: 1, orientation: "", pageSize: "A4", pageSeries: "", pageSeriesSize: "", action: null, header: { enabled: !1, text: "", size: "10mm", overTheMap: !1 }, footer: { enabled: !1, text: "", size: "10mm", overTheMap: !1 } }, initialize: function (t, e = {}) { if (!t) throw 'Print mode have to be set. Default modes: "Portrait", "Landscape", "Auto" or "Custom". The shortcut functions "L.BrowserPrint.Mode.Portrait" are preferred.'; this.mode = t, this.setOptions(e) }, setOptions: function (t) { L.setOptions(this, t), this.options.title || (this.options.title = this.mode), "Portrait" !== this.mode && "Landscape" !== this.mode || (this.options.orientation = this.mode), this.options.pageSize = (this.options.pageSize || "A4").toUpperCase(), this.options.pageSeries = -1 !== ["A", "B", "C", "D"].indexOf(this.options.pageSize[0]) ? this.options.pageSize[0] : "", this.options.pageSeriesSize = this.options.pageSize.substring(this.options.pageSeries.length), this.options.action = this.options.action || function (t, e) { return function () { t._printMode(e) } } } }), L.browserPrint.mode = function (t, e) { return new L.BrowserPrint.Mode(t, e) }, L.BrowserPrint.Mode.Name = { Landscape: "Landscape", Portrait: "Portrait", Auto: "Auto", Custom: "Custom" }, L.BrowserPrint.Mode.Portrait = function (t, e = {}) { return e.pageSize = t, e.invalidateBounds = (!0 === e.invalidateBounds || !1 === e.invalidateBounds) && e.invalidateBounds, new L.BrowserPrint.Mode(L.BrowserPrint.Mode.Name.Portrait, e) }, L.BrowserPrint.Mode.Landscape = function (t, e = {}) { return e.pageSize = t, e.invalidateBounds = (!0 === e.invalidateBounds || !1 === e.invalidateBounds) && e.invalidateBounds, new L.BrowserPrint.Mode(L.BrowserPrint.Mode.Name.Landscape, e) }, L.BrowserPrint.Mode.Auto = function (t, e = {}) { return e.pageSize = t, e.invalidateBounds = !0 !== e.invalidateBounds && !1 !== e.invalidateBounds || e.invalidateBounds, new L.BrowserPrint.Mode(L.BrowserPrint.Mode.Name.Auto, e) }, L.BrowserPrint.Mode.Custom = function (t, e = {}) { return e.pageSize = t, e.invalidateBounds = !0 !== e.invalidateBounds && !1 !== e.invalidateBounds || e.invalidateBounds, new L.BrowserPrint.Mode(L.BrowserPrint.Mode.Name.Custom, e) } }, function (t, e) { L.BrowserPrint.Helper = { getPageMargin: function (t, e) { var i = t.options.margin, n = this.getPaperSize(t), r = (n.Width + n.Height) / 39.9; e || 0 === e || (e = ""), i >= 0 ? i = { top: i, right: i, bottom: i, left: i } : i || (i = {}); var o = 1; "in" === e && (o = 25.4); var s = i.top >= 0 ? i.top : r, a = i.right >= 0 ? i.right : r, p = i.bottom >= 0 ? i.bottom : r, l = i.left >= 0 ? i.left : r; return { top: (s / o).toFixed(2) + e, right: (a / o).toFixed(2) + e, bottom: (p / o).toFixed(2) + e, left: (l / o).toFixed(2) + e } }, getPaperSize: function (t) { if (t.options.pageSeries) { var e = L.BrowserPrint.Size[t.options.pageSeries], i = e.Width, n = e.Height, r = !1; return t.options.pageSeriesSize && "0" !== t.options.pageSeriesSize && (t.options.pageSeriesSize = +t.options.pageSeriesSize, (r = t.options.pageSeriesSize % 2 == 1) ? (i /= t.options.pageSeriesSize - 1 || 1, n /= t.options.pageSeriesSize + 1) : (i /= t.options.pageSeriesSize, n /= t.options.pageSeriesSize)), { Width: r ? n : i, Height: r ? i : n } } var o = L.BrowserPrint.Size[t.options.pageSeriesSize]; return { Width: o.Width, Height: o.Height } }, getSize: function (t, e = "Portrait") { var i = this.getPaperSize(t), n = this.getPageMargin(t, 0), r = "Portrait" === e ? parseFloat(n.top) + parseFloat(n.bottom) : parseFloat(n.left) + parseFloat(n.right), o = "Portrait" === e ? parseFloat(n.left) + parseFloat(n.right) : parseFloat(n.top) + parseFloat(n.bottom), s = Math.floor(i.Height - r), a = Math.floor(i.Width - o); return i.Width = a * (window.devicePixelRatio || 1) + "mm", i.Height = s * (window.devicePixelRatio || 1) + "mm", i } } }]);

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e.Leaflet=e.Leaflet||{},e.Leaflet.markercluster=e.Leaflet.markercluster||{}))}(this,function(e){"use strict";var t=L.MarkerClusterGroup=L.FeatureGroup.extend({options:{maxClusterRadius:80,iconCreateFunction:null,clusterPane:L.Marker.prototype.options.pane,spiderfyOnMaxZoom:!0,showCoverageOnHover:!0,zoomToBoundsOnClick:!0,singleMarkerMode:!1,disableClusteringAtZoom:null,removeOutsideVisibleBounds:!0,animate:!0,animateAddingMarkers:!1,spiderfyDistanceMultiplier:1,spiderLegPolylineOptions:{weight:1.5,color:"#222",opacity:.5},chunkedLoading:!1,chunkInterval:200,chunkDelay:50,chunkProgress:null,polygonOptions:{}},initialize:function(e){L.Util.setOptions(this,e),this.options.iconCreateFunction||(this.options.iconCreateFunction=this._defaultIconCreateFunction),this._featureGroup=L.featureGroup(),this._featureGroup.addEventParent(this),this._nonPointGroup=L.featureGroup(),this._nonPointGroup.addEventParent(this),this._inZoomAnimation=0,this._needsClustering=[],this._needsRemoving=[],this._currentShownBounds=null,this._queue=[],this._childMarkerEventHandlers={dragstart:this._childMarkerDragStart,move:this._childMarkerMoved,dragend:this._childMarkerDragEnd};var t=L.DomUtil.TRANSITION&&this.options.animate;L.extend(this,t?this._withAnimation:this._noAnimation),this._markerCluster=t?L.MarkerCluster:L.MarkerClusterNonAnimated},addLayer:function(e){if(e instanceof L.LayerGroup)return this.addLayers([e]);if(!e.getLatLng)return this._nonPointGroup.addLayer(e),this.fire("layeradd",{layer:e}),this;if(!this._map)return this._needsClustering.push(e),this.fire("layeradd",{layer:e}),this;if(this.hasLayer(e))return this;this._unspiderfy&&this._unspiderfy(),this._addLayer(e,this._maxZoom),this.fire("layeradd",{layer:e}),this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons();var t=e,i=this._zoom;if(e.__parent)for(;t.__parent._zoom>=i;)t=t.__parent;return this._currentShownBounds.contains(t.getLatLng())&&(this.options.animateAddingMarkers?this._animationAddLayer(e,t):this._animationAddLayerNonAnimated(e,t)),this},removeLayer:function(e){return e instanceof L.LayerGroup?this.removeLayers([e]):e.getLatLng?this._map?e.__parent?(this._unspiderfy&&(this._unspiderfy(),this._unspiderfyLayer(e)),this._removeLayer(e,!0),this.fire("layerremove",{layer:e}),this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons(),e.off(this._childMarkerEventHandlers,this),this._featureGroup.hasLayer(e)&&(this._featureGroup.removeLayer(e),e.clusterShow&&e.clusterShow()),this):this:(!this._arraySplice(this._needsClustering,e)&&this.hasLayer(e)&&this._needsRemoving.push({layer:e,latlng:e._latlng}),this.fire("layerremove",{layer:e}),this):(this._nonPointGroup.removeLayer(e),this.fire("layerremove",{layer:e}),this)},addLayers:function(e,t){if(!L.Util.isArray(e))return this.addLayer(e);var i,n=this._featureGroup,r=this._nonPointGroup,s=this.options.chunkedLoading,o=this.options.chunkInterval,a=this.options.chunkProgress,h=e.length,l=0,u=!0;if(this._map){var _=(new Date).getTime(),d=L.bind(function(){for(var c=(new Date).getTime();h>l;l++){if(s&&0===l%200){var p=(new Date).getTime()-c;if(p>o)break}if(i=e[l],i instanceof L.LayerGroup)u&&(e=e.slice(),u=!1),this._extractNonGroupLayers(i,e),h=e.length;else if(i.getLatLng){if(!this.hasLayer(i)&&(this._addLayer(i,this._maxZoom),t||this.fire("layeradd",{layer:i}),i.__parent&&2===i.__parent.getChildCount())){var f=i.__parent.getAllChildMarkers(),m=f[0]===i?f[1]:f[0];n.removeLayer(m)}}else r.addLayer(i),t||this.fire("layeradd",{layer:i})}a&&a(l,h,(new Date).getTime()-_),l===h?(this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons(),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds)):setTimeout(d,this.options.chunkDelay)},this);d()}else for(var c=this._needsClustering;h>l;l++)i=e[l],i instanceof L.LayerGroup?(u&&(e=e.slice(),u=!1),this._extractNonGroupLayers(i,e),h=e.length):i.getLatLng?this.hasLayer(i)||c.push(i):r.addLayer(i);return this},removeLayers:function(e){var t,i,n=e.length,r=this._featureGroup,s=this._nonPointGroup,o=!0;if(!this._map){for(t=0;n>t;t++)i=e[t],i instanceof L.LayerGroup?(o&&(e=e.slice(),o=!1),this._extractNonGroupLayers(i,e),n=e.length):(this._arraySplice(this._needsClustering,i),s.removeLayer(i),this.hasLayer(i)&&this._needsRemoving.push({layer:i,latlng:i._latlng}),this.fire("layerremove",{layer:i}));return this}if(this._unspiderfy){this._unspiderfy();var a=e.slice(),h=n;for(t=0;h>t;t++)i=a[t],i instanceof L.LayerGroup?(this._extractNonGroupLayers(i,a),h=a.length):this._unspiderfyLayer(i)}for(t=0;n>t;t++)i=e[t],i instanceof L.LayerGroup?(o&&(e=e.slice(),o=!1),this._extractNonGroupLayers(i,e),n=e.length):i.__parent?(this._removeLayer(i,!0,!0),this.fire("layerremove",{layer:i}),r.hasLayer(i)&&(r.removeLayer(i),i.clusterShow&&i.clusterShow())):(s.removeLayer(i),this.fire("layerremove",{layer:i}));return this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons(),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds),this},clearLayers:function(){return this._map||(this._needsClustering=[],this._needsRemoving=[],delete this._gridClusters,delete this._gridUnclustered),this._noanimationUnspiderfy&&this._noanimationUnspiderfy(),this._featureGroup.clearLayers(),this._nonPointGroup.clearLayers(),this.eachLayer(function(e){e.off(this._childMarkerEventHandlers,this),delete e.__parent},this),this._map&&this._generateInitialClusters(),this},getBounds:function(){var e=new L.LatLngBounds;this._topClusterLevel&&e.extend(this._topClusterLevel._bounds);for(var t=this._needsClustering.length-1;t>=0;t--)e.extend(this._needsClustering[t].getLatLng());return e.extend(this._nonPointGroup.getBounds()),e},eachLayer:function(e,t){var i,n,r,s=this._needsClustering.slice(),o=this._needsRemoving;for(this._topClusterLevel&&this._topClusterLevel.getAllChildMarkers(s),n=s.length-1;n>=0;n--){for(i=!0,r=o.length-1;r>=0;r--)if(o[r].layer===s[n]){i=!1;break}i&&e.call(t,s[n])}this._nonPointGroup.eachLayer(e,t)},getLayers:function(){var e=[];return this.eachLayer(function(t){e.push(t)}),e},getLayer:function(e){var t=null;return e=parseInt(e,10),this.eachLayer(function(i){L.stamp(i)===e&&(t=i)}),t},hasLayer:function(e){if(!e)return!1;var t,i=this._needsClustering;for(t=i.length-1;t>=0;t--)if(i[t]===e)return!0;for(i=this._needsRemoving,t=i.length-1;t>=0;t--)if(i[t].layer===e)return!1;return!(!e.__parent||e.__parent._group!==this)||this._nonPointGroup.hasLayer(e)},zoomToShowLayer:function(e,t){"function"!=typeof t&&(t=function(){});var i=function(){!e._icon&&!e.__parent._icon||this._inZoomAnimation||(this._map.off("moveend",i,this),this.off("animationend",i,this),e._icon?t():e.__parent._icon&&(this.once("spiderfied",t,this),e.__parent.spiderfy()))};e._icon&&this._map.getBounds().contains(e.getLatLng())?t():e.__parent._zoom<Math.round(this._map._zoom)?(this._map.on("moveend",i,this),this._map.panTo(e.getLatLng())):(this._map.on("moveend",i,this),this.on("animationend",i,this),e.__parent.zoomToBounds())},onAdd:function(e){this._map=e;var t,i,n;if(!isFinite(this._map.getMaxZoom()))throw"Map has no maxZoom specified";for(this._featureGroup.addTo(e),this._nonPointGroup.addTo(e),this._gridClusters||this._generateInitialClusters(),this._maxLat=e.options.crs.projection.MAX_LATITUDE,t=0,i=this._needsRemoving.length;i>t;t++)n=this._needsRemoving[t],n.newlatlng=n.layer._latlng,n.layer._latlng=n.latlng;for(t=0,i=this._needsRemoving.length;i>t;t++)n=this._needsRemoving[t],this._removeLayer(n.layer,!0),n.layer._latlng=n.newlatlng;this._needsRemoving=[],this._zoom=Math.round(this._map._zoom),this._currentShownBounds=this._getExpandedVisibleBounds(),this._map.on("zoomend",this._zoomEnd,this),this._map.on("moveend",this._moveEnd,this),this._spiderfierOnAdd&&this._spiderfierOnAdd(),this._bindEvents(),i=this._needsClustering,this._needsClustering=[],this.addLayers(i,!0)},onRemove:function(e){e.off("zoomend",this._zoomEnd,this),e.off("moveend",this._moveEnd,this),this._unbindEvents(),this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim",""),this._spiderfierOnRemove&&this._spiderfierOnRemove(),delete this._maxLat,this._hideCoverage(),this._featureGroup.remove(),this._nonPointGroup.remove(),this._featureGroup.clearLayers(),this._map=null},getVisibleParent:function(e){for(var t=e;t&&!t._icon;)t=t.__parent;return t||null},_arraySplice:function(e,t){for(var i=e.length-1;i>=0;i--)if(e[i]===t)return e.splice(i,1),!0},_removeFromGridUnclustered:function(e,t){for(var i=this._map,n=this._gridUnclustered,r=Math.floor(this._map.getMinZoom());t>=r&&n[t].removeObject(e,i.project(e.getLatLng(),t));t--);},_childMarkerDragStart:function(e){e.target.__dragStart=e.target._latlng},_childMarkerMoved:function(e){if(!this._ignoreMove&&!e.target.__dragStart){var t=e.target._popup&&e.target._popup.isOpen();this._moveChild(e.target,e.oldLatLng,e.latlng),t&&e.target.openPopup()}},_moveChild:function(e,t,i){e._latlng=t,this.removeLayer(e),e._latlng=i,this.addLayer(e)},_childMarkerDragEnd:function(e){var t=e.target.__dragStart;delete e.target.__dragStart,t&&this._moveChild(e.target,t,e.target._latlng)},_removeLayer:function(e,t,i){var n=this._gridClusters,r=this._gridUnclustered,s=this._featureGroup,o=this._map,a=Math.floor(this._map.getMinZoom());t&&this._removeFromGridUnclustered(e,this._maxZoom);var h,l=e.__parent,u=l._markers;for(this._arraySplice(u,e);l&&(l._childCount--,l._boundsNeedUpdate=!0,!(l._zoom<a));)t&&l._childCount<=1?(h=l._markers[0]===e?l._markers[1]:l._markers[0],n[l._zoom].removeObject(l,o.project(l._cLatLng,l._zoom)),r[l._zoom].addObject(h,o.project(h.getLatLng(),l._zoom)),this._arraySplice(l.__parent._childClusters,l),l.__parent._markers.push(h),h.__parent=l.__parent,l._icon&&(s.removeLayer(l),i||s.addLayer(h))):l._iconNeedsUpdate=!0,l=l.__parent;delete e.__parent},_isOrIsParent:function(e,t){for(;t;){if(e===t)return!0;t=t.parentNode}return!1},fire:function(e,t,i){if(t&&t.layer instanceof L.MarkerCluster){if(t.originalEvent&&this._isOrIsParent(t.layer._icon,t.originalEvent.relatedTarget))return;e="cluster"+e}L.FeatureGroup.prototype.fire.call(this,e,t,i)},listens:function(e,t){return L.FeatureGroup.prototype.listens.call(this,e,t)||L.FeatureGroup.prototype.listens.call(this,"cluster"+e,t)},_defaultIconCreateFunction:function(e){var t=e.getChildCount(),i=" marker-cluster-";return i+=10>t?"small":100>t?"medium":"large",new L.DivIcon({html:"<div><span>"+t+"</span></div>",className:"marker-cluster"+i,iconSize:new L.Point(40,40)})},_bindEvents:function(){var e=this._map,t=this.options.spiderfyOnMaxZoom,i=this.options.showCoverageOnHover,n=this.options.zoomToBoundsOnClick;(t||n)&&this.on("clusterclick",this._zoomOrSpiderfy,this),i&&(this.on("clustermouseover",this._showCoverage,this),this.on("clustermouseout",this._hideCoverage,this),e.on("zoomend",this._hideCoverage,this))},_zoomOrSpiderfy:function(e){for(var t=e.layer,i=t;1===i._childClusters.length;)i=i._childClusters[0];i._zoom===this._maxZoom&&i._childCount===t._childCount&&this.options.spiderfyOnMaxZoom?t.spiderfy():this.options.zoomToBoundsOnClick&&t.zoomToBounds(),e.originalEvent&&13===e.originalEvent.keyCode&&this._map._container.focus()},_showCoverage:function(e){var t=this._map;this._inZoomAnimation||(this._shownPolygon&&t.removeLayer(this._shownPolygon),e.layer.getChildCount()>2&&e.layer!==this._spiderfied&&(this._shownPolygon=new L.Polygon(e.layer.getConvexHull(),this.options.polygonOptions),t.addLayer(this._shownPolygon)))},_hideCoverage:function(){this._shownPolygon&&(this._map.removeLayer(this._shownPolygon),this._shownPolygon=null)},_unbindEvents:function(){var e=this.options.spiderfyOnMaxZoom,t=this.options.showCoverageOnHover,i=this.options.zoomToBoundsOnClick,n=this._map;(e||i)&&this.off("clusterclick",this._zoomOrSpiderfy,this),t&&(this.off("clustermouseover",this._showCoverage,this),this.off("clustermouseout",this._hideCoverage,this),n.off("zoomend",this._hideCoverage,this))},_zoomEnd:function(){this._map&&(this._mergeSplitClusters(),this._zoom=Math.round(this._map._zoom),this._currentShownBounds=this._getExpandedVisibleBounds())},_moveEnd:function(){if(!this._inZoomAnimation){var e=this._getExpandedVisibleBounds();this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),this._zoom,e),this._topClusterLevel._recursivelyAddChildrenToMap(null,Math.round(this._map._zoom),e),this._currentShownBounds=e}},_generateInitialClusters:function(){var e=Math.ceil(this._map.getMaxZoom()),t=Math.floor(this._map.getMinZoom()),i=this.options.maxClusterRadius,n=i;"function"!=typeof i&&(n=function(){return i}),null!==this.options.disableClusteringAtZoom&&(e=this.options.disableClusteringAtZoom-1),this._maxZoom=e,this._gridClusters={},this._gridUnclustered={};for(var r=e;r>=t;r--)this._gridClusters[r]=new L.DistanceGrid(n(r)),this._gridUnclustered[r]=new L.DistanceGrid(n(r));this._topClusterLevel=new this._markerCluster(this,t-1)},_addLayer:function(e,t){var i,n,r=this._gridClusters,s=this._gridUnclustered,o=Math.floor(this._map.getMinZoom());for(this.options.singleMarkerMode&&this._overrideMarkerIcon(e),e.on(this._childMarkerEventHandlers,this);t>=o;t--){i=this._map.project(e.getLatLng(),t);var a=r[t].getNearObject(i);if(a)return a._addChild(e),e.__parent=a,void 0;if(a=s[t].getNearObject(i)){var h=a.__parent;h&&this._removeLayer(a,!1);var l=new this._markerCluster(this,t,a,e);r[t].addObject(l,this._map.project(l._cLatLng,t)),a.__parent=l,e.__parent=l;var u=l;for(n=t-1;n>h._zoom;n--)u=new this._markerCluster(this,n,u),r[n].addObject(u,this._map.project(a.getLatLng(),n));return h._addChild(u),this._removeFromGridUnclustered(a,t),void 0}s[t].addObject(e,i)}this._topClusterLevel._addChild(e),e.__parent=this._topClusterLevel},_refreshClustersIcons:function(){this._featureGroup.eachLayer(function(e){e instanceof L.MarkerCluster&&e._iconNeedsUpdate&&e._updateIcon()})},_enqueue:function(e){this._queue.push(e),this._queueTimeout||(this._queueTimeout=setTimeout(L.bind(this._processQueue,this),300))},_processQueue:function(){for(var e=0;e<this._queue.length;e++)this._queue[e].call(this);this._queue.length=0,clearTimeout(this._queueTimeout),this._queueTimeout=null},_mergeSplitClusters:function(){var e=Math.round(this._map._zoom);this._processQueue(),this._zoom<e&&this._currentShownBounds.intersects(this._getExpandedVisibleBounds())?(this._animationStart(),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),this._zoom,this._getExpandedVisibleBounds()),this._animationZoomIn(this._zoom,e)):this._zoom>e?(this._animationStart(),this._animationZoomOut(this._zoom,e)):this._moveEnd()},_getExpandedVisibleBounds:function(){return this.options.removeOutsideVisibleBounds?L.Browser.mobile?this._checkBoundsMaxLat(this._map.getBounds()):this._checkBoundsMaxLat(this._map.getBounds().pad(1)):this._mapBoundsInfinite},_checkBoundsMaxLat:function(e){var t=this._maxLat;return void 0!==t&&(e.getNorth()>=t&&(e._northEast.lat=1/0),e.getSouth()<=-t&&(e._southWest.lat=-1/0)),e},_animationAddLayerNonAnimated:function(e,t){if(t===e)this._featureGroup.addLayer(e);else if(2===t._childCount){t._addToMap();var i=t.getAllChildMarkers();this._featureGroup.removeLayer(i[0]),this._featureGroup.removeLayer(i[1])}else t._updateIcon()},_extractNonGroupLayers:function(e,t){var i,n=e.getLayers(),r=0;for(t=t||[];r<n.length;r++)i=n[r],i instanceof L.LayerGroup?this._extractNonGroupLayers(i,t):t.push(i);return t},_overrideMarkerIcon:function(e){var t=e.options.icon=this.options.iconCreateFunction({getChildCount:function(){return 1},getAllChildMarkers:function(){return[e]}});return t}});L.MarkerClusterGroup.include({_mapBoundsInfinite:new L.LatLngBounds(new L.LatLng(-1/0,-1/0),new L.LatLng(1/0,1/0))}),L.MarkerClusterGroup.include({_noAnimation:{_animationStart:function(){},_animationZoomIn:function(e,t){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),e),this._topClusterLevel._recursivelyAddChildrenToMap(null,t,this._getExpandedVisibleBounds()),this.fire("animationend")},_animationZoomOut:function(e,t){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),e),this._topClusterLevel._recursivelyAddChildrenToMap(null,t,this._getExpandedVisibleBounds()),this.fire("animationend")},_animationAddLayer:function(e,t){this._animationAddLayerNonAnimated(e,t)}},_withAnimation:{_animationStart:function(){this._map._mapPane.className+=" leaflet-cluster-anim",this._inZoomAnimation++},_animationZoomIn:function(e,t){var i,n=this._getExpandedVisibleBounds(),r=this._featureGroup,s=Math.floor(this._map.getMinZoom());this._ignoreMove=!0,this._topClusterLevel._recursively(n,e,s,function(s){var o,a=s._latlng,h=s._markers;for(n.contains(a)||(a=null),s._isSingleParent()&&e+1===t?(r.removeLayer(s),s._recursivelyAddChildrenToMap(null,t,n)):(s.clusterHide(),s._recursivelyAddChildrenToMap(a,t,n)),i=h.length-1;i>=0;i--)o=h[i],n.contains(o._latlng)||r.removeLayer(o)}),this._forceLayout(),this._topClusterLevel._recursivelyBecomeVisible(n,t),r.eachLayer(function(e){e instanceof L.MarkerCluster||!e._icon||e.clusterShow()}),this._topClusterLevel._recursively(n,e,t,function(e){e._recursivelyRestoreChildPositions(t)}),this._ignoreMove=!1,this._enqueue(function(){this._topClusterLevel._recursively(n,e,s,function(e){r.removeLayer(e),e.clusterShow()}),this._animationEnd()})},_animationZoomOut:function(e,t){this._animationZoomOutSingle(this._topClusterLevel,e-1,t),this._topClusterLevel._recursivelyAddChildrenToMap(null,t,this._getExpandedVisibleBounds()),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),e,this._getExpandedVisibleBounds())},_animationAddLayer:function(e,t){var i=this,n=this._featureGroup;n.addLayer(e),t!==e&&(t._childCount>2?(t._updateIcon(),this._forceLayout(),this._animationStart(),e._setPos(this._map.latLngToLayerPoint(t.getLatLng())),e.clusterHide(),this._enqueue(function(){n.removeLayer(e),e.clusterShow(),i._animationEnd()})):(this._forceLayout(),i._animationStart(),i._animationZoomOutSingle(t,this._map.getMaxZoom(),this._zoom)))}},_animationZoomOutSingle:function(e,t,i){var n=this._getExpandedVisibleBounds(),r=Math.floor(this._map.getMinZoom());e._recursivelyAnimateChildrenInAndAddSelfToMap(n,r,t+1,i);var s=this;this._forceLayout(),e._recursivelyBecomeVisible(n,i),this._enqueue(function(){if(1===e._childCount){var o=e._markers[0];this._ignoreMove=!0,o.setLatLng(o.getLatLng()),this._ignoreMove=!1,o.clusterShow&&o.clusterShow()}else e._recursively(n,i,r,function(e){e._recursivelyRemoveChildrenFromMap(n,r,t+1)});s._animationEnd()})},_animationEnd:function(){this._map&&(this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim","")),this._inZoomAnimation--,this.fire("animationend")},_forceLayout:function(){L.Util.falseFn(document.body.offsetWidth)}}),L.markerClusterGroup=function(e){return new L.MarkerClusterGroup(e)};var i=L.MarkerCluster=L.Marker.extend({options:L.Icon.prototype.options,initialize:function(e,t,i,n){L.Marker.prototype.initialize.call(this,i?i._cLatLng||i.getLatLng():new L.LatLng(0,0),{icon:this,pane:e.options.clusterPane}),this._group=e,this._zoom=t,this._markers=[],this._childClusters=[],this._childCount=0,this._iconNeedsUpdate=!0,this._boundsNeedUpdate=!0,this._bounds=new L.LatLngBounds,i&&this._addChild(i),n&&this._addChild(n)},getAllChildMarkers:function(e,t){e=e||[];for(var i=this._childClusters.length-1;i>=0;i--)this._childClusters[i].getAllChildMarkers(e);for(var n=this._markers.length-1;n>=0;n--)t&&this._markers[n].__dragStart||e.push(this._markers[n]);return e},getChildCount:function(){return this._childCount},zoomToBounds:function(e){for(var t,i=this._childClusters.slice(),n=this._group._map,r=n.getBoundsZoom(this._bounds),s=this._zoom+1,o=n.getZoom();i.length>0&&r>s;){s++;var a=[];for(t=0;t<i.length;t++)a=a.concat(i[t]._childClusters);i=a}r>s?this._group._map.setView(this._latlng,s):o>=r?this._group._map.setView(this._latlng,o+1):this._group._map.fitBounds(this._bounds,e)},getBounds:function(){var e=new L.LatLngBounds;return e.extend(this._bounds),e},_updateIcon:function(){this._iconNeedsUpdate=!0,this._icon&&this.setIcon(this)},createIcon:function(){return this._iconNeedsUpdate&&(this._iconObj=this._group.options.iconCreateFunction(this),this._iconNeedsUpdate=!1),this._iconObj.createIcon()},createShadow:function(){return this._iconObj.createShadow()},_addChild:function(e,t){this._iconNeedsUpdate=!0,this._boundsNeedUpdate=!0,this._setClusterCenter(e),e instanceof L.MarkerCluster?(t||(this._childClusters.push(e),e.__parent=this),this._childCount+=e._childCount):(t||this._markers.push(e),this._childCount++),this.__parent&&this.__parent._addChild(e,!0)},_setClusterCenter:function(e){this._cLatLng||(this._cLatLng=e._cLatLng||e._latlng)},_resetBounds:function(){var e=this._bounds;e._southWest&&(e._southWest.lat=1/0,e._southWest.lng=1/0),e._northEast&&(e._northEast.lat=-1/0,e._northEast.lng=-1/0)},_recalculateBounds:function(){var e,t,i,n,r=this._markers,s=this._childClusters,o=0,a=0,h=this._childCount;if(0!==h){for(this._resetBounds(),e=0;e<r.length;e++)i=r[e]._latlng,this._bounds.extend(i),o+=i.lat,a+=i.lng;for(e=0;e<s.length;e++)t=s[e],t._boundsNeedUpdate&&t._recalculateBounds(),this._bounds.extend(t._bounds),i=t._wLatLng,n=t._childCount,o+=i.lat*n,a+=i.lng*n;this._latlng=this._wLatLng=new L.LatLng(o/h,a/h),this._boundsNeedUpdate=!1}},_addToMap:function(e){e&&(this._backupLatlng=this._latlng,this.setLatLng(e)),this._group._featureGroup.addLayer(this)},_recursivelyAnimateChildrenIn:function(e,t,i){this._recursively(e,this._group._map.getMinZoom(),i-1,function(e){var i,n,r=e._markers;for(i=r.length-1;i>=0;i--)n=r[i],n._icon&&(n._setPos(t),n.clusterHide())},function(e){var i,n,r=e._childClusters;for(i=r.length-1;i>=0;i--)n=r[i],n._icon&&(n._setPos(t),n.clusterHide())})},_recursivelyAnimateChildrenInAndAddSelfToMap:function(e,t,i,n){this._recursively(e,n,t,function(r){r._recursivelyAnimateChildrenIn(e,r._group._map.latLngToLayerPoint(r.getLatLng()).round(),i),r._isSingleParent()&&i-1===n?(r.clusterShow(),r._recursivelyRemoveChildrenFromMap(e,t,i)):r.clusterHide(),r._addToMap()})},_recursivelyBecomeVisible:function(e,t){this._recursively(e,this._group._map.getMinZoom(),t,null,function(e){e.clusterShow()})},_recursivelyAddChildrenToMap:function(e,t,i){this._recursively(i,this._group._map.getMinZoom()-1,t,function(n){if(t!==n._zoom)for(var r=n._markers.length-1;r>=0;r--){var s=n._markers[r];i.contains(s._latlng)&&(e&&(s._backupLatlng=s.getLatLng(),s.setLatLng(e),s.clusterHide&&s.clusterHide()),n._group._featureGroup.addLayer(s))}},function(t){t._addToMap(e)})},_recursivelyRestoreChildPositions:function(e){for(var t=this._markers.length-1;t>=0;t--){var i=this._markers[t];i._backupLatlng&&(i.setLatLng(i._backupLatlng),delete i._backupLatlng)}if(e-1===this._zoom)for(var n=this._childClusters.length-1;n>=0;n--)this._childClusters[n]._restorePosition();else for(var r=this._childClusters.length-1;r>=0;r--)this._childClusters[r]._recursivelyRestoreChildPositions(e)},_restorePosition:function(){this._backupLatlng&&(this.setLatLng(this._backupLatlng),delete this._backupLatlng)},_recursivelyRemoveChildrenFromMap:function(e,t,i,n){var r,s;this._recursively(e,t-1,i-1,function(e){for(s=e._markers.length-1;s>=0;s--)r=e._markers[s],n&&n.contains(r._latlng)||(e._group._featureGroup.removeLayer(r),r.clusterShow&&r.clusterShow())},function(e){for(s=e._childClusters.length-1;s>=0;s--)r=e._childClusters[s],n&&n.contains(r._latlng)||(e._group._featureGroup.removeLayer(r),r.clusterShow&&r.clusterShow())})},_recursively:function(e,t,i,n,r){var s,o,a=this._childClusters,h=this._zoom;if(h>=t&&(n&&n(this),r&&h===i&&r(this)),t>h||i>h)for(s=a.length-1;s>=0;s--)o=a[s],o._boundsNeedUpdate&&o._recalculateBounds(),e.intersects(o._bounds)&&o._recursively(e,t,i,n,r)},_isSingleParent:function(){return this._childClusters.length>0&&this._childClusters[0]._childCount===this._childCount}});L.Marker.include({clusterHide:function(){var e=this.options.opacity;return this.setOpacity(0),this.options.opacity=e,this},clusterShow:function(){return this.setOpacity(this.options.opacity)}}),L.DistanceGrid=function(e){this._cellSize=e,this._sqCellSize=e*e,this._grid={},this._objectPoint={}},L.DistanceGrid.prototype={addObject:function(e,t){var i=this._getCoord(t.x),n=this._getCoord(t.y),r=this._grid,s=r[n]=r[n]||{},o=s[i]=s[i]||[],a=L.Util.stamp(e);this._objectPoint[a]=t,o.push(e)},updateObject:function(e,t){this.removeObject(e),this.addObject(e,t)},removeObject:function(e,t){var i,n,r=this._getCoord(t.x),s=this._getCoord(t.y),o=this._grid,a=o[s]=o[s]||{},h=a[r]=a[r]||[];for(delete this._objectPoint[L.Util.stamp(e)],i=0,n=h.length;n>i;i++)if(h[i]===e)return h.splice(i,1),1===n&&delete a[r],!0},eachObject:function(e,t){var i,n,r,s,o,a,h,l=this._grid;for(i in l){o=l[i];for(n in o)for(a=o[n],r=0,s=a.length;s>r;r++)h=e.call(t,a[r]),h&&(r--,s--)}},getNearObject:function(e){var t,i,n,r,s,o,a,h,l=this._getCoord(e.x),u=this._getCoord(e.y),_=this._objectPoint,d=this._sqCellSize,c=null;for(t=u-1;u+1>=t;t++)if(r=this._grid[t])for(i=l-1;l+1>=i;i++)if(s=r[i])for(n=0,o=s.length;o>n;n++)a=s[n],h=this._sqDist(_[L.Util.stamp(a)],e),(d>h||d>=h&&null===c)&&(d=h,c=a);return c},_getCoord:function(e){var t=Math.floor(e/this._cellSize);return isFinite(t)?t:e},_sqDist:function(e,t){var i=t.x-e.x,n=t.y-e.y;return i*i+n*n}},function(){L.QuickHull={getDistant:function(e,t){var i=t[1].lat-t[0].lat,n=t[0].lng-t[1].lng;return n*(e.lat-t[0].lat)+i*(e.lng-t[0].lng)},findMostDistantPointFromBaseLine:function(e,t){var i,n,r,s=0,o=null,a=[];for(i=t.length-1;i>=0;i--)n=t[i],r=this.getDistant(n,e),r>0&&(a.push(n),r>s&&(s=r,o=n));return{maxPoint:o,newPoints:a}},buildConvexHull:function(e,t){var i=[],n=this.findMostDistantPointFromBaseLine(e,t);return n.maxPoint?(i=i.concat(this.buildConvexHull([e[0],n.maxPoint],n.newPoints)),i=i.concat(this.buildConvexHull([n.maxPoint,e[1]],n.newPoints))):[e[0]]},getConvexHull:function(e){var t,i=!1,n=!1,r=!1,s=!1,o=null,a=null,h=null,l=null,u=null,_=null;for(t=e.length-1;t>=0;t--){var d=e[t];(i===!1||d.lat>i)&&(o=d,i=d.lat),(n===!1||d.lat<n)&&(a=d,n=d.lat),(r===!1||d.lng>r)&&(h=d,r=d.lng),(s===!1||d.lng<s)&&(l=d,s=d.lng)}n!==i?(_=a,u=o):(_=l,u=h);var c=[].concat(this.buildConvexHull([_,u],e),this.buildConvexHull([u,_],e));return c}}}(),L.MarkerCluster.include({getConvexHull:function(){var e,t,i=this.getAllChildMarkers(),n=[];for(t=i.length-1;t>=0;t--)e=i[t].getLatLng(),n.push(e);return L.QuickHull.getConvexHull(n)}}),L.MarkerCluster.include({_2PI:2*Math.PI,_circleFootSeparation:25,_circleStartAngle:0,_spiralFootSeparation:28,_spiralLengthStart:11,_spiralLengthFactor:5,_circleSpiralSwitchover:9,spiderfy:function(){if(this._group._spiderfied!==this&&!this._group._inZoomAnimation){var e,t=this.getAllChildMarkers(null,!0),i=this._group,n=i._map,r=n.latLngToLayerPoint(this._latlng);this._group._unspiderfy(),this._group._spiderfied=this,t.length>=this._circleSpiralSwitchover?e=this._generatePointsSpiral(t.length,r):(r.y+=10,e=this._generatePointsCircle(t.length,r)),this._animationSpiderfy(t,e)}},unspiderfy:function(e){this._group._inZoomAnimation||(this._animationUnspiderfy(e),this._group._spiderfied=null)},_generatePointsCircle:function(e,t){var i,n,r=this._group.options.spiderfyDistanceMultiplier*this._circleFootSeparation*(2+e),s=r/this._2PI,o=this._2PI/e,a=[];for(s=Math.max(s,35),a.length=e,i=0;e>i;i++)n=this._circleStartAngle+i*o,a[i]=new L.Point(t.x+s*Math.cos(n),t.y+s*Math.sin(n))._round();return a},_generatePointsSpiral:function(e,t){var i,n=this._group.options.spiderfyDistanceMultiplier,r=n*this._spiralLengthStart,s=n*this._spiralFootSeparation,o=n*this._spiralLengthFactor*this._2PI,a=0,h=[];for(h.length=e,i=e;i>=0;i--)e>i&&(h[i]=new L.Point(t.x+r*Math.cos(a),t.y+r*Math.sin(a))._round()),a+=s/r+5e-4*i,r+=o/a;return h},_noanimationUnspiderfy:function(){var e,t,i=this._group,n=i._map,r=i._featureGroup,s=this.getAllChildMarkers(null,!0);for(i._ignoreMove=!0,this.setOpacity(1),t=s.length-1;t>=0;t--)e=s[t],r.removeLayer(e),e._preSpiderfyLatlng&&(e.setLatLng(e._preSpiderfyLatlng),delete e._preSpiderfyLatlng),e.setZIndexOffset&&e.setZIndexOffset(0),e._spiderLeg&&(n.removeLayer(e._spiderLeg),delete e._spiderLeg);i.fire("unspiderfied",{cluster:this,markers:s}),i._ignoreMove=!1,i._spiderfied=null}}),L.MarkerClusterNonAnimated=L.MarkerCluster.extend({_animationSpiderfy:function(e,t){var i,n,r,s,o=this._group,a=o._map,h=o._featureGroup,l=this._group.options.spiderLegPolylineOptions;for(o._ignoreMove=!0,i=0;i<e.length;i++)s=a.layerPointToLatLng(t[i]),n=e[i],r=new L.Polyline([this._latlng,s],l),a.addLayer(r),n._spiderLeg=r,n._preSpiderfyLatlng=n._latlng,n.setLatLng(s),n.setZIndexOffset&&n.setZIndexOffset(1e6),h.addLayer(n);this.setOpacity(.3),o._ignoreMove=!1,o.fire("spiderfied",{cluster:this,markers:e})},_animationUnspiderfy:function(){this._noanimationUnspiderfy()}}),L.MarkerCluster.include({_animationSpiderfy:function(e,t){var i,n,r,s,o,a,h=this,l=this._group,u=l._map,_=l._featureGroup,d=this._latlng,c=u.latLngToLayerPoint(d),p=L.Path.SVG,f=L.extend({},this._group.options.spiderLegPolylineOptions),m=f.opacity;for(void 0===m&&(m=L.MarkerClusterGroup.prototype.options.spiderLegPolylineOptions.opacity),p?(f.opacity=0,f.className=(f.className||"")+" leaflet-cluster-spider-leg"):f.opacity=m,l._ignoreMove=!0,i=0;i<e.length;i++)n=e[i],a=u.layerPointToLatLng(t[i]),r=new L.Polyline([d,a],f),u.addLayer(r),n._spiderLeg=r,p&&(s=r._path,o=s.getTotalLength()+.1,s.style.strokeDasharray=o,s.style.strokeDashoffset=o),n.setZIndexOffset&&n.setZIndexOffset(1e6),n.clusterHide&&n.clusterHide(),_.addLayer(n),n._setPos&&n._setPos(c);for(l._forceLayout(),l._animationStart(),i=e.length-1;i>=0;i--)a=u.layerPointToLatLng(t[i]),n=e[i],n._preSpiderfyLatlng=n._latlng,n.setLatLng(a),n.clusterShow&&n.clusterShow(),p&&(r=n._spiderLeg,s=r._path,s.style.strokeDashoffset=0,r.setStyle({opacity:m}));this.setOpacity(.3),l._ignoreMove=!1,setTimeout(function(){l._animationEnd(),l.fire("spiderfied",{cluster:h,markers:e})},200)},_animationUnspiderfy:function(e){var t,i,n,r,s,o,a=this,h=this._group,l=h._map,u=h._featureGroup,_=e?l._latLngToNewLayerPoint(this._latlng,e.zoom,e.center):l.latLngToLayerPoint(this._latlng),d=this.getAllChildMarkers(null,!0),c=L.Path.SVG;for(h._ignoreMove=!0,h._animationStart(),this.setOpacity(1),i=d.length-1;i>=0;i--)t=d[i],t._preSpiderfyLatlng&&(t.closePopup(),t.setLatLng(t._preSpiderfyLatlng),delete t._preSpiderfyLatlng,o=!0,t._setPos&&(t._setPos(_),o=!1),t.clusterHide&&(t.clusterHide(),o=!1),o&&u.removeLayer(t),c&&(n=t._spiderLeg,r=n._path,s=r.getTotalLength()+.1,r.style.strokeDashoffset=s,n.setStyle({opacity:0})));h._ignoreMove=!1,setTimeout(function(){var e=0;for(i=d.length-1;i>=0;i--)t=d[i],t._spiderLeg&&e++;for(i=d.length-1;i>=0;i--)t=d[i],t._spiderLeg&&(t.clusterShow&&t.clusterShow(),t.setZIndexOffset&&t.setZIndexOffset(0),e>1&&u.removeLayer(t),l.removeLayer(t._spiderLeg),delete t._spiderLeg);h._animationEnd(),h.fire("unspiderfied",{cluster:a,markers:d})},200)}}),L.MarkerClusterGroup.include({_spiderfied:null,unspiderfy:function(){this._unspiderfy.apply(this,arguments)},_spiderfierOnAdd:function(){this._map.on("click",this._unspiderfyWrapper,this),this._map.options.zoomAnimation&&this._map.on("zoomstart",this._unspiderfyZoomStart,this),this._map.on("zoomend",this._noanimationUnspiderfy,this),L.Browser.touch||this._map.getRenderer(this)},_spiderfierOnRemove:function(){this._map.off("click",this._unspiderfyWrapper,this),this._map.off("zoomstart",this._unspiderfyZoomStart,this),this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._map.off("zoomend",this._noanimationUnspiderfy,this),this._noanimationUnspiderfy()
},_unspiderfyZoomStart:function(){this._map&&this._map.on("zoomanim",this._unspiderfyZoomAnim,this)},_unspiderfyZoomAnim:function(e){L.DomUtil.hasClass(this._map._mapPane,"leaflet-touching")||(this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._unspiderfy(e))},_unspiderfyWrapper:function(){this._unspiderfy()},_unspiderfy:function(e){this._spiderfied&&this._spiderfied.unspiderfy(e)},_noanimationUnspiderfy:function(){this._spiderfied&&this._spiderfied._noanimationUnspiderfy()},_unspiderfyLayer:function(e){e._spiderLeg&&(this._featureGroup.removeLayer(e),e.clusterShow&&e.clusterShow(),e.setZIndexOffset&&e.setZIndexOffset(0),this._map.removeLayer(e._spiderLeg),delete e._spiderLeg)}}),L.MarkerClusterGroup.include({refreshClusters:function(e){return e?e instanceof L.MarkerClusterGroup?e=e._topClusterLevel.getAllChildMarkers():e instanceof L.LayerGroup?e=e._layers:e instanceof L.MarkerCluster?e=e.getAllChildMarkers():e instanceof L.Marker&&(e=[e]):e=this._topClusterLevel.getAllChildMarkers(),this._flagParentsIconsNeedUpdate(e),this._refreshClustersIcons(),this.options.singleMarkerMode&&this._refreshSingleMarkerModeMarkers(e),this},_flagParentsIconsNeedUpdate:function(e){var t,i;for(t in e)for(i=e[t].__parent;i;)i._iconNeedsUpdate=!0,i=i.__parent},_refreshSingleMarkerModeMarkers:function(e){var t,i;for(t in e)i=e[t],this.hasLayer(i)&&i.setIcon(this._overrideMarkerIcon(i))}}),L.Marker.include({refreshIconOptions:function(e,t){var i=this.options.icon;return L.setOptions(i,e),this.setIcon(i),t&&this.__parent&&this.__parent._group.refreshClusters(this),this}}),e.MarkerClusterGroup=t,e.MarkerCluster=i});
//# sourceMappingURL=leaflet.markercluster.js.map

var leafletControlGeocoder = (function (exports, L) {

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
            }
          });
        }
      });
    }
    n['default'] = e;
    return n;
  }

  var L__namespace = /*#__PURE__*/_interopNamespace(L);

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  /**
   * @internal
   */

  function geocodingParams(options, params) {
    return L__namespace.Util.extend(params, options.geocodingQueryParams);
  }
  /**
   * @internal
   */

  function reverseParams(options, params) {
    return L__namespace.Util.extend(params, options.reverseQueryParams);
  }

  /**
   * @internal
   */

  var lastCallbackId = 0; // Adapted from handlebars.js
  // https://github.com/wycats/handlebars.js/

  /**
   * @internal
   */

  var badChars = /[&<>"'`]/g;
  /**
   * @internal
   */

  var possible = /[&<>"'`]/;
  /**
   * @internal
   */

  var escape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  /**
   * @internal
   */

  function escapeChar(chr) {
    return escape[chr];
  }
  /**
   * @internal
   */


  function htmlEscape(string) {
    if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    } // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.


    string = '' + string;

    if (!possible.test(string)) {
      return string;
    }

    return string.replace(badChars, escapeChar);
  }
  /**
   * @internal
   */

  function jsonp(url, params, callback, context, jsonpParam) {
    var callbackId = '_l_geocoder_' + lastCallbackId++;
    params[jsonpParam || 'callback'] = callbackId;
    window[callbackId] = L__namespace.Util.bind(callback, context);
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url + getParamString(params);
    script.id = callbackId;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  /**
   * @internal
   */

  function getJSON(url, params, callback) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState !== 4) {
        return;
      }

      var message;

      if (xmlHttp.status !== 200 && xmlHttp.status !== 304) {
        message = '';
      } else if (typeof xmlHttp.response === 'string') {
        // IE doesn't parse JSON responses even with responseType: 'json'.
        try {
          message = JSON.parse(xmlHttp.response);
        } catch (e) {
          // Not a JSON response
          message = xmlHttp.response;
        }
      } else {
        message = xmlHttp.response;
      }

      callback(message);
    };

    xmlHttp.open('GET', url + getParamString(params), true);
    xmlHttp.responseType = 'json';
    xmlHttp.setRequestHeader('Accept', 'application/json');
    xmlHttp.send(null);
  }
  /**
   * @internal
   */

  function template(str, data) {
    return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
      var value = data[key];

      if (value === undefined) {
        value = '';
      } else if (typeof value === 'function') {
        value = value(data);
      }

      return htmlEscape(value);
    });
  }
  /**
   * @internal
   */

  function getParamString(obj, existingUrl, uppercase) {
    var params = [];

    for (var i in obj) {
      var key = encodeURIComponent(uppercase ? i.toUpperCase() : i);
      var value = obj[i];

      if (!Array.isArray(value)) {
        params.push(key + '=' + encodeURIComponent(String(value)));
      } else {
        for (var j = 0; j < value.length; j++) {
          params.push(key + '=' + encodeURIComponent(value[j]));
        }
      }
    }

    return (!existingUrl || existingUrl.indexOf('?') === -1 ? '?' : '&') + params.join('&');
  }

  /**
   * Implementation of the [ArcGIS geocoder](https://developers.arcgis.com/features/geocoding/)
   */

  var ArcGis = /*#__PURE__*/function () {
    function ArcGis(options) {
      this.options = {
        serviceUrl: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
        apiKey: ''
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = ArcGis.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        token: this.options.apiKey,
        SingleLine: query,
        outFields: 'Addr_Type',
        forStorage: false,
        maxLocations: 10,
        f: 'json'
      });
      getJSON(this.options.serviceUrl + '/findAddressCandidates', params, function (data) {
        var results = [];

        if (data.candidates && data.candidates.length) {
          for (var i = 0; i <= data.candidates.length - 1; i++) {
            var loc = data.candidates[i];
            var latLng = L__namespace.latLng(loc.location.y, loc.location.x);
            var latLngBounds = L__namespace.latLngBounds(L__namespace.latLng(loc.extent.ymax, loc.extent.xmax), L__namespace.latLng(loc.extent.ymin, loc.extent.xmin));
            results[i] = {
              name: loc.address,
              bbox: latLngBounds,
              center: latLng
            };
          }
        }

        cb.call(context, results);
      });
    };

    _proto.suggest = function suggest(query, cb, context) {
      return this.geocode(query, cb, context);
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var params = reverseParams(this.options, {
        location: location.lng + ',' + location.lat,
        distance: 100,
        f: 'json'
      });
      getJSON(this.options.serviceUrl + '/reverseGeocode', params, function (data) {
        var result = [];

        if (data && !data.error) {
          var center = L__namespace.latLng(data.location.y, data.location.x);
          var bbox = L__namespace.latLngBounds(center, center);
          result.push({
            name: data.address.Match_addr,
            center: center,
            bbox: bbox
          });
        }

        cb.call(context, result);
      });
    };

    return ArcGis;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link ArcGis}
   * @param options the options
   */

  function arcgis(options) {
    return new ArcGis(options);
  }

  /**
   * Implementation of the [Bing Locations API](https://docs.microsoft.com/en-us/bingmaps/rest-services/locations/)
   */

  var Bing = /*#__PURE__*/function () {
    function Bing(options) {
      this.options = {
        serviceUrl: 'https://dev.virtualearth.net/REST/v1/Locations'
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = Bing.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        query: query,
        key: this.options.apiKey
      });
      jsonp(this.options.apiKey, params, function (data) {
        var results = [];

        if (data.resourceSets.length > 0) {
          for (var i = data.resourceSets[0].resources.length - 1; i >= 0; i--) {
            var resource = data.resourceSets[0].resources[i],
                bbox = resource.bbox;
            results[i] = {
              name: resource.name,
              bbox: L__namespace.latLngBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
              center: L__namespace.latLng(resource.point.coordinates)
            };
          }
        }

        cb.call(context, results);
      }, this, 'jsonp');
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var params = reverseParams(this.options, {
        key: this.options.apiKey
      });
      jsonp(this.options.serviceUrl + location.lat + ',' + location.lng, params, function (data) {
        var results = [];

        for (var i = data.resourceSets[0].resources.length - 1; i >= 0; i--) {
          var resource = data.resourceSets[0].resources[i],
              bbox = resource.bbox;
          results[i] = {
            name: resource.name,
            bbox: L__namespace.latLngBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
            center: L__namespace.latLng(resource.point.coordinates)
          };
        }

        cb.call(context, results);
      }, this, 'jsonp');
    };

    return Bing;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Bing}
   * @param options the options
   */

  function bing(options) {
    return new Bing(options);
  }

  var Google = /*#__PURE__*/function () {
    function Google(options) {
      this.options = {
        serviceUrl: 'https://maps.googleapis.com/maps/api/geocode/json'
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = Google.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        key: this.options.apiKey,
        address: query
      });
      getJSON(this.options.serviceUrl, params, function (data) {
        var results = [];

        if (data.results && data.results.length) {
          for (var i = 0; i <= data.results.length - 1; i++) {
            var loc = data.results[i];
            var latLng = L__namespace.latLng(loc.geometry.location);
            var latLngBounds = L__namespace.latLngBounds(L__namespace.latLng(loc.geometry.viewport.northeast), L__namespace.latLng(loc.geometry.viewport.southwest));
            results[i] = {
              name: loc.formatted_address,
              bbox: latLngBounds,
              center: latLng,
              properties: loc.address_components
            };
          }
        }

        cb.call(context, results);
      });
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var params = reverseParams(this.options, {
        key: this.options.apiKey,
        latlng: location.lat + ',' + location.lng
      });
      getJSON(this.options.serviceUrl, params, function (data) {
        var results = [];

        if (data.results && data.results.length) {
          for (var i = 0; i <= data.results.length - 1; i++) {
            var loc = data.results[i];
            var center = L__namespace.latLng(loc.geometry.location);
            var bbox = L__namespace.latLngBounds(L__namespace.latLng(loc.geometry.viewport.northeast), L__namespace.latLng(loc.geometry.viewport.southwest));
            results[i] = {
              name: loc.formatted_address,
              bbox: bbox,
              center: center,
              properties: loc.address_components
            };
          }
        }

        cb.call(context, results);
      });
    };

    return Google;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Google}
   * @param options the options
   */

  function google(options) {
    return new Google(options);
  }

  /**
   * Implementation of the [HERE Geocoder API](https://developer.here.com/documentation/geocoder/topics/introduction.html)
   */

  var HERE = /*#__PURE__*/function () {
    function HERE(options) {
      this.options = {
        serviceUrl: 'https://geocoder.api.here.com/6.2/',
        app_id: '',
        app_code: '',
        apiKey: '',
        maxResults: 5
      };
      L__namespace.Util.setOptions(this, options);
      if (options.apiKey) throw Error('apiKey is not supported, use app_id/app_code instead!');
    }

    var _proto = HERE.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        searchtext: query,
        gen: 9,
        app_id: this.options.app_id,
        app_code: this.options.app_code,
        jsonattributes: 1,
        maxresults: this.options.maxResults
      });
      this.getJSON(this.options.serviceUrl + 'geocode.json', params, cb, context);
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var prox = location.lat + ',' + location.lng;

      if (this.options.reverseGeocodeProxRadius) {
        prox += ',' + this.options.reverseGeocodeProxRadius;
      }

      var params = reverseParams(this.options, {
        prox: prox,
        mode: 'retrieveAddresses',
        app_id: this.options.app_id,
        app_code: this.options.app_code,
        gen: 9,
        jsonattributes: 1,
        maxresults: this.options.maxResults
      });
      this.getJSON(this.options.serviceUrl + 'reversegeocode.json', params, cb, context);
    };

    _proto.getJSON = function getJSON$1(url, params, cb, context) {
      getJSON(url, params, function (data) {
        var results = [];

        if (data.response.view && data.response.view.length) {
          for (var i = 0; i <= data.response.view[0].result.length - 1; i++) {
            var loc = data.response.view[0].result[i].location;
            var center = L__namespace.latLng(loc.displayPosition.latitude, loc.displayPosition.longitude);
            var bbox = L__namespace.latLngBounds(L__namespace.latLng(loc.mapView.topLeft.latitude, loc.mapView.topLeft.longitude), L__namespace.latLng(loc.mapView.bottomRight.latitude, loc.mapView.bottomRight.longitude));
            results[i] = {
              name: loc.address.label,
              properties: loc.address,
              bbox: bbox,
              center: center
            };
          }
        }

        cb.call(context, results);
      });
    };

    return HERE;
  }();
  /**
   * Implementation of the new [HERE Geocoder API](https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html)
   */

  var HEREv2 = /*#__PURE__*/function () {
    function HEREv2(options) {
      this.options = {
        serviceUrl: 'https://geocode.search.hereapi.com/v1',
        apiKey: '',
        app_id: '',
        app_code: '',
        maxResults: 10
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto2 = HEREv2.prototype;

    _proto2.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        q: query,
        apiKey: this.options.apiKey,
        limit: this.options.maxResults
      });

      if (!params.at && !params["in"]) {
        throw Error('at / in parameters not found. Please define coordinates (at=latitude,longitude) or other (in) in your geocodingQueryParams.');
      }

      this.getJSON(this.options.serviceUrl + '/discover', params, cb, context);
    };

    _proto2.reverse = function reverse(location, scale, cb, context) {
      var params = reverseParams(this.options, {
        at: location.lat + ',' + location.lng,
        limit: this.options.reverseGeocodeProxRadius,
        apiKey: this.options.apiKey
      });
      this.getJSON(this.options.serviceUrl + '/revgeocode', params, cb, context);
    };

    _proto2.getJSON = function getJSON$1(url, params, cb, context) {
      getJSON(url, params, function (data) {
        var results = [];

        if (data.items && data.items.length) {
          for (var i = 0; i <= data.items.length - 1; i++) {
            var item = data.items[i];
            var latLng = L__namespace.latLng(item.position.lat, item.position.lng);
            var bbox = void 0;

            if (item.mapView) {
              bbox = L__namespace.latLngBounds(L__namespace.latLng(item.mapView.south, item.mapView.west), L__namespace.latLng(item.mapView.north, item.mapView.east));
            } else {
              // Using only position when not provided
              bbox = L__namespace.latLngBounds(L__namespace.latLng(item.position.lat, item.position.lng), L__namespace.latLng(item.position.lat, item.position.lng));
            }

            results[i] = {
              name: item.address.label,
              properties: item.address,
              bbox: bbox,
              center: latLng
            };
          }
        }

        cb.call(context, results);
      });
    };

    return HEREv2;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link HERE}
   * @param options the options
   */

  function here(options) {
    if (options.apiKey) {
      return new HEREv2(options);
    } else {
      return new HERE(options);
    }
  }

  /**
   * Parses basic latitude/longitude strings such as `'50.06773 14.37742'`, `'N50.06773 W14.37742'`, `'S 50° 04.064 E 014° 22.645'`, or `'S 50° 4′ 03.828″, W 14° 22′ 38.712″'`
   * @param query the latitude/longitude string to parse
   * @returns the parsed latitude/longitude
   */

  function parseLatLng(query) {
    var match; // regex from https://github.com/openstreetmap/openstreetmap-website/blob/master/app/controllers/geocoder_controller.rb

    if (match = query.match(/^([NS])\s*(\d{1,3}(?:\.\d*)?)\W*([EW])\s*(\d{1,3}(?:\.\d*)?)$/)) {
      // [NSEW] decimal degrees
      return L__namespace.latLng((/N/i.test(match[1]) ? 1 : -1) * +match[2], (/E/i.test(match[3]) ? 1 : -1) * +match[4]);
    } else if (match = query.match(/^(\d{1,3}(?:\.\d*)?)\s*([NS])\W*(\d{1,3}(?:\.\d*)?)\s*([EW])$/)) {
      // decimal degrees [NSEW]
      return L__namespace.latLng((/N/i.test(match[2]) ? 1 : -1) * +match[1], (/E/i.test(match[4]) ? 1 : -1) * +match[3]);
    } else if (match = query.match(/^([NS])\s*(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?\W*([EW])\s*(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?$/)) {
      // [NSEW] degrees, decimal minutes
      return L__namespace.latLng((/N/i.test(match[1]) ? 1 : -1) * (+match[2] + +match[3] / 60), (/E/i.test(match[4]) ? 1 : -1) * (+match[5] + +match[6] / 60));
    } else if (match = query.match(/^(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?\s*([NS])\W*(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?\s*([EW])$/)) {
      // degrees, decimal minutes [NSEW]
      return L__namespace.latLng((/N/i.test(match[3]) ? 1 : -1) * (+match[1] + +match[2] / 60), (/E/i.test(match[6]) ? 1 : -1) * (+match[4] + +match[5] / 60));
    } else if (match = query.match(/^([NS])\s*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]?\W*([EW])\s*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]?$/)) {
      // [NSEW] degrees, minutes, decimal seconds
      return L__namespace.latLng((/N/i.test(match[1]) ? 1 : -1) * (+match[2] + +match[3] / 60 + +match[4] / 3600), (/E/i.test(match[5]) ? 1 : -1) * (+match[6] + +match[7] / 60 + +match[8] / 3600));
    } else if (match = query.match(/^(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]\s*([NS])\W*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]?\s*([EW])$/)) {
      // degrees, minutes, decimal seconds [NSEW]
      return L__namespace.latLng((/N/i.test(match[4]) ? 1 : -1) * (+match[1] + +match[2] / 60 + +match[3] / 3600), (/E/i.test(match[8]) ? 1 : -1) * (+match[5] + +match[6] / 60 + +match[7] / 3600));
    } else if (match = query.match(/^\s*([+-]?\d+(?:\.\d*)?)\s*[\s,]\s*([+-]?\d+(?:\.\d*)?)\s*$/)) {
      return L__namespace.latLng(+match[1], +match[2]);
    }
  }
  /**
   * Parses basic latitude/longitude strings such as `'50.06773 14.37742'`, `'N50.06773 W14.37742'`, `'S 50° 04.064 E 014° 22.645'`, or `'S 50° 4′ 03.828″, W 14° 22′ 38.712″'`
   */

  var LatLng = /*#__PURE__*/function () {
    function LatLng(options) {
      this.options = {
        next: undefined,
        sizeInMeters: 10000
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = LatLng.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var center = parseLatLng(query);

      if (center) {
        var results = [{
          name: query,
          center: center,
          bbox: center.toBounds(this.options.sizeInMeters)
        }];
        cb.call(context, results);
      } else if (this.options.next) {
        this.options.next.geocode(query, cb, context);
      }
    };

    return LatLng;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link LatLng}
   * @param options the options
   */

  function latLng(options) {
    return new LatLng(options);
  }

  /**
   * Implementation of the [Mapbox Geocoding](https://www.mapbox.com/api-documentation/#geocoding)
   */

  var Mapbox = /*#__PURE__*/function () {
    function Mapbox(options) {
      this.options = {
        serviceUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = Mapbox.prototype;

    _proto._getProperties = function _getProperties(loc) {
      var properties = {
        text: loc.text,
        address: loc.address
      };

      for (var j = 0; j < (loc.context || []).length; j++) {
        var id = loc.context[j].id.split('.')[0];
        properties[id] = loc.context[j].text; // Get country code when available

        if (loc.context[j].short_code) {
          properties['countryShortCode'] = loc.context[j].short_code;
        }
      }

      return properties;
    };

    _proto.geocode = function geocode(query, cb, context) {
      var _this = this;

      var params = geocodingParams(this.options, {
        access_token: this.options.apiKey
      });

      if (params.proximity !== undefined && params.proximity.lat !== undefined && params.proximity.lng !== undefined) {
        params.proximity = params.proximity.lng + ',' + params.proximity.lat;
      }

      getJSON(this.options.serviceUrl + encodeURIComponent(query) + '.json', params, function (data) {
        var results = [];

        if (data.features && data.features.length) {
          for (var i = 0; i <= data.features.length - 1; i++) {
            var loc = data.features[i];
            var center = L__namespace.latLng(loc.center.reverse());
            var bbox = void 0;

            if (loc.bbox) {
              bbox = L__namespace.latLngBounds(L__namespace.latLng(loc.bbox.slice(0, 2).reverse()), L__namespace.latLng(loc.bbox.slice(2, 4).reverse()));
            } else {
              bbox = L__namespace.latLngBounds(center, center);
            }

            results[i] = {
              name: loc.place_name,
              bbox: bbox,
              center: center,
              properties: _this._getProperties(loc)
            };
          }
        }

        cb.call(context, results);
      });
    };

    _proto.suggest = function suggest(query, cb, context) {
      return this.geocode(query, cb, context);
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var _this2 = this;

      var url = this.options.serviceUrl + location.lng + ',' + location.lat + '.json';
      var param = reverseParams(this.options, {
        access_token: this.options.apiKey
      });
      getJSON(url, param, function (data) {
        var results = [];

        if (data.features && data.features.length) {
          for (var i = 0; i <= data.features.length - 1; i++) {
            var loc = data.features[i];
            var center = L__namespace.latLng(loc.center.reverse());
            var bbox = void 0;

            if (loc.bbox) {
              bbox = L__namespace.latLngBounds(L__namespace.latLng(loc.bbox.slice(0, 2).reverse()), L__namespace.latLng(loc.bbox.slice(2, 4).reverse()));
            } else {
              bbox = L__namespace.latLngBounds(center, center);
            }

            results[i] = {
              name: loc.place_name,
              bbox: bbox,
              center: center,
              properties: _this2._getProperties(loc)
            };
          }
        }

        cb.call(context, results);
      });
    };

    return Mapbox;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Mapbox}
   * @param options the options
   */

  function mapbox(options) {
    return new Mapbox(options);
  }

  /**
   * Implementation of the [MapQuest Geocoding API](http://developer.mapquest.com/web/products/dev-services/geocoding-ws)
   */

  var MapQuest = /*#__PURE__*/function () {
    function MapQuest(options) {
      this.options = {
        serviceUrl: 'https://www.mapquestapi.com/geocoding/v1'
      };
      L__namespace.Util.setOptions(this, options); // MapQuest seems to provide URI encoded API keys,
      // so to avoid encoding them twice, we decode them here

      this.options.apiKey = decodeURIComponent(this.options.apiKey);
    }

    var _proto = MapQuest.prototype;

    _proto._formatName = function _formatName() {
      return [].slice.call(arguments).filter(function (s) {
        return !!s;
      }).join(', ');
    };

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        key: this.options.apiKey,
        location: query,
        limit: 5,
        outFormat: 'json'
      });
      getJSON(this.options.serviceUrl + '/address', params, L__namespace.Util.bind(function (data) {
        var results = [];

        if (data.results && data.results[0].locations) {
          for (var i = data.results[0].locations.length - 1; i >= 0; i--) {
            var loc = data.results[0].locations[i];
            var center = L__namespace.latLng(loc.latLng);
            results[i] = {
              name: this._formatName(loc.street, loc.adminArea4, loc.adminArea3, loc.adminArea1),
              bbox: L__namespace.latLngBounds(center, center),
              center: center
            };
          }
        }

        cb.call(context, results);
      }, this));
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var params = reverseParams(this.options, {
        key: this.options.apiKey,
        location: location.lat + ',' + location.lng,
        outputFormat: 'json'
      });
      getJSON(this.options.serviceUrl + '/reverse', params, L__namespace.Util.bind(function (data) {
        var results = [];

        if (data.results && data.results[0].locations) {
          for (var i = data.results[0].locations.length - 1; i >= 0; i--) {
            var loc = data.results[0].locations[i];
            var center = L__namespace.latLng(loc.latLng);
            results[i] = {
              name: this._formatName(loc.street, loc.adminArea4, loc.adminArea3, loc.adminArea1),
              bbox: L__namespace.latLngBounds(center, center),
              center: center
            };
          }
        }

        cb.call(context, results);
      }, this));
    };

    return MapQuest;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link MapQuest}
   * @param options the options
   */

  function mapQuest(options) {
    return new MapQuest(options);
  }

  /**
   * Implementation of the [Neutrino API](https://www.neutrinoapi.com/api/geocode-address/)
   */

  var Neutrino = /*#__PURE__*/function () {
    function Neutrino(options) {
      this.options = {
        userId: undefined,
        apiKey: undefined,
        serviceUrl: 'https://neutrinoapi.com/'
      };
      L__namespace.Util.setOptions(this, options);
    } // https://www.neutrinoapi.com/api/geocode-address/


    var _proto = Neutrino.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        apiKey: this.options.apiKey,
        userId: this.options.userId,
        //get three words and make a dot based string
        address: query.split(/\s+/).join('.')
      });
      getJSON(this.options.serviceUrl + 'geocode-address', params, function (data) {
        var results = [];

        if (data.locations) {
          data.geometry = data.locations[0];
          var center = L__namespace.latLng(data.geometry['latitude'], data.geometry['longitude']);
          var bbox = L__namespace.latLngBounds(center, center);
          results[0] = {
            name: data.geometry.address,
            bbox: bbox,
            center: center
          };
        }

        cb.call(context, results);
      });
    };

    _proto.suggest = function suggest(query, cb, context) {
      return this.geocode(query, cb, context);
    } // https://www.neutrinoapi.com/api/geocode-reverse/
    ;

    _proto.reverse = function reverse(location, scale, cb, context) {
      var params = reverseParams(this.options, {
        apiKey: this.options.apiKey,
        userId: this.options.userId,
        latitude: location.lat,
        longitude: location.lng
      });
      getJSON(this.options.serviceUrl + 'geocode-reverse', params, function (data) {
        var results = [];

        if (data.status.status == 200 && data.found) {
          var center = L__namespace.latLng(location.lat, location.lng);
          var bbox = L__namespace.latLngBounds(center, center);
          results[0] = {
            name: data.address,
            bbox: bbox,
            center: center
          };
        }

        cb.call(context, results);
      });
    };

    return Neutrino;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Neutrino}
   * @param options the options
   */

  function neutrino(options) {
    return new Neutrino(options);
  }

  /**
   * Implementation of the [Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim) geocoder.
   *
   * This is the default geocoding service used by the control, unless otherwise specified in the options.
   *
   * Unless using your own Nominatim installation, please refer to the [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/).
   */

  var Nominatim = /*#__PURE__*/function () {
    function Nominatim(options) {
      this.options = {
        serviceUrl: 'https://nominatim.openstreetmap.org/',
        htmlTemplate: function htmlTemplate(r) {
          var address = r.address;
          var className;
          var parts = [];

          if (address.road || address.building) {
            parts.push('{building} {road} {house_number}');
          }

          if (address.city || address.town || address.village || address.hamlet) {
            className = parts.length > 0 ? 'leaflet-control-geocoder-address-detail' : '';
            parts.push('<span class="' + className + '">{postcode} {city} {town} {village} {hamlet}</span>');
          }

          if (address.state || address.country) {
            className = parts.length > 0 ? 'leaflet-control-geocoder-address-context' : '';
            parts.push('<span class="' + className + '">{state} {country}</span>');
          }

          return template(parts.join('<br/>'), address);
        }
      };
      L__namespace.Util.setOptions(this, options || {});
    }

    var _proto = Nominatim.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var _this = this;

      var params = geocodingParams(this.options, {
        q: query,
        limit: 5,
        format: 'json',
        addressdetails: 1
      });
      getJSON(this.options.serviceUrl + 'search', params, function (data) {
        var results = [];

        for (var i = data.length - 1; i >= 0; i--) {
          var bbox = data[i].boundingbox;

          for (var j = 0; j < 4; j++) {
            bbox[j] = +bbox[j];
          }

          results[i] = {
            icon: data[i].icon,
            name: data[i].display_name,
            html: _this.options.htmlTemplate ? _this.options.htmlTemplate(data[i]) : undefined,
            bbox: L__namespace.latLngBounds([bbox[0], bbox[2]], [bbox[1], bbox[3]]),
            center: L__namespace.latLng(data[i].lat, data[i].lon),
            properties: data[i]
          };
        }

        cb.call(context, results);
      });
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var _this2 = this;

      var params = reverseParams(this.options, {
        lat: location.lat,
        lon: location.lng,
        zoom: Math.round(Math.log(scale / 256) / Math.log(2)),
        addressdetails: 1,
        format: 'json'
      });
      getJSON(this.options.serviceUrl + 'reverse', params, function (data) {
        var result = [];

        if (data && data.lat && data.lon) {
          var center = L__namespace.latLng(data.lat, data.lon);
          var bbox = L__namespace.latLngBounds(center, center);
          result.push({
            name: data.display_name,
            html: _this2.options.htmlTemplate ? _this2.options.htmlTemplate(data) : undefined,
            center: center,
            bbox: bbox,
            properties: data
          });
        }

        cb.call(context, result);
      });
    };

    return Nominatim;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Nominatim}
   * @param options the options
   */

  function nominatim(options) {
    return new Nominatim(options);
  }

  /**
   * Implementation of the [Plus codes](https://plus.codes/) (formerly OpenLocationCode) (requires [open-location-code](https://www.npmjs.com/package/open-location-code))
   */

  var OpenLocationCode = /*#__PURE__*/function () {
    function OpenLocationCode(options) {
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = OpenLocationCode.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      try {
        var decoded = this.options.OpenLocationCode.decode(query);
        var result = {
          name: query,
          center: L__namespace.latLng(decoded.latitudeCenter, decoded.longitudeCenter),
          bbox: L__namespace.latLngBounds(L__namespace.latLng(decoded.latitudeLo, decoded.longitudeLo), L__namespace.latLng(decoded.latitudeHi, decoded.longitudeHi))
        };
        cb.call(context, [result]);
      } catch (e) {
        console.warn(e); // eslint-disable-line no-console

        cb.call(context, []);
      }
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      try {
        var code = this.options.OpenLocationCode.encode(location.lat, location.lng, this.options.codeLength);
        var result = {
          name: code,
          center: L__namespace.latLng(location.lat, location.lng),
          bbox: L__namespace.latLngBounds(L__namespace.latLng(location.lat, location.lng), L__namespace.latLng(location.lat, location.lng))
        };
        cb.call(context, [result]);
      } catch (e) {
        console.warn(e); // eslint-disable-line no-console

        cb.call(context, []);
      }
    };

    return OpenLocationCode;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link OpenLocationCode}
   * @param options the options
   */

  function openLocationCode(options) {
    return new OpenLocationCode(options);
  }

  /**
   * Implementation of the [OpenCage Data API](https://opencagedata.com/)
   */

  var OpenCage = /*#__PURE__*/function () {
    function OpenCage(options) {
      this.options = {
        serviceUrl: 'https://api.opencagedata.com/geocode/v1/json'
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = OpenCage.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        key: this.options.apiKey,
        q: query
      });
      getJSON(this.options.serviceUrl, params, function (data) {
        var results = [];

        if (data.results && data.results.length) {
          for (var i = 0; i < data.results.length; i++) {
            var loc = data.results[i];
            var center = L__namespace.latLng(loc.geometry);
            var bbox = void 0;

            if (loc.annotations && loc.annotations.bounds) {
              bbox = L__namespace.latLngBounds(L__namespace.latLng(loc.annotations.bounds.northeast), L__namespace.latLng(loc.annotations.bounds.southwest));
            } else {
              bbox = L__namespace.latLngBounds(center, center);
            }

            results.push({
              name: loc.formatted,
              bbox: bbox,
              center: center
            });
          }
        }

        cb.call(context, results);
      });
    };

    _proto.suggest = function suggest(query, cb, context) {
      return this.geocode(query, cb, context);
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var params = reverseParams(this.options, {
        key: this.options.apiKey,
        q: [location.lat, location.lng].join(',')
      });
      getJSON(this.options.serviceUrl, params, function (data) {
        var results = [];

        if (data.results && data.results.length) {
          for (var i = 0; i < data.results.length; i++) {
            var loc = data.results[i];
            var center = L__namespace.latLng(loc.geometry);
            var bbox = void 0;

            if (loc.annotations && loc.annotations.bounds) {
              bbox = L__namespace.latLngBounds(L__namespace.latLng(loc.annotations.bounds.northeast), L__namespace.latLng(loc.annotations.bounds.southwest));
            } else {
              bbox = L__namespace.latLngBounds(center, center);
            }

            results.push({
              name: loc.formatted,
              bbox: bbox,
              center: center
            });
          }
        }

        cb.call(context, results);
      });
    };

    return OpenCage;
  }();
  function opencage(options) {
    return new OpenCage(options);
  }

  /**
   * Implementation of the [Pelias](https://pelias.io/), [geocode.earth](https://geocode.earth/) geocoder (formerly Mapzen Search)
   */

  var Pelias = /*#__PURE__*/function () {
    function Pelias(options) {
      this.options = {
        serviceUrl: 'https://api.geocode.earth/v1'
      };
      this._lastSuggest = 0;
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = Pelias.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var _this = this;

      var params = geocodingParams(this.options, {
        api_key: this.options.apiKey,
        text: query
      });
      getJSON(this.options.serviceUrl + '/search', params, function (data) {
        cb.call(context, _this._parseResults(data, 'bbox'));
      });
    };

    _proto.suggest = function suggest(query, cb, context) {
      var _this2 = this;

      var params = geocodingParams(this.options, {
        api_key: this.options.apiKey,
        text: query
      });
      getJSON(this.options.serviceUrl + '/autocomplete', params, function (data) {
        if (data.geocoding.timestamp > _this2._lastSuggest) {
          _this2._lastSuggest = data.geocoding.timestamp;
          cb.call(context, _this2._parseResults(data, 'bbox'));
        }
      });
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var _this3 = this;

      var params = reverseParams(this.options, {
        api_key: this.options.apiKey,
        'point.lat': location.lat,
        'point.lon': location.lng
      });
      getJSON(this.options.serviceUrl + '/reverse', params, function (data) {
        cb.call(context, _this3._parseResults(data, 'bounds'));
      });
    };

    _proto._parseResults = function _parseResults(data, bboxname) {
      var results = [];
      L__namespace.geoJSON(data, {
        pointToLayer: function pointToLayer(feature, latlng) {
          return L__namespace.circleMarker(latlng);
        },
        onEachFeature: function onEachFeature(feature, layer) {
          var result = {};
          var bbox;
          var center;

          if (layer.getBounds) {
            bbox = layer.getBounds();
            center = bbox.getCenter();
          } else if (layer.feature.bbox) {
            center = layer.getLatLng();
            bbox = L__namespace.latLngBounds(L__namespace.GeoJSON.coordsToLatLng(layer.feature.bbox.slice(0, 2)), L__namespace.GeoJSON.coordsToLatLng(layer.feature.bbox.slice(2, 4)));
          } else {
            center = layer.getLatLng();
            bbox = L__namespace.latLngBounds(center, center);
          }

          result.name = layer.feature.properties.label;
          result.center = center;
          result[bboxname] = bbox;
          result.properties = layer.feature.properties;
          results.push(result);
        }
      });
      return results;
    };

    return Pelias;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Pelias}
   * @param options the options
   */

  function pelias(options) {
    return new Pelias(options);
  }
  var GeocodeEarth = Pelias;
  var geocodeEarth = pelias;
  /**
   * r.i.p.
   * @deprecated
   */

  var Mapzen = Pelias;
  /**
   * r.i.p.
   * @deprecated
   */

  var mapzen = pelias;
  /**
   * Implementation of the [Openrouteservice](https://openrouteservice.org/dev/#/api-docs/geocode) geocoder
   */

  var Openrouteservice = /*#__PURE__*/function (_Pelias) {
    _inheritsLoose(Openrouteservice, _Pelias);

    function Openrouteservice(options) {
      return _Pelias.call(this, L__namespace.Util.extend({
        serviceUrl: 'https://api.openrouteservice.org/geocode'
      }, options)) || this;
    }

    return Openrouteservice;
  }(Pelias);
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Openrouteservice}
   * @param options the options
   */

  function openrouteservice(options) {
    return new Openrouteservice(options);
  }

  /**
   * Implementation of the [Photon](http://photon.komoot.de/) geocoder
   */

  var Photon = /*#__PURE__*/function () {
    function Photon(options) {
      this.options = {
        serviceUrl: 'https://photon.komoot.io/api/',
        reverseUrl: 'https://photon.komoot.io/reverse/',
        nameProperties: ['name', 'street', 'suburb', 'hamlet', 'town', 'city', 'state', 'country']
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = Photon.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        q: query
      });
      getJSON(this.options.serviceUrl, params, L__namespace.Util.bind(function (data) {
        cb.call(context, this._decodeFeatures(data));
      }, this));
    };

    _proto.suggest = function suggest(query, cb, context) {
      return this.geocode(query, cb, context);
    };

    _proto.reverse = function reverse(latLng, scale, cb, context) {
      var params = reverseParams(this.options, {
        lat: latLng.lat,
        lon: latLng.lng
      });
      getJSON(this.options.reverseUrl, params, L__namespace.Util.bind(function (data) {
        cb.call(context, this._decodeFeatures(data));
      }, this));
    };

    _proto._decodeFeatures = function _decodeFeatures(data) {
      var results = [];

      if (data && data.features) {
        for (var i = 0; i < data.features.length; i++) {
          var f = data.features[i];
          var c = f.geometry.coordinates;
          var center = L__namespace.latLng(c[1], c[0]);
          var extent = f.properties.extent;
          var bbox = extent ? L__namespace.latLngBounds([extent[1], extent[0]], [extent[3], extent[2]]) : L__namespace.latLngBounds(center, center);
          results.push({
            name: this._decodeFeatureName(f),
            html: this.options.htmlTemplate ? this.options.htmlTemplate(f) : undefined,
            center: center,
            bbox: bbox,
            properties: f.properties
          });
        }
      }

      return results;
    };

    _proto._decodeFeatureName = function _decodeFeatureName(f) {
      return (this.options.nameProperties || []).map(function (p) {
        return f.properties[p];
      }).filter(function (v) {
        return !!v;
      }).join(', ');
    };

    return Photon;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Photon}
   * @param options the options
   */

  function photon(options) {
    return new Photon(options);
  }

  /**
   * Implementation of the What3Words service
   */

  var What3Words = /*#__PURE__*/function () {
    function What3Words(options) {
      this.options = {
        serviceUrl: 'https://api.what3words.com/v2/'
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = What3Words.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      //get three words and make a dot based string
      getJSON(this.options.serviceUrl + 'forward', geocodingParams(this.options, {
        key: this.options.apiKey,
        addr: query.split(/\s+/).join('.')
      }), function (data) {
        var results = [];

        if (data.geometry) {
          var latLng = L__namespace.latLng(data.geometry['lat'], data.geometry['lng']);
          var latLngBounds = L__namespace.latLngBounds(latLng, latLng);
          results[0] = {
            name: data.words,
            bbox: latLngBounds,
            center: latLng
          };
        }

        cb.call(context, results);
      });
    };

    _proto.suggest = function suggest(query, cb, context) {
      return this.geocode(query, cb, context);
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      getJSON(this.options.serviceUrl + 'reverse', reverseParams(this.options, {
        key: this.options.apiKey,
        coords: [location.lat, location.lng].join(',')
      }), function (data) {
        var results = [];

        if (data.status.status == 200) {
          var center = L__namespace.latLng(data.geometry['lat'], data.geometry['lng']);
          var bbox = L__namespace.latLngBounds(center, center);
          results[0] = {
            name: data.words,
            bbox: bbox,
            center: center
          };
        }

        cb.call(context, results);
      });
    };

    return What3Words;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link What3Words}
   * @param options the options
   */

  function what3words(options) {
    return new What3Words(options);
  }

  var geocoders = {
    __proto__: null,
    geocodingParams: geocodingParams,
    reverseParams: reverseParams,
    ArcGis: ArcGis,
    arcgis: arcgis,
    Bing: Bing,
    bing: bing,
    Google: Google,
    google: google,
    HERE: HERE,
    HEREv2: HEREv2,
    here: here,
    parseLatLng: parseLatLng,
    LatLng: LatLng,
    latLng: latLng,
    Mapbox: Mapbox,
    mapbox: mapbox,
    MapQuest: MapQuest,
    mapQuest: mapQuest,
    Neutrino: Neutrino,
    neutrino: neutrino,
    Nominatim: Nominatim,
    nominatim: nominatim,
    OpenLocationCode: OpenLocationCode,
    openLocationCode: openLocationCode,
    OpenCage: OpenCage,
    opencage: opencage,
    Pelias: Pelias,
    pelias: pelias,
    GeocodeEarth: GeocodeEarth,
    geocodeEarth: geocodeEarth,
    Mapzen: Mapzen,
    mapzen: mapzen,
    Openrouteservice: Openrouteservice,
    openrouteservice: openrouteservice,
    Photon: Photon,
    photon: photon,
    What3Words: What3Words,
    what3words: what3words
  };

  /**
   * Leaflet mixins https://leafletjs.com/reference-1.7.1.html#class-includes
   * for TypeScript https://www.typescriptlang.org/docs/handbook/mixins.html
   * @internal
   */

  var EventedControl = // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function EventedControl() {// empty
  };

  L__namespace.Util.extend(EventedControl.prototype, L__namespace.Control.prototype);
  L__namespace.Util.extend(EventedControl.prototype, L__namespace.Evented.prototype);
  /**
   * This is the geocoder control. It works like any other [Leaflet control](https://leafletjs.com/reference.html#control), and is added to the map.
   */

  var GeocoderControl = /*#__PURE__*/function (_EventedControl) {
    _inheritsLoose(GeocoderControl, _EventedControl);

    /**
     * Instantiates a geocoder control (to be invoked using `new`)
     * @param options the options
     */
    function GeocoderControl(options) {
      var _this;

      _this = _EventedControl.call(this, options) || this;
      _this.options = {
        showUniqueResult: true,
        showResultIcons: false,
        collapsed: true,
        expand: 'touch',
        position: 'topright',
        placeholder: 'Search...',
        errorMessage: 'Nothing found.',
        iconLabel: 'Initiate a new search',
        query: '',
        queryMinLength: 1,
        suggestMinLength: 3,
        suggestTimeout: 250,
        defaultMarkGeocode: true
      };
      _this._requestCount = 0;
      L__namespace.Util.setOptions(_assertThisInitialized(_this), options);

      if (!_this.options.geocoder) {
        _this.options.geocoder = new Nominatim();
      }

      return _this;
    }

    var _proto = GeocoderControl.prototype;

    _proto.addThrobberClass = function addThrobberClass() {
      L__namespace.DomUtil.addClass(this._container, 'leaflet-control-geocoder-throbber');
    };

    _proto.removeThrobberClass = function removeThrobberClass() {
      L__namespace.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-throbber');
    }
    /**
     * Returns the container DOM element for the control and add listeners on relevant map events.
     * @param map the map instance
     * @see https://leafletjs.com/reference.html#control-onadd
     */
    ;

    _proto.onAdd = function onAdd(map) {
      var _this2 = this;

      var className = 'leaflet-control-geocoder';
      var container = L__namespace.DomUtil.create('div', className + ' leaflet-bar');
      var icon = L__namespace.DomUtil.create('button', className + '-icon', container);
      var form = this._form = L__namespace.DomUtil.create('div', className + '-form', container);
      this._map = map;
      this._container = container;
      icon.innerHTML = '&nbsp;';
      icon.type = 'button';
      icon.setAttribute('aria-label', this.options.iconLabel);
      var input = this._input = L__namespace.DomUtil.create('input', '', form);
      input.type = 'text';
      input.value = this.options.query;
      input.placeholder = this.options.placeholder;
      L__namespace.DomEvent.disableClickPropagation(input);
      this._errorElement = L__namespace.DomUtil.create('div', className + '-form-no-error', container);
      this._errorElement.innerHTML = this.options.errorMessage;
      this._alts = L__namespace.DomUtil.create('ul', className + '-alternatives leaflet-control-geocoder-alternatives-minimized', container);
      L__namespace.DomEvent.disableClickPropagation(this._alts);
      L__namespace.DomEvent.addListener(input, 'keydown', this._keydown, this);

      if (this.options.geocoder.suggest) {
        L__namespace.DomEvent.addListener(input, 'input', this._change, this);
      }

      L__namespace.DomEvent.addListener(input, 'blur', function () {
        if (_this2.options.collapsed && !_this2._preventBlurCollapse) {
          _this2._collapse();
        }

        _this2._preventBlurCollapse = false;
      });

      if (this.options.collapsed) {
        if (this.options.expand === 'click') {
          L__namespace.DomEvent.addListener(container, 'click', function (e) {
            if (e.button === 0 && e.detail !== 2) {
              _this2._toggle();
            }
          });
        } else if (this.options.expand === 'touch') {
          L__namespace.DomEvent.addListener(container, L__namespace.Browser.touch ? 'touchstart mousedown' : 'mousedown', function (e) {
            _this2._toggle();

            e.preventDefault(); // mobile: clicking focuses the icon, so UI expands and immediately collapses

            e.stopPropagation();
          }, this);
        } else {
          L__namespace.DomEvent.addListener(container, 'mouseover', this._expand, this);
          L__namespace.DomEvent.addListener(container, 'mouseout', this._collapse, this);

          this._map.on('movestart', this._collapse, this);
        }
      } else {
        this._expand();

        if (L__namespace.Browser.touch) {
          L__namespace.DomEvent.addListener(container, 'touchstart', function () {
            return _this2._geocode();
          });
        } else {
          L__namespace.DomEvent.addListener(container, 'click', function () {
            return _this2._geocode();
          });
        }
      }

      if (this.options.defaultMarkGeocode) {
        this.on('markgeocode', this.markGeocode, this);
      }

      this.on('startgeocode', this.addThrobberClass, this);
      this.on('finishgeocode', this.removeThrobberClass, this);
      this.on('startsuggest', this.addThrobberClass, this);
      this.on('finishsuggest', this.removeThrobberClass, this);
      L__namespace.DomEvent.disableClickPropagation(container);
      return container;
    }
    /**
     * Sets the query string on the text input
     * @param string the query string
     */
    ;

    _proto.setQuery = function setQuery(string) {
      this._input.value = string;
      return this;
    };

    _proto._geocodeResult = function _geocodeResult(results, suggest) {
      if (!suggest && this.options.showUniqueResult && results.length === 1) {
        this._geocodeResultSelected(results[0]);
      } else if (results.length > 0) {
        this._alts.innerHTML = '';
        this._results = results;
        L__namespace.DomUtil.removeClass(this._alts, 'leaflet-control-geocoder-alternatives-minimized');
        L__namespace.DomUtil.addClass(this._container, 'leaflet-control-geocoder-options-open');

        for (var i = 0; i < results.length; i++) {
          this._alts.appendChild(this._createAlt(results[i], i));
        }
      } else {
        L__namespace.DomUtil.addClass(this._container, 'leaflet-control-geocoder-options-error');
        L__namespace.DomUtil.addClass(this._errorElement, 'leaflet-control-geocoder-error');
      }
    }
    /**
     * Marks a geocoding result on the map
     * @param result the geocoding result
     */
    ;

    _proto.markGeocode = function markGeocode(event) {
      var result = event.geocode;

      this._map.fitBounds(result.bbox);

      if (this._geocodeMarker) {
        this._map.removeLayer(this._geocodeMarker);
      }

      this._geocodeMarker = new L__namespace.Marker(result.center).bindPopup(result.html || result.name).addTo(this._map).openPopup();
      return this;
    };

    _proto._geocode = function _geocode(suggest) {
      var _this3 = this;

      var value = this._input.value;

      if (!suggest && value.length < this.options.queryMinLength) {
        return;
      }

      var requestCount = ++this._requestCount;

      var cb = function cb(results) {
        if (requestCount === _this3._requestCount) {
          var _event = {
            input: value,
            results: results
          };

          _this3.fire(suggest ? 'finishsuggest' : 'finishgeocode', _event);

          _this3._geocodeResult(results, suggest);
        }
      };

      this._lastGeocode = value;

      if (!suggest) {
        this._clearResults();
      }

      var event = {
        input: value
      };
      this.fire(suggest ? 'startsuggest' : 'startgeocode', event);

      if (suggest) {
        this.options.geocoder.suggest(value, cb);
      } else {
        this.options.geocoder.geocode(value, cb);
      }
    };

    _proto._geocodeResultSelected = function _geocodeResultSelected(geocode) {
      var event = {
        geocode: geocode
      };
      this.fire('markgeocode', event);
    };

    _proto._toggle = function _toggle() {
      if (L__namespace.DomUtil.hasClass(this._container, 'leaflet-control-geocoder-expanded')) {
        this._collapse();
      } else {
        this._expand();
      }
    };

    _proto._expand = function _expand() {
      L__namespace.DomUtil.addClass(this._container, 'leaflet-control-geocoder-expanded');

      this._input.select();

      this.fire('expand');
    };

    _proto._collapse = function _collapse() {
      L__namespace.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-expanded');
      L__namespace.DomUtil.addClass(this._alts, 'leaflet-control-geocoder-alternatives-minimized');
      L__namespace.DomUtil.removeClass(this._errorElement, 'leaflet-control-geocoder-error');
      L__namespace.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-options-open');
      L__namespace.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-options-error');

      this._input.blur(); // mobile: keyboard shouldn't stay expanded


      this.fire('collapse');
    };

    _proto._clearResults = function _clearResults() {
      L__namespace.DomUtil.addClass(this._alts, 'leaflet-control-geocoder-alternatives-minimized');
      this._selection = null;
      L__namespace.DomUtil.removeClass(this._errorElement, 'leaflet-control-geocoder-error');
      L__namespace.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-options-open');
      L__namespace.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-options-error');
    };

    _proto._createAlt = function _createAlt(result, index) {
      var _this4 = this;

      var li = L__namespace.DomUtil.create('li', ''),
          a = L__namespace.DomUtil.create('a', '', li),
          icon = this.options.showResultIcons && result.icon ? L__namespace.DomUtil.create('img', '', a) : null,
          text = result.html ? undefined : document.createTextNode(result.name),
          mouseDownHandler = function mouseDownHandler(e) {
        // In some browsers, a click will fire on the map if the control is
        // collapsed directly after mousedown. To work around this, we
        // wait until the click is completed, and _then_ collapse the
        // control. Messy, but this is the workaround I could come up with
        // for #142.
        _this4._preventBlurCollapse = true;
        L__namespace.DomEvent.stop(e);

        _this4._geocodeResultSelected(result);

        L__namespace.DomEvent.on(li, 'click touchend', function () {
          if (_this4.options.collapsed) {
            _this4._collapse();
          } else {
            _this4._clearResults();
          }
        });
      };

      if (icon) {
        icon.src = result.icon;
      }

      li.setAttribute('data-result-index', String(index));

      if (result.html) {
        a.innerHTML = a.innerHTML + result.html;
      } else if (text) {
        a.appendChild(text);
      } // Use mousedown and not click, since click will fire _after_ blur,
      // causing the control to have collapsed and removed the items
      // before the click can fire.


      L__namespace.DomEvent.addListener(li, 'mousedown touchstart', mouseDownHandler, this);
      return li;
    };

    _proto._keydown = function _keydown(e) {
      var _this5 = this;

      var select = function select(dir) {
        if (_this5._selection) {
          L__namespace.DomUtil.removeClass(_this5._selection, 'leaflet-control-geocoder-selected');
          _this5._selection = _this5._selection[dir > 0 ? 'nextSibling' : 'previousSibling'];
        }

        if (!_this5._selection) {
          _this5._selection = _this5._alts[dir > 0 ? 'firstChild' : 'lastChild'];
        }

        if (_this5._selection) {
          L__namespace.DomUtil.addClass(_this5._selection, 'leaflet-control-geocoder-selected');
        }
      };

      switch (e.keyCode) {
        // Escape
        case 27:
          if (this.options.collapsed) {
            this._collapse();
          } else {
            this._clearResults();
          }

          break;
        // Up

        case 38:
          select(-1);
          break;
        // Up

        case 40:
          select(1);
          break;
        // Enter

        case 13:
          if (this._selection) {
            var index = parseInt(this._selection.getAttribute('data-result-index'), 10);

            this._geocodeResultSelected(this._results[index]);

            this._clearResults();
          } else {
            this._geocode();
          }

          break;

        default:
          return;
      }

      L__namespace.DomEvent.preventDefault(e);
    };

    _proto._change = function _change() {
      var _this6 = this;

      var v = this._input.value;

      if (v !== this._lastGeocode) {
        clearTimeout(this._suggestTimeout);

        if (v.length >= this.options.suggestMinLength) {
          this._suggestTimeout = setTimeout(function () {
            return _this6._geocode(true);
          }, this.options.suggestTimeout);
        } else {
          this._clearResults();
        }
      }
    };

    return GeocoderControl;
  }(EventedControl);
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link GeocoderControl}
   * @param options the options
   */

  function geocoder(options) {
    return new GeocoderControl(options);
  }

  /* @preserve
   * Leaflet Control Geocoder
   * https://github.com/perliedman/leaflet-control-geocoder
   *
   * Copyright (c) 2012 sa3m (https://github.com/sa3m)
   * Copyright (c) 2018 Per Liedman
   * All rights reserved.
   */
  L__namespace.Util.extend(GeocoderControl, geocoders);
  L__namespace.Util.extend(L__namespace.Control, {
    Geocoder: GeocoderControl,
    geocoder: geocoder
  });

  exports.Geocoder = GeocoderControl;
  exports.default = GeocoderControl;
  exports.geocoder = geocoder;
  exports.geocoders = geocoders;

  return exports;

}({}, L));
//# sourceMappingURL=Control.Geocoder.js.map
!function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/dist/",t(t.s=28)}([function(e,t,r){function n(e){return null==e?void 0===e?u:a:l&&l in Object(e)?i(e):s(e)}var o=r(4),i=r(38),s=r(39),a="[object Null]",u="[object Undefined]",l=o?o.toStringTag:void 0;e.exports=n},function(e,t){function r(e){return null!=e&&"object"==typeof e}e.exports=r},function(e,t){function r(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}e.exports=r},function(e,t,r){"use strict";function n(e,t,r){if(r=r||{},!h(r))throw new Error("options is invalid");var n=r.bbox,o=r.id;if(void 0===e)throw new Error("geometry is required");if(t&&t.constructor!==Object)throw new Error("properties must be an Object");n&&d(n),o&&m(o);var i={type:"Feature"};return o&&(i.id=o),n&&(i.bbox=n),i.properties=t||{},i.geometry=e,i}function o(e,t,r){if(!e)throw new Error("coordinates is required");if(!Array.isArray(e))throw new Error("coordinates must be an Array");if(e.length<2)throw new Error("coordinates must be at least 2 numbers long");if(!p(e[0])||!p(e[1]))throw new Error("coordinates must contain numbers");return n({type:"Point",coordinates:e},t,r)}function i(e,t,r){if(!e)throw new Error("coordinates is required");for(var o=0;o<e.length;o++){var i=e[o];if(i.length<4)throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");for(var s=0;s<i[i.length-1].length;s++){if(0===o&&0===s&&!p(i[0][0])||!p(i[0][1]))throw new Error("coordinates must contain numbers");if(i[i.length-1][s]!==i[0][s])throw new Error("First and last Position are not equivalent.")}}return n({type:"Polygon",coordinates:e},t,r)}function s(e,t,r){if(!e)throw new Error("coordinates is required");if(e.length<2)throw new Error("coordinates must be an array of two or more positions");if(!p(e[0][1])||!p(e[0][1]))throw new Error("coordinates must contain numbers");return n({type:"LineString",coordinates:e},t,r)}function a(e,t,r){if(!e)throw new Error("coordinates is required");return n({type:"MultiLineString",coordinates:e},t,r)}function u(e,t,r){if(!e)throw new Error("coordinates is required");return n({type:"MultiPoint",coordinates:e},t,r)}function l(e,t,r){if(!e)throw new Error("coordinates is required");return n({type:"MultiPolygon",coordinates:e},t,r)}function c(e,t){if(void 0===e||null===e)throw new Error("radians is required");if(t&&"string"!=typeof t)throw new Error("units must be a string");var r=y[t||"kilometers"];if(!r)throw new Error(t+" units is invalid");return e*r}function f(e){if(null===e||void 0===e)throw new Error("degrees is required");return e%360*Math.PI/180}function p(e){return!isNaN(e)&&null!==e&&!Array.isArray(e)}function h(e){return!!e&&e.constructor===Object}function d(e){if(!e)throw new Error("bbox is required");if(!Array.isArray(e))throw new Error("bbox must be an Array");if(4!==e.length&&6!==e.length)throw new Error("bbox must be an Array of 4 or 6 numbers");e.forEach(function(e){if(!p(e))throw new Error("bbox must only contain numbers")})}function m(e){if(!e)throw new Error("id is required");if(-1===["string","number"].indexOf(typeof e))throw new Error("id must be a number or a string")}r.d(t,"b",function(){return n}),r.d(t,"f",function(){return o}),r.d(t,"e",function(){return s}),r.d(t,"g",function(){return c}),r.d(t,"a",function(){return f}),r.d(t,"c",function(){return p}),r.d(t,"d",function(){return h});var y={meters:6371008.8,metres:6371008.8,millimeters:6371008800,millimetres:6371008800,centimeters:637100880,centimetres:637100880,kilometers:6371.0088,kilometres:6371.0088,miles:3958.761333810546,nauticalmiles:6371008.8/1852,inches:6371008.8*39.37,yards:6371008.8/1.0936,feet:20902260.511392,radians:1,degrees:6371008.8/111325}},function(e,t,r){var n=r(5),o=n.Symbol;e.exports=o},function(e,t,r){var n=r(11),o="object"==typeof self&&self&&self.Object===Object&&self,i=n||o||Function("return this")();e.exports=i},function(e,t){function r(e,t){return e===t||e!==e&&t!==t}e.exports=r},function(e,t,r){function n(e){return null!=e&&i(e.length)&&!o(e)}var o=r(10),i=r(16);e.exports=n},function(e,t,r){function n(e,t,r){"__proto__"==t&&o?o(e,t,{configurable:!0,enumerable:!0,value:r,writable:!0}):e[t]=r}var o=r(9);e.exports=n},function(e,t,r){var n=r(35),o=function(){try{var e=n(Object,"defineProperty");return e({},"",{}),e}catch(e){}}();e.exports=o},function(e,t,r){function n(e){if(!i(e))return!1;var t=o(e);return t==a||t==u||t==s||t==l}var o=r(0),i=r(2),s="[object AsyncFunction]",a="[object Function]",u="[object GeneratorFunction]",l="[object Proxy]";e.exports=n},function(e,t,r){(function(t){var r="object"==typeof t&&t&&t.Object===Object&&t;e.exports=r}).call(t,r(37))},function(e,t,r){function n(e,t){return s(i(e,t,o),e+"")}var o=r(13),i=r(45),s=r(46);e.exports=n},function(e,t){function r(e){return e}e.exports=r},function(e,t){function r(e,t,r){switch(r.length){case 0:return e.call(t);case 1:return e.call(t,r[0]);case 2:return e.call(t,r[0],r[1]);case 3:return e.call(t,r[0],r[1],r[2])}return e.apply(t,r)}e.exports=r},function(e,t,r){function n(e,t,r){if(!a(r))return!1;var n=typeof t;return!!("number"==n?i(r)&&s(t,r.length):"string"==n&&t in r)&&o(r[t],e)}var o=r(6),i=r(7),s=r(17),a=r(2);e.exports=n},function(e,t){function r(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=n}var n=9007199254740991;e.exports=r},function(e,t){function r(e,t){var r=typeof e;return!!(t=null==t?n:t)&&("number"==r||"symbol"!=r&&o.test(e))&&e>-1&&e%1==0&&e<t}var n=9007199254740991,o=/^(?:0|[1-9]\d*)$/;e.exports=r},function(e,t,r){function n(e,t){var r=s(e),n=!r&&i(e),c=!r&&!n&&a(e),p=!r&&!n&&!c&&l(e),h=r||n||c||p,d=h?o(e.length,String):[],m=d.length;for(var y in e)!t&&!f.call(e,y)||h&&("length"==y||c&&("offset"==y||"parent"==y)||p&&("buffer"==y||"byteLength"==y||"byteOffset"==y)||u(y,m))||d.push(y);return d}var o=r(51),i=r(52),s=r(19),a=r(54),u=r(17),l=r(56),c=Object.prototype,f=c.hasOwnProperty;e.exports=n},function(e,t){var r=Array.isArray;e.exports=r},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t){function r(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||n)}var n=Object.prototype;e.exports=r},function(e,t,r){function n(e){if(!i(e))return!1;var t=o(e);return t==u||t==a||"string"==typeof e.message&&"string"==typeof e.name&&!s(e)}var o=r(0),i=r(1),s=r(63),a="[object DOMException]",u="[object Error]";e.exports=n},function(e,t){function r(e,t){return function(r){return e(t(r))}}e.exports=r},function(e,t){function r(e,t){for(var r=-1,n=null==e?0:e.length,o=Array(n);++r<n;)o[r]=t(e[r],r,e);return o}e.exports=r},function(e,t){var r=/<%=([\s\S]+?)%>/g;e.exports=r},function(e,t,r){function n(e){return null==e?"":o(e)}var o=r(75);e.exports=n},function(e,t,r){"use strict";function n(e,t,r){if(null!==e)for(var o,i,s,a,u,l,c,f,p=0,h=0,d=e.type,m="FeatureCollection"===d,y="Feature"===d,v=m?e.features.length:1,g=0;g<v;g++){c=m?e.features[g].geometry:y?e.geometry:e,f=!!c&&"GeometryCollection"===c.type,u=f?c.geometries.length:1;for(var b=0;b<u;b++){var _=0,j=0;if(null!==(a=f?c.geometries[b]:c)){l=a.coordinates;var x=a.type;switch(p=!r||"Polygon"!==x&&"MultiPolygon"!==x?0:1,x){case null:break;case"Point":if(!1===t(l,h,g,_,j))return!1;h++,_++;break;case"LineString":case"MultiPoint":for(o=0;o<l.length;o++){if(!1===t(l[o],h,g,_,j))return!1;h++,"MultiPoint"===x&&_++}"LineString"===x&&_++;break;case"Polygon":case"MultiLineString":for(o=0;o<l.length;o++){for(i=0;i<l[o].length-p;i++){if(!1===t(l[o][i],h,g,_,j))return!1;h++}"MultiLineString"===x&&_++,"Polygon"===x&&j++}"Polygon"===x&&_++;break;case"MultiPolygon":for(o=0;o<l.length;o++){for("MultiPolygon"===x&&(j=0),i=0;i<l[o].length;i++){for(s=0;s<l[o][i].length-p;s++){if(!1===t(l[o][i][s],h,g,_,j))return!1;h++}j++}_++}break;case"GeometryCollection":for(o=0;o<a.geometries.length;o++)if(!1===n(a.geometries[o],t,r))return!1;break;default:throw new Error("Unknown Geometry Type")}}}}}function o(e,t){var r,n,o,i,s,a,u,l,c,f,p=0,h="FeatureCollection"===e.type,d="Feature"===e.type,m=h?e.features.length:1;for(r=0;r<m;r++){for(a=h?e.features[r].geometry:d?e.geometry:e,l=h?e.features[r].properties:d?e.properties:{},c=h?e.features[r].bbox:d?e.bbox:void 0,f=h?e.features[r].id:d?e.id:void 0,u=!!a&&"GeometryCollection"===a.type,s=u?a.geometries.length:1,o=0;o<s;o++)if(null!==(i=u?a.geometries[o]:a))switch(i.type){case"Point":case"LineString":case"MultiPoint":case"Polygon":case"MultiLineString":case"MultiPolygon":if(!1===t(i,p,l,c,f))return!1;break;case"GeometryCollection":for(n=0;n<i.geometries.length;n++)if(!1===t(i.geometries[n],p,l,c,f))return!1;break;default:throw new Error("Unknown Geometry Type")}else if(!1===t(null,p,l,c,f))return!1;p++}}function i(e,t,r){var n=r;return o(e,function(e,o,i,s,a){n=0===o&&void 0===r?e:t(n,e,o,i,s,a)}),n}function s(e,t){o(e,function(e,r,n,o,i){var s=null===e?null:e.type;switch(s){case null:case"Point":case"LineString":case"Polygon":if(!1===t(Object(l.b)(e,n,{bbox:o,id:i}),r,0))return!1;return}var a;switch(s){case"MultiPoint":a="Point";break;case"MultiLineString":a="LineString";break;case"MultiPolygon":a="Polygon"}for(var u=0;u<e.coordinates.length;u++){var c=e.coordinates[u],f={type:a,coordinates:c};if(!1===t(Object(l.b)(f,n),r,u))return!1}})}function a(e,t){s(e,function(e,r,o){var i=0;if(e.geometry){var s=e.geometry.type;if("Point"!==s&&"MultiPoint"!==s){var a;return!1!==n(e,function(n,s,u,c,f){if(void 0===a)return void(a=n);var p=Object(l.e)([a,n],e.properties);if(!1===t(p,r,o,f,i))return!1;i++,a=n})&&void 0}}})}function u(e,t,r){var n=r,o=!1;return a(e,function(e,i,s,a,u){n=!1===o&&void 0===r?e:t(n,e,i,s,a,u),o=!0}),n}r.d(t,"a",function(){return i}),r.d(t,"b",function(){return u});var l=r(3)},function(e,t,r){e.exports=r(29)},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}r(30);var o=r(31),i=n(o),s=r(79),a=n(s),u=r(80),l=n(u),c=r(85),f=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}(c),p=r(86),h=n(p),d=r(87),m=r(88),y={imports:{numberFormat:d.numberFormat},interpolate:/{{([\s\S]+?)}}/g},v=(0,i.default)(m.controlTemplate,y),g=(0,i.default)(m.resultsTemplate,y),b=(0,i.default)(m.pointPopupTemplate,y),_=(0,i.default)(m.linePopupTemplate,y),j=(0,i.default)(m.areaPopupTemplate,y);L.Control.Measure=L.Control.extend({_className:"leaflet-control-measure",options:{units:{},position:"topright",primaryLengthUnit:"feet",secondaryLengthUnit:"miles",primaryAreaUnit:"acres",activeColor:"#ABE67E",completedColor:"#C8F2BE",captureZIndex:1e4,popupOptions:{className:"leaflet-measure-resultpopup",autoPanPadding:[10,10]}},initialize:function(e){L.setOptions(this,e);var t=this.options,r=t.activeColor,n=t.completedColor;this._symbols=new h.default({activeColor:r,completedColor:n}),this.options.units=L.extend({},a.default,this.options.units)},onAdd:function(e){return this._map=e,this._latlngs=[],this._initLayout(),e.on("click",this._collapse,this),this._layer=L.layerGroup().addTo(e),this._container},onRemove:function(e){e.off("click",this._collapse,this),e.removeLayer(this._layer)},_initLayout:function(){var e=this._className,t=this._container=L.DomUtil.create("div",e+" leaflet-bar");t.innerHTML=v({model:{className:e}}),t.setAttribute("aria-haspopup",!0),L.DomEvent.disableClickPropagation(t),L.DomEvent.disableScrollPropagation(t);var r=this.$toggle=(0,c.selectOne)(".js-toggle",t);this.$interaction=(0,c.selectOne)(".js-interaction",t);var n=(0,c.selectOne)(".js-start",t),o=(0,c.selectOne)(".js-cancel",t),i=(0,c.selectOne)(".js-finish",t);this.$startPrompt=(0,c.selectOne)(".js-startprompt",t),this.$measuringPrompt=(0,c.selectOne)(".js-measuringprompt",t),this.$startHelp=(0,c.selectOne)(".js-starthelp",t),this.$results=(0,c.selectOne)(".js-results",t),this.$measureTasks=(0,c.selectOne)(".js-measuretasks",t),this._collapse(),this._updateMeasureNotStarted(),L.Browser.android||(L.DomEvent.on(t,"mouseenter",this._expand,this),L.DomEvent.on(t,"mouseleave",this._collapse,this)),L.DomEvent.on(r,"click",L.DomEvent.stop),L.Browser.touch?L.DomEvent.on(r,"click",this._expand,this):L.DomEvent.on(r,"focus",this._expand,this),L.DomEvent.on(n,"click",L.DomEvent.stop),L.DomEvent.on(n,"click",this._startMeasure,this),L.DomEvent.on(o,"click",L.DomEvent.stop),L.DomEvent.on(o,"click",this._finishMeasure,this),L.DomEvent.on(i,"click",L.DomEvent.stop),L.DomEvent.on(i,"click",this._handleMeasureDoubleClick,this)},_expand:function(){f.hide(this.$toggle),f.show(this.$interaction)},_collapse:function(){this._locked||(f.hide(this.$interaction),f.show(this.$toggle))},_updateMeasureNotStarted:function(){f.hide(this.$startHelp),f.hide(this.$results),f.hide(this.$measureTasks),f.hide(this.$measuringPrompt),f.show(this.$startPrompt)},_updateMeasureStartedNoPoints:function(){f.hide(this.$results),f.show(this.$startHelp),f.show(this.$measureTasks),f.hide(this.$startPrompt),f.show(this.$measuringPrompt)},_updateMeasureStartedWithPoints:function(){f.hide(this.$startHelp),f.show(this.$results),f.show(this.$measureTasks),f.hide(this.$startPrompt),f.show(this.$measuringPrompt)},_startMeasure:function(){this._locked=!0,this._measureVertexes=L.featureGroup().addTo(this._layer),this._captureMarker=L.marker(this._map.getCenter(),{clickable:!0,zIndexOffset:this.options.captureZIndex,opacity:0}).addTo(this._layer),this._setCaptureMarkerIcon(),this._captureMarker.on("mouseout",this._handleMapMouseOut,this).on("dblclick",this._handleMeasureDoubleClick,this).on("click",this._handleMeasureClick,this),this._map.on("mousemove",this._handleMeasureMove,this).on("mouseout",this._handleMapMouseOut,this).on("move",this._centerCaptureMarker,this).on("resize",this._setCaptureMarkerIcon,this),L.DomEvent.on(this._container,"mouseenter",this._handleMapMouseOut,this),this._updateMeasureStartedNoPoints(),this._map.fire("measurestart",null,!1)},_finishMeasure:function(){var e=L.extend({},this._resultsModel,{points:this._latlngs});this._locked=!1,L.DomEvent.off(this._container,"mouseover",this._handleMapMouseOut,this),this._clearMeasure(),this._captureMarker.off("mouseout",this._handleMapMouseOut,this).off("dblclick",this._handleMeasureDoubleClick,this).off("click",this._handleMeasureClick,this),this._map.off("mousemove",this._handleMeasureMove,this).off("mouseout",this._handleMapMouseOut,this).off("move",this._centerCaptureMarker,this).off("resize",this._setCaptureMarkerIcon,this),this._layer.removeLayer(this._measureVertexes).removeLayer(this._captureMarker),this._measureVertexes=null,this._updateMeasureNotStarted(),this._collapse(),this._map.fire("measurefinish",e,!1)},_clearMeasure:function(){this._latlngs=[],this._resultsModel=null,this._measureVertexes.clearLayers(),this._measureDrag&&this._layer.removeLayer(this._measureDrag),this._measureArea&&this._layer.removeLayer(this._measureArea),this._measureBoundary&&this._layer.removeLayer(this._measureBoundary),this._measureDrag=null,this._measureArea=null,this._measureBoundary=null},_centerCaptureMarker:function(){this._captureMarker.setLatLng(this._map.getCenter())},_setCaptureMarkerIcon:function(){this._captureMarker.setIcon(L.divIcon({iconSize:this._map.getSize().multiplyBy(2)}))},_getMeasurementDisplayStrings:function(e){function t(e,t,o,i,s){if(t&&n[t]){var a=r(e,n[t],i,s);if(o&&n[o]){a=a+" ("+r(e,n[o],i,s)+")"}return a}return r(e,null,i,s)}function r(e,t,r,n){var o={acres:"Acres",feet:"Feet",kilometers:"Kilometers",hectares:"Hectares",meters:"Meters",miles:"Miles",sqfeet:"Sq Feet",sqmeters:"Sq Meters",sqmiles:"Sq Miles"},i=L.extend({factor:1,decimals:0},t);return[(0,d.numberFormat)(e*i.factor,i.decimals,r||".",n||","),o[i.display]||i.display].join(" ")}var n=this.options.units;return{lengthDisplay:t(e.length,this.options.primaryLengthUnit,this.options.secondaryLengthUnit,this.options.decPoint,this.options.thousandsSep),areaDisplay:t(e.area,this.options.primaryAreaUnit,this.options.secondaryAreaUnit,this.options.decPoint,this.options.thousandsSep)}},_updateResults:function(){var e=(0,l.default)(this._latlngs),t=this._resultsModel=L.extend({},e,this._getMeasurementDisplayStrings(e),{pointCount:this._latlngs.length});this.$results.innerHTML=g({model:t})},_handleMeasureMove:function(e){this._measureDrag?this._measureDrag.setLatLng(e.latlng):this._measureDrag=L.circleMarker(e.latlng,this._symbols.getSymbol("measureDrag")).addTo(this._layer),this._measureDrag.bringToFront()},_handleMeasureDoubleClick:function(){var e=this._latlngs,t=void 0,r=void 0;if(this._finishMeasure(),e.length){e.length>2&&e.push(e[0]);var n=(0,l.default)(e);1===e.length?(t=L.circleMarker(e[0],this._symbols.getSymbol("resultPoint")),r=b({model:n})):2===e.length?(t=L.polyline(e,this._symbols.getSymbol("resultLine")),r=_({model:L.extend({},n,this._getMeasurementDisplayStrings(n))})):(t=L.polygon(e,this._symbols.getSymbol("resultArea")),r=j({model:L.extend({},n,this._getMeasurementDisplayStrings(n))}));var o=L.DomUtil.create("div","");o.innerHTML=r;var i=(0,c.selectOne)(".js-zoomto",o);i&&(L.DomEvent.on(i,"click",L.DomEvent.stop),L.DomEvent.on(i,"click",function(){t.getBounds?this._map.fitBounds(t.getBounds(),{padding:[20,20],maxZoom:17}):t.getLatLng&&this._map.panTo(t.getLatLng())},this));var s=(0,c.selectOne)(".js-deletemarkup",o);s&&(L.DomEvent.on(s,"click",L.DomEvent.stop),L.DomEvent.on(s,"click",function(){this._layer.removeLayer(t)},this)),t.addTo(this._layer),t.bindPopup(o,this.options.popupOptions),t.getBounds?t.openPopup(t.getBounds().getCenter()):t.getLatLng&&t.openPopup(t.getLatLng())}},_handleMeasureClick:function(e){var t=this._map.mouseEventToLatLng(e.originalEvent),r=this._latlngs[this._latlngs.length-1],n=this._symbols.getSymbol("measureVertex");r&&t.equals(r)||(this._latlngs.push(t),this._addMeasureArea(this._latlngs),this._addMeasureBoundary(this._latlngs),this._measureVertexes.eachLayer(function(e){e.setStyle(n),e._path.setAttribute("class",n.className)}),this._addNewVertex(t),this._measureBoundary&&this._measureBoundary.bringToFront(),this._measureVertexes.bringToFront()),this._updateResults(),this._updateMeasureStartedWithPoints()},_handleMapMouseOut:function(){this._measureDrag&&(this._layer.removeLayer(this._measureDrag),this._measureDrag=null)},_addNewVertex:function(e){L.circleMarker(e,this._symbols.getSymbol("measureVertexActive")).addTo(this._measureVertexes)},_addMeasureArea:function(e){if(e.length<3)return void(this._measureArea&&(this._layer.removeLayer(this._measureArea),this._measureArea=null));this._measureArea?this._measureArea.setLatLngs(e):this._measureArea=L.polygon(e,this._symbols.getSymbol("measureArea")).addTo(this._layer)},_addMeasureBoundary:function(e){if(e.length<2)return void(this._measureBoundary&&(this._layer.removeLayer(this._measureBoundary),this._measureBoundary=null));this._measureBoundary?this._measureBoundary.setLatLngs(e):this._measureBoundary=L.polyline(e,this._symbols.getSymbol("measureBoundary")).addTo(this._layer)}}),L.Map.mergeOptions({measureControl:!1}),L.Map.addInitHook(function(){this.options.measureControl&&(this.measureControl=(new L.Control.Measure).addTo(this))}),L.control.measure=function(e){return new L.Control.Measure(e)}},function(e,t){},function(e,t,r){function n(e,t,r){var n=h.imports._.templateSettings||h;r&&c(e,t,r)&&(t=void 0),e=d(e),t=o({},t,n,a);var j,x,M=o({},t.imports,n.imports,a),w=f(M),L=s(M,w),O=0,P=t.interpolate||b,k="__p += '",C=RegExp((t.escape||b).source+"|"+P.source+"|"+(P===p?g:b).source+"|"+(t.evaluate||b).source+"|$","g"),E="sourceURL"in t?"//# sourceURL="+t.sourceURL+"\n":"";e.replace(C,function(t,r,n,o,i,s){return n||(n=o),k+=e.slice(O,s).replace(_,u),r&&(j=!0,k+="' +\n__e("+r+") +\n'"),i&&(x=!0,k+="';\n"+i+";\n__p += '"),n&&(k+="' +\n((__t = ("+n+")) == null ? '' : __t) +\n'"),O=s+t.length,t}),k+="';\n";var S=t.variable;S||(k="with (obj) {\n"+k+"\n}\n"),k=(x?k.replace(m,""):k).replace(y,"$1").replace(v,"$1;"),k="function("+(S||"obj")+") {\n"+(S?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(j?", __e = _.escape":"")+(x?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+k+"return __p\n}";var A=i(function(){return Function(w,E+"return "+k).apply(void 0,L)});if(A.source=k,l(A))throw A;return A}var o=r(32),i=r(62),s=r(65),a=r(66),u=r(67),l=r(22),c=r(15),f=r(68),p=r(25),h=r(71),d=r(26),m=/\b__p \+= '';/g,y=/\b(__p \+=) '' \+/g,v=/(__e\(.*?\)|\b__t\)) \+\n'';/g,g=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,b=/($^)/,_=/['\n\r\u2028\u2029\\]/g;e.exports=n},function(e,t,r){var n=r(33),o=r(44),i=r(50),s=o(function(e,t,r,o){n(t,i(t),e,o)});e.exports=s},function(e,t,r){function n(e,t,r,n){var s=!r;r||(r={});for(var a=-1,u=t.length;++a<u;){var l=t[a],c=n?n(r[l],e[l],l,r,e):void 0;void 0===c&&(c=e[l]),s?i(r,l,c):o(r,l,c)}return r}var o=r(34),i=r(8);e.exports=n},function(e,t,r){function n(e,t,r){var n=e[t];a.call(e,t)&&i(n,r)&&(void 0!==r||t in e)||o(e,t,r)}var o=r(8),i=r(6),s=Object.prototype,a=s.hasOwnProperty;e.exports=n},function(e,t,r){function n(e,t){var r=i(e,t);return o(r)?r:void 0}var o=r(36),i=r(43);e.exports=n},function(e,t,r){function n(e){return!(!s(e)||i(e))&&(o(e)?d:l).test(a(e))}var o=r(10),i=r(40),s=r(2),a=r(42),u=/[\\^$.*+?()[\]{}|]/g,l=/^\[object .+?Constructor\]$/,c=Function.prototype,f=Object.prototype,p=c.toString,h=f.hasOwnProperty,d=RegExp("^"+p.call(h).replace(u,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.exports=n},function(e,t){var r;r=function(){return this}();try{r=r||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(r=window)}e.exports=r},function(e,t,r){function n(e){var t=s.call(e,u),r=e[u];try{e[u]=void 0;var n=!0}catch(e){}var o=a.call(e);return n&&(t?e[u]=r:delete e[u]),o}var o=r(4),i=Object.prototype,s=i.hasOwnProperty,a=i.toString,u=o?o.toStringTag:void 0;e.exports=n},function(e,t){function r(e){return o.call(e)}var n=Object.prototype,o=n.toString;e.exports=r},function(e,t,r){function n(e){return!!i&&i in e}var o=r(41),i=function(){var e=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}();e.exports=n},function(e,t,r){var n=r(5),o=n["__core-js_shared__"];e.exports=o},function(e,t){function r(e){if(null!=e){try{return o.call(e)}catch(e){}try{return e+""}catch(e){}}return""}var n=Function.prototype,o=n.toString;e.exports=r},function(e,t){function r(e,t){return null==e?void 0:e[t]}e.exports=r},function(e,t,r){function n(e){return o(function(t,r){var n=-1,o=r.length,s=o>1?r[o-1]:void 0,a=o>2?r[2]:void 0;for(s=e.length>3&&"function"==typeof s?(o--,s):void 0,a&&i(r[0],r[1],a)&&(s=o<3?void 0:s,o=1),t=Object(t);++n<o;){var u=r[n];u&&e(t,u,n,s)}return t})}var o=r(12),i=r(15);e.exports=n},function(e,t,r){function n(e,t,r){return t=i(void 0===t?e.length-1:t,0),function(){for(var n=arguments,s=-1,a=i(n.length-t,0),u=Array(a);++s<a;)u[s]=n[t+s];s=-1;for(var l=Array(t+1);++s<t;)l[s]=n[s];return l[t]=r(u),o(e,this,l)}}var o=r(14),i=Math.max;e.exports=n},function(e,t,r){var n=r(47),o=r(49),i=o(n);e.exports=i},function(e,t,r){var n=r(48),o=r(9),i=r(13),s=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:n(t),writable:!0})}:i;e.exports=s},function(e,t){function r(e){return function(){return e}}e.exports=r},function(e,t){function r(e){var t=0,r=0;return function(){var s=i(),a=o-(s-r);if(r=s,a>0){if(++t>=n)return arguments[0]}else t=0;return e.apply(void 0,arguments)}}var n=800,o=16,i=Date.now;e.exports=r},function(e,t,r){function n(e){return s(e)?o(e,!0):i(e)}var o=r(18),i=r(60),s=r(7);e.exports=n},function(e,t){function r(e,t){for(var r=-1,n=Array(e);++r<e;)n[r]=t(r);return n}e.exports=r},function(e,t,r){var n=r(53),o=r(1),i=Object.prototype,s=i.hasOwnProperty,a=i.propertyIsEnumerable,u=n(function(){return arguments}())?n:function(e){return o(e)&&s.call(e,"callee")&&!a.call(e,"callee")};e.exports=u},function(e,t,r){function n(e){return i(e)&&o(e)==s}var o=r(0),i=r(1),s="[object Arguments]";e.exports=n},function(e,t,r){(function(e){var n=r(5),o=r(55),i="object"==typeof t&&t&&!t.nodeType&&t,s=i&&"object"==typeof e&&e&&!e.nodeType&&e,a=s&&s.exports===i,u=a?n.Buffer:void 0,l=u?u.isBuffer:void 0,c=l||o;e.exports=c}).call(t,r(20)(e))},function(e,t){function r(){return!1}e.exports=r},function(e,t,r){var n=r(57),o=r(58),i=r(59),s=i&&i.isTypedArray,a=s?o(s):n;e.exports=a},function(e,t,r){function n(e){return s(e)&&i(e.length)&&!!a[o(e)]}var o=r(0),i=r(16),s=r(1),a={};a["[object Float32Array]"]=a["[object Float64Array]"]=a["[object Int8Array]"]=a["[object Int16Array]"]=a["[object Int32Array]"]=a["[object Uint8Array]"]=a["[object Uint8ClampedArray]"]=a["[object Uint16Array]"]=a["[object Uint32Array]"]=!0,a["[object Arguments]"]=a["[object Array]"]=a["[object ArrayBuffer]"]=a["[object Boolean]"]=a["[object DataView]"]=a["[object Date]"]=a["[object Error]"]=a["[object Function]"]=a["[object Map]"]=a["[object Number]"]=a["[object Object]"]=a["[object RegExp]"]=a["[object Set]"]=a["[object String]"]=a["[object WeakMap]"]=!1,e.exports=n},function(e,t){function r(e){return function(t){return e(t)}}e.exports=r},function(e,t,r){(function(e){var n=r(11),o="object"==typeof t&&t&&!t.nodeType&&t,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,s=i&&i.exports===o,a=s&&n.process,u=function(){try{return a&&a.binding&&a.binding("util")}catch(e){}}();e.exports=u}).call(t,r(20)(e))},function(e,t,r){function n(e){if(!o(e))return s(e);var t=i(e),r=[];for(var n in e)("constructor"!=n||!t&&u.call(e,n))&&r.push(n);return r}var o=r(2),i=r(21),s=r(61),a=Object.prototype,u=a.hasOwnProperty;e.exports=n},function(e,t){function r(e){var t=[];if(null!=e)for(var r in Object(e))t.push(r);return t}e.exports=r},function(e,t,r){var n=r(14),o=r(12),i=r(22),s=o(function(e,t){try{return n(e,void 0,t)}catch(e){return i(e)?e:new Error(e)}});e.exports=s},function(e,t,r){function n(e){if(!s(e)||o(e)!=a)return!1;var t=i(e);if(null===t)return!0;var r=f.call(t,"constructor")&&t.constructor;return"function"==typeof r&&r instanceof r&&c.call(r)==p}var o=r(0),i=r(64),s=r(1),a="[object Object]",u=Function.prototype,l=Object.prototype,c=u.toString,f=l.hasOwnProperty,p=c.call(Object);e.exports=n},function(e,t,r){var n=r(23),o=n(Object.getPrototypeOf,Object);e.exports=o},function(e,t,r){function n(e,t){return o(t,function(t){return e[t]})}var o=r(24);e.exports=n},function(e,t,r){function n(e,t,r,n){return void 0===e||o(e,i[r])&&!s.call(n,r)?t:e}var o=r(6),i=Object.prototype,s=i.hasOwnProperty;e.exports=n},function(e,t){function r(e){return"\\"+n[e]}var n={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"};e.exports=r},function(e,t,r){function n(e){return s(e)?o(e):i(e)}var o=r(18),i=r(69),s=r(7);e.exports=n},function(e,t,r){function n(e){if(!o(e))return i(e);var t=[];for(var r in Object(e))a.call(e,r)&&"constructor"!=r&&t.push(r);return t}var o=r(21),i=r(70),s=Object.prototype,a=s.hasOwnProperty;e.exports=n},function(e,t,r){var n=r(23),o=n(Object.keys,Object);e.exports=o},function(e,t,r){var n=r(72),o=r(77),i=r(78),s=r(25),a={escape:o,evaluate:i,interpolate:s,variable:"",imports:{_:{escape:n}}};e.exports=a},function(e,t,r){function n(e){return e=i(e),e&&a.test(e)?e.replace(s,o):e}var o=r(73),i=r(26),s=/[&<>"']/g,a=RegExp(s.source);e.exports=n},function(e,t,r){var n=r(74),o={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},i=n(o);e.exports=i},function(e,t){function r(e){return function(t){return null==e?void 0:e[t]}}e.exports=r},function(e,t,r){function n(e){if("string"==typeof e)return e;if(s(e))return i(e,n)+"";if(a(e))return c?c.call(e):"";var t=e+"";return"0"==t&&1/e==-u?"-0":t}var o=r(4),i=r(24),s=r(19),a=r(76),u=1/0,l=o?o.prototype:void 0,c=l?l.toString:void 0;e.exports=n},function(e,t,r){function n(e){return"symbol"==typeof e||i(e)&&o(e)==s}var o=r(0),i=r(1),s="[object Symbol]";e.exports=n},function(e,t){var r=/<%-([\s\S]+?)%>/g;e.exports=r},function(e,t){var r=/<%([\s\S]+?)%>/g;e.exports=r},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={acres:{factor:24711e-8,display:"acres",decimals:2},feet:{factor:3.2808,display:"feet",decimals:0},kilometers:{factor:.001,display:"kilometers",decimals:2},hectares:{factor:1e-4,display:"hectares",decimals:2},meters:{factor:1,display:"meters",decimals:0},miles:{factor:3.2808/5280,display:"miles",decimals:2},sqfeet:{factor:10.7639,display:"sqfeet",decimals:0},sqmeters:{factor:1,display:"sqmeters",decimals:0},sqmiles:{factor:3.86102e-7,display:"sqmiles",decimals:2}}},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){return e<10?"0"+e.toString():e.toString()}function i(e,t,r){var n=Math.abs(e),i=Math.floor(n),s=Math.floor(60*(n-i)),a=Math.round(3600*(n-i-s/60)*100)/100,u=n===e?t:r;return o(i)+"&deg; "+o(s)+"' "+o(a)+'" '+u}function s(e){var t=e[e.length-1],r=e.map(function(e){return[e.lat,e.lng]}),n=L.polyline(r),o=L.polygon(r),s=1e3*(0,u.default)(n.toGeoJSON(),{units:"kilometers"}),a=(0,c.default)(o.toGeoJSON());return{lastCoord:{dd:{x:t.lng,y:t.lat},dms:{x:i(t.lng,"E","W"),y:i(t.lat,"N","S")}},length:s,area:a}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=s;var a=r(81),u=n(a),l=r(84),c=n(l)},function(e,t,r){"use strict";function n(e,t){if(t=t||{},!Object(s.d)(t))throw new Error("options is invalid");if(!e)throw new Error("geojson is required");return Object(i.b)(e,function(e,r){var n=r.geometry.coordinates;return e+Object(o.a)(n[0],n[1],t)},0)}Object.defineProperty(t,"__esModule",{value:!0});var o=r(82),i=r(27),s=r(3);t.default=n},function(e,t,r){"use strict";function n(e,t,r){if(r=r||{},!Object(i.d)(r))throw new Error("options is invalid");var n=r.units,s=Object(o.a)(e),a=Object(o.a)(t),u=Object(i.a)(a[1]-s[1]),l=Object(i.a)(a[0]-s[0]),c=Object(i.a)(s[1]),f=Object(i.a)(a[1]),p=Math.pow(Math.sin(u/2),2)+Math.pow(Math.sin(l/2),2)*Math.cos(c)*Math.cos(f);return Object(i.g)(2*Math.atan2(Math.sqrt(p),Math.sqrt(1-p)),n)}var o=r(83),i=r(3);t.a=n},function(e,t,r){"use strict";function n(e){if(!e)throw new Error("coord is required");if("Feature"===e.type&&null!==e.geometry&&"Point"===e.geometry.type)return e.geometry.coordinates;if("Point"===e.type)return e.coordinates;if(Array.isArray(e)&&e.length>=2&&void 0===e[0].length&&void 0===e[1].length)return e;throw new Error("coord must be GeoJSON Point or an Array of numbers")}r.d(t,"a",function(){return n});r(3)},function(e,t,r){"use strict";function n(e){return Object(u.a)(e,function(e,t){return e+o(t)},0)}function o(e){var t,r=0;switch(e.type){case"Polygon":return i(e.coordinates);case"MultiPolygon":for(t=0;t<e.coordinates.length;t++)r+=i(e.coordinates[t]);return r;case"Point":case"MultiPoint":case"LineString":case"MultiLineString":return 0;case"GeometryCollection":for(t=0;t<e.geometries.length;t++)r+=o(e.geometries[t]);return r}}function i(e){var t=0;if(e&&e.length>0){t+=Math.abs(s(e[0]));for(var r=1;r<e.length;r++)t-=Math.abs(s(e[r]))}return t}function s(e){var t,r,n,o,i,s,u,c=0,f=e.length;if(f>2){for(u=0;u<f;u++)u===f-2?(o=f-2,i=f-1,s=0):u===f-1?(o=f-1,i=0,s=1):(o=u,i=u+1,s=u+2),t=e[o],r=e[i],n=e[s],c+=(a(n[0])-a(t[0]))*Math.sin(a(r[1]));c=c*l*l/2}return c}function a(e){return e*Math.PI/180}Object.defineProperty(t,"__esModule",{value:!0});var u=r(27),l=6378137;t.default=n},function(e,t,r){"use strict";function n(e,t){return t||(t=document),t.querySelector(e)}function o(e,t){return t||(t=document),Array.prototype.slice.call(t.querySelectorAll(e))}function i(e){if(e)return e.setAttribute("style","display:none;"),e}function s(e){if(e)return e.removeAttribute("style"),e}Object.defineProperty(t,"__esModule",{value:!0}),t.selectOne=n,t.selectAll=o,t.hide=i,t.show=s},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i={activeColor:"#ABE67E",completedColor:"#C8F2BE"},s=function(){function e(t){n(this,e),this._options=L.extend({},i,this._options,t)}return o(e,[{key:"getSymbol",value:function(e){return{measureDrag:{clickable:!1,radius:4,color:this._options.activeColor,weight:2,opacity:.7,fillColor:this._options.activeColor,fillOpacity:.5,className:"layer-measuredrag"},measureArea:{clickable:!1,stroke:!1,fillColor:this._options.activeColor,fillOpacity:.2,className:"layer-measurearea"},measureBoundary:{clickable:!1,color:this._options.activeColor,weight:2,opacity:.9,fill:!1,className:"layer-measureboundary"},measureVertex:{clickable:!1,radius:4,color:this._options.activeColor,weight:2,opacity:1,fillColor:this._options.activeColor,fillOpacity:.7,className:"layer-measurevertex"},measureVertexActive:{clickable:!1,radius:4,color:this._options.activeColor,weight:2,opacity:1,fillColor:this._options.activeColor,fillOpacity:1,className:"layer-measurevertex active"},resultArea:{clickable:!0,color:this._options.completedColor,weight:2,opacity:.9,fillColor:this._options.completedColor,fillOpacity:.2,className:"layer-measure-resultarea"},resultLine:{clickable:!0,color:this._options.completedColor,weight:3,opacity:.9,fill:!1,className:"layer-measure-resultline"},resultPoint:{clickable:!0,radius:4,color:this._options.completedColor,weight:2,opacity:1,fillColor:this._options.completedColor,fillOpacity:.7,className:"layer-measure-resultpoint"}}[e]}}]),e}();t.default=s},function(e,t,r){"use strict";function n(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:".",n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:",",o=e<0?"-":"",i=Math.abs(+e||0),s=parseInt(i.toFixed(t),10)+"",a=s.length>3?s.length%3:0;return[o,a?s.substr(0,a)+n:"",s.substr(a).replace(/(\d{3})(?=\d)/g,"$1"+n),t?""+r+Math.abs(i-s).toFixed(t).slice(2):""].join("")}Object.defineProperty(t,"__esModule",{value:!0}),t.numberFormat=n},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=r(89);Object.defineProperty(t,"controlTemplate",{enumerable:!0,get:function(){return n(o).default}});var i=r(90);Object.defineProperty(t,"resultsTemplate",{enumerable:!0,get:function(){return n(i).default}});var s=r(91);Object.defineProperty(t,"pointPopupTemplate",{enumerable:!0,get:function(){return n(s).default}});var a=r(92);Object.defineProperty(t,"linePopupTemplate",{enumerable:!0,get:function(){return n(a).default}});var u=r(93);Object.defineProperty(t,"areaPopupTemplate",{enumerable:!0,get:function(){return n(u).default}})},function(e,t,r){e.exports='<a class="{{ model.className }}-toggle js-toggle" href=# title="Measure distances and areas">Measure</a> <div class="{{ model.className }}-interaction js-interaction"> <div class="js-startprompt startprompt"> <h3>Measure distances and areas</h3> <ul class=tasks> <a href=# class="js-start start">Create a new measurement</a> </ul> </div> <div class=js-measuringprompt> <h3>Measure distances and areas</h3> <p class=js-starthelp>Start creating a measurement by adding points to the map</p> <div class="js-results results"></div> <ul class="js-measuretasks tasks"> <li><a href=# class="js-cancel cancel">Cancel</a></li> <li><a href=# class="js-finish finish">Finish measurement</a></li> </ul> </div> </div> '},function(e,t,r){e.exports='<div class=group> <p class="lastpoint heading">Last point</p> <p>{{ model.lastCoord.dms.y }} <span class=coorddivider>/</span> {{ model.lastCoord.dms.x }}</p> <p>{{ numberFormat(model.lastCoord.dd.y, 6) }} <span class=coorddivider>/</span> {{ numberFormat(model.lastCoord.dd.x, 6) }}</p> </div> <% if (model.pointCount > 1) { %> <div class=group> <p><span class=heading>Path distance</span> {{ model.lengthDisplay }}</p> </div> <% } %> <% if (model.pointCount > 2) { %> <div class=group> <p><span class=heading>Area</span> {{ model.areaDisplay }}</p> </div> <% } %> '},function(e,t,r){e.exports='<h3>Point location</h3> <p>{{ model.lastCoord.dms.y }} <span class=coorddivider>/</span> {{ model.lastCoord.dms.x }}</p> <p>{{ numberFormat(model.lastCoord.dd.y, 6) }} <span class=coorddivider>/</span> {{ numberFormat(model.lastCoord.dd.x, 6) }}</p> <ul class=tasks> <li><a href=# class="js-zoomto zoomto">Center on this location</a></li> <li><a href=# class="js-deletemarkup deletemarkup">Delete</a></li> </ul> '},function(e,t,r){e.exports='<h3>Linear measurement</h3> <p>{{ model.lengthDisplay }}</p> <ul class=tasks> <li><a href=# class="js-zoomto zoomto">Center on this line</a></li> <li><a href=# class="js-deletemarkup deletemarkup">Delete</a></li> </ul> '},function(e,t,r){e.exports='<h3>Area measurement</h3> <p>{{ model.areaDisplay }}</p> <p>{{ model.lengthDisplay }} Perimeter</p> <ul class=tasks> <li><a href=# class="js-zoomto zoomto">Center on this area</a></li> <li><a href=# class="js-deletemarkup deletemarkup">Delete</a></li> </ul> '}]);