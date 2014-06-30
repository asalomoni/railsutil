var LIB_TAG = 'ru';

var STANDARD_DYNAMIC_HEIGHT = 'data-' + LIB_TAG + '-standard-dh';
var STANDARD_STATIC_HEIGHT = 'data-' + LIB_TAG + '-standard-sh';

var RELATIVE_HEIGHT = 'data-' + LIB_TAG + '-relative-h';
var RELATIVE_WIDTH = 'data-' + LIB_TAG + '-relative-w';

var RELATIVE_POSITION = 'data-' + LIB_TAG + '-relative-p';

var AUTOCOMPLETE = 'data-' + LIB_TAG + '-autocomplete-source';
var AUTOCOMPLETE_APPEND_TO = 'data-' + LIB_TAG + '-autocomplete-append-to';
var AUTOCOMPLETE_PARAMS = 'data-' + LIB_TAG + '-autocomplete-params';

var DATEPICKER = 'data-' + LIB_TAG + '-datepicker';

var LOADING_LAYER = 'data-' + LIB_TAG + '-loading-layer';
var AJAX_FORM = 'data-' + LIB_TAG + '-ajax-form';
var AJAX_BUTTON = 'data-' + LIB_TAG + '-ajax-button';
var AJAX_LINK = 'data-' + LIB_TAG + '-ajax-link';

var PAGINATION = 'data-' + LIB_TAG + '-pagination';

var ALERT = 'data-' + LIB_TAG + '-alert';

var TOP_PARENT = 'body';


// MAIN
// ================================
$(document).on('page:change', function() {
    hide_all_loading_layers();
    set_pagination_links();
    set_ajax_loading_layers();
    setAlerts();
    set_autocompletes();
    set_datepickers();
    resize();

    $(window).resize(function() {
        resize();
    });
});

function resize() {
    standard_page_resize();
    relative_page_resize();
    relative_position_resize();
}


// UTILITY FUNCTIONS
// ================================
function get(thing) {
    return $(TOP_PARENT + ' *[' + thing + ']');
}

function get_with_value(thing, value) {
    return $(TOP_PARENT + ' *[' + thing + '=' + value + ']');
}

function sort_DOM_elements(elements) {
    var elements_array = elements;

    var again = true;
    while (again) {
        again = false;
        for (var i = 0; i < elements_array.length - 1; i++) {
            var a = elements_array[i];
            var b = elements_array[i + 1];

            if ($.contains(b, a)) {
                elements_array[i] = b;
                elements_array[i + 1] = a;
                again = true;
            }
        }
    }

    return elements_array;
}

function log(message) {
    console.log('INTERSAIL::UTIL => ' + message);
}


// RESIZE
// ================================
function relative_page_resize() {
    var rh_elements = get(RELATIVE_HEIGHT);
    rh_elements.each(function() {
        var value = rh_elements.attr(RELATIVE_HEIGHT);
        var split = value.split(':');
        var target = split[0];
        var percent = parseInt(split[1]);

        var target_element = $(target);
        if (target_element.length > 0) {
            var height = (target_element.outerHeight() / 100) * percent;
            $(this).outerHeight(height);
        } else {
            log("Target element doesn't exist");
        }
    });

    var rw_elements = get(RELATIVE_WIDTH);
    rw_elements.each(function() {
        var value = rw_elements.attr(RELATIVE_WIDTH);
        var split = value.split(':');
        var target = split[0];
        var percent = parseInt(split[1]);

        var target_element = $(target);
        if (target_element.length > 0) {
            var width = (target_element.outerWidth() / 100) * percent;
            $(this).outerWidth(width);
        } else {
            log("Target element doesn't exist");
        }
    });
}

