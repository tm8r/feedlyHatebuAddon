// ==UserScript==
// @name           Feedly with Hatena bookmark
// @version        0.7.3
// @namespace      http://www.otchy.net
// @include        http://www.feedly.com/*
// @include        http://cloud.feedly.com/*
// @include        http://feedly.com/*
// @include        https://www.feedly.com/*
// @include        https://cloud.feedly.com/*
// @include        https://feedly.com/*
// ==/UserScript==

(function() { // namespace

var setup = function() {
    (function (d, func) {
        var h = d.getElementsByTagName('head')[0];
        var s1 = d.createElement("script");
        s1.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js");
        s1.addEventListener('load', function() {
            var s2 = d.createElement("script");
            s2.textContent = "(" + func.toString() + ")(jQuery.noConflict(true));";
            h.appendChild(s2);
        }, false);
        h.appendChild(s1);
    })(unsafeWindow.document, function($) {
        var buildHatebuLink = function(url) {
            var pos = url.indexOf('#');
            if (pos >= 0) {
                url = url.substr(0, pos) + '%23' + url.substr(pos+1);
            }
            return $('<a>').attr('href', 'http://b.hatena.ne.jp/entry/' + url).attr('target', '_blank').append(
                $('<img>').attr('src', 'http://b.st-hatena.com/entry/image/' + url)
            );
        }
        var setupMain = function(main) {
            var $main = $(main);
            if ($main.data('feedly-w-hatebu') === 'done') return;
            var url = $main.find('.u100Entry').data('alternate-link');
            $hatebu = buildHatebuLink(url);
            $main.find('.wikiWidgetSave').after($hatebu);
            $main.data('feedly-w-hatebu', 'done');
        }
        var setupU0EntryList = function(list) {
            var $list = $(list);
            if ($list.data('feedly-w-hatebu') === 'done') return;
            $list.on('DOMNodeInserted', function(e) {
                var t = e.target;
                if (t.className && t.className.match(/u[0-9]Entry/)) {
                    setupU0Entry(t);
                    return;
                }
            });
            $list.data('feedly-w-hatebu', 'done');
        }
        var setupU0Entry = function(entry) {
            $entry = $(entry);
            url = $entry.data('alternate-link');
            $hatebu = buildHatebuLink(url).css({'margin-right': '0.2em'});
            $entry.find('.title').prepend($hatebu);
        }
        $(window.document).on('DOMNodeInserted', function(e) {
            var t = e.target;
            if (t.id && t.id.match(/_main$/)) {
                setupMain(t);
                return;
            }
            if (t.className && t.className.match(/u[0-9]EntryList/)) {
                setupU0EntryList(t);
                return;
            }
        });
    });
}

if (window.webkitURL !== undefined) {
    // for Chrome
    setup();
} else {
    // for Firefox
    window.addEventListener('DOMContentLoaded', setup, false);
}

})(); // end of namespace