function relative_position_resize() {
    var rp_elements = get(RELATIVE_POSITION);
    rp_elements.each(function() {
        var value = rp_elements.attr(RELATIVE_POSITION);
        var split = value.split(':');
        if (split[0] != "null") {
            var w_percent = parseInt(split[0]);
        } else {
            var w_percent = null;
        }
        if (split[1] != "null") {
            var h_percent = parseInt(split[1]);
        } else {
            var h_percent = null;
        }

        var target_element = $(this).parent();
        if (target_element.length > 0) {
            $(this).css('position', 'relative');

            if (h_percent != null) {
                var target_height = target_element.outerHeight();
                var top = ((target_height / 100) * h_percent) - ($(this).outerHeight() / 2);
                $(this).css('top', top + 'px');
            }
            if (w_percent != null) {
                var target_width = target_element.outerWidth();
                var left = ((target_width / 100) * w_percent) - ($(this).outerWidth() / 2);
                $(this).css('left', left + 'px');
            }
        } else {
            log("Target element doesn't exist");
        }
    });
}

function standard_page_resize() {
    var top_parent = $(TOP_PARENT);
    var top_parent_height = top_parent.innerHeight();

    var dh_elements = get(STANDARD_DYNAMIC_HEIGHT);
    dh_elements = sort_DOM_elements(dh_elements);

    dh_elements.each(function(index) {
        var dh_element = dh_elements[index];
        var parent = null;
        for (var i = index - 1; i >= 0; i--) {
            var el = dh_elements[i];
            if ($.contains(el, dh_element)) {
                parent = el;
                break;
            }
        }

        var dynamic_height = 0;
        var static_height = 0;
        var sh_elements = get(STANDARD_STATIC_HEIGHT);
        if (parent != null) {
            sh_elements.each(function(index) {
                var sh_element = sh_elements[index];
                if ($.contains(parent, sh_element) && !$.contains(dh_element, sh_element)) {
                    static_height += $(this).outerHeight(true);
                }
            });

            dynamic_height = $(parent).innerHeight() - static_height;
        } else {
            sh_elements.each(function(index) {
                var sh_element = sh_elements[index];
                if (!$.contains(dh_element, sh_element)) {
                    static_height += $(this).outerHeight(true);
                }
            });

            dynamic_height = top_parent_height - static_height;
        }

        $(this).outerHeight(dynamic_height, true);
    });
}


// AUTOCOMPLETE
// ================================
function set_autocompletes() {
    var autocompletes = get(AUTOCOMPLETE);

    autocompletes.each(function() {
        var append_to = $(this).attr(AUTOCOMPLETE_APPEND_TO);
        var params = $(this).attr(AUTOCOMPLETE_PARAMS);

        var autocomplete_params = {};
        autocomplete_params['min_length'] = 0;
        autocomplete_params['appendTo'] = null;
        autocomplete_params['focus'] = true;

        if (append_to != null && typeof append_to !== 'undefined') {
            if ($(append_to).length <= 0) {
                log("Append to element doesn't exist");
                return;
            }
            autocomplete_params['appendTo'] = append_to;
        }

        if (params != null && typeof params !== 'undefined') {
            var split = params.split(':');
            if (split[0] != 'null') {
                autocomplete_params['min_length'] = parseInt(split[0]);
                if (isNaN(autocomplete_params['min_length'])) {
                    log("Min length is not a number");
                    return;
                }
            }
            if (split[1] != 'null') {
                if (!(split[1] == 'true' || split[1] == 'false')) {
                    log("Focus is not a boolean");
                    return;
                }
                autocomplete_params['focus'] = Boolean(split[1]);
            }
        }

        if (autocomplete_params['appendTo'] != null) {
            $(this).autocomplete({
                source: $(this).data('ru-autocomplete-source'),
                appendTo: autocomplete_params['appendTo'],
                minLength: autocomplete_params['min_length']
            });
        } else {
            $(this).autocomplete({
                source: $(this).data('ru-autocomplete-source'),
                minLength: autocomplete_params['min_length']
            });
        }

        if (autocomplete_params['focus']) {
            $(this).focus(function(){
                $(this).autocomplete( "search", $(this).val() );
            });
        }
    });
}


// DATEPICKER
// ================================
window.defaults = {
    datepicker: {
        todayBtn: "linked",
        language: "it",
        todayHighlight: true,
        autoclose:true
    }
}

$.datepicker.regional['it'] = {
    clearText: 'Svuota', clearStatus: 'Annulla',
    closeText: 'Chiudi', closeStatus: 'Chiudere senza modificare',
    prevText: '&#x3c;Prec', prevStatus: 'Mese precedente',
    prevBigText: '&#x3c;&#x3c;', prevBigStatus: 'Mostra l\'anno precedente',
    nextText: 'Succ&#x3e;', nextStatus: 'Mese successivo',
    nextBigText: '&#x3e;&#x3e;', nextBigStatus: 'Mostra l\'anno successivo',
    currentText: 'Oggi', currentStatus: 'Mese corrente',
    monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
        'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
    monthNamesShort: ['Gen','Feb','Mar','Apr','Mag','Giu',
        'Lug','Ago','Set','Ott','Nov','Dic'],
    monthStatus: 'Seleziona un altro mese', yearStatus: 'Seleziona un altro anno',
    weekHeader: 'Sm', weekStatus: 'Settimana dell\'anno',
    dayNames: ['Domenica','Luned&#236','Marted&#236','Mercoled&#236','Gioved&#236','Venerd&#236','Sabato'],
    dayNamesShort: ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
    dayNamesMin: ['Do','Lu','Ma','Me','Gio','Ve','Sa'],
    dayStatus: 'Usa DD come primo giorno della settimana', dateStatus: 'Seleziona D, M d',
    dateFormat: 'dd/mm/yy', firstDay: 1,
    initStatus: 'Scegliere una data', isRTL: false
};

function set_datepickers() {
    var datepickers = get(DATEPICKER);

    datepickers.each(function(index) {
        $(this).datepicker($.datepicker.regional['it']);
    });
}


// PAGINATION
// ================================
function set_pagination_links() {
    var paginations = get(PAGINATION);
    paginations.each(function() {
        var links = $(this).find('a');
        var layer_name = $(this).attr(PAGINATION);

        links.click(function() {
            var layers = get_with_value(LOADING_LAYER, layer_name);
            layers.each(function() {
                $(this).show();
            });
        });
    });
}


// AJAX
// ================================
var _current_xhr = null;

function recordXHR(event, jqXHR) {
    if (_current_xhr != null) {
        _current_xhr.abort();
    }
    _current_xhr = jqXHR;

    show_layer($(event.currentTarget));
}

function show_layer(element) {
    var layer_name = element.attr(AJAX_FORM);
    var layers = get_with_value(LOADING_LAYER, layer_name);
    layers.each(function() {
        $(this).show();
    });

    layer_name = element.attr(AJAX_LINK);
    layers = get_with_value(LOADING_LAYER, layer_name);
    layers.each(function() {
        $(this).show();
    });
}

function set_ajax_loading_layers() {
    var forms = get(AJAX_FORM);
    forms.each(function() {
        $(this).bind('ajax:beforeSend', recordXHR);
    });

    var buttons = get(AJAX_BUTTON);
    buttons.each(function() {
        var button_form = $(this).parents('form');
        button_form.attr(AJAX_FORM, $(this).attr(AJAX_BUTTON));
        button_form.bind('ajax:beforeSend', recordXHR);
    });

    var links = get(AJAX_LINK);
    links.each(function() {
        $(this).bind('ajax:beforeSend', recordXHR);
    });
}

function hide_all_loading_layers() {
    var layers = get(LOADING_LAYER);

    layers.each(function() {
       $(this).hide();
    });
}

function after_ajax() {
    hide_all_loading_layers();
}


// ALERT
// ================================
function setAlerts() {
    var alerts = get(ALERT);

    alerts.each(function() {
        var alert = $(this);
        alert.find('.close').click(function() {
            alert.html('');
            resize();
        });
    });
}
