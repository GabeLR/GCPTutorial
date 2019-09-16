keys = ["ta", "tr", "vel", "rh", "met", "clo"];

$(document).ready(function () {

    // highlight navigation bar button
    $('a.active').removeClass('active');
    $('#nav_a_compare').addClass('active');

    $(function () {
        $(".multiselect").multiselect({
            sortable: false,
            searchable: false,
            dividerLocation: 0.5
        });
    });
    $('#temphumchart-div').hide();

    window.isCelsius = true;
    window.humUnit = 'rh';

    setDefaults1();
    setDefaults2();
    setDefaults3();
    update("1");

    pc.drawChart(d);
    bc.drawChart(d);

    setTimeout(function () {
        $('.inputbox2, .unit2, .tempunit2, .result2, .inputbox3, .unit3, .tempunit3, .result3').hide();
    }, 10)
});

$(function () {

    $("#inputs1").button({}).click(function () {
        var $this = $(this);
        if ($this.is(':checked')) {
            $('.inputbox1, .unit1, .tempunit1, .result1').show();
            keys.forEach(function (element) {
                d_cache[element] = d[element];
                d[element] = parseFloat(document.getElementById(element + "1").value);
            });

            pc.drawThings("1");
            bc.drawThings("1");
            r = comf.pmvElevatedAirspeed(d.ta, d.tr, d.vel, d.rh, d.met, d.clo, 0);
            renderPmvElevResults(r, "1");
            calcPmvElevCompliance(d, r, "1");
        } else {
            $('.inputbox1, .unit1, .tempunit1, .result1').hide();
            d3.selectAll("path.comfortzone1").remove();
            d3.selectAll("circle.point1").remove()
        }
    });
    $("#inputs2").button({}).click(function () {
        var $this = $(this);
        if ($this.is(':checked')) {
            $('.inputbox2, .unit2, .tempunit2, .result2').show();
            keys.forEach(function (element) {
                d_cache[element] = d[element];
                d[element] = parseFloat(document.getElementById(element + "2").value);
            });
            if (!isCelsius) {
                d.ta = util.FtoC(d.ta);
                d.tr = util.FtoC(d.tr);
                d.vel = d.vel / 196.85;
            }
            pc.drawThings("2");
            bc.drawThings("2");
            r = comf.pmvElevatedAirspeed(d.ta, d.tr, d.vel, d.rh, d.met, d.clo, 0);
            renderPmvElevResults(r, "2");
            calcPmvElevCompliance(d, r, "2");
        } else {
            $('.inputbox2, .unit2, .tempunit2, .result2').hide();
            d3.selectAll("path.comfortzone2").remove();
            d3.selectAll("circle.point2").remove()
        }
    });
    $("#inputs3").button({}).click(function () {
        var $this = $(this);
        if ($this.is(':checked')) {
            $('.inputbox3, .unit3, .tempunit3, .result3').show();
            keys.forEach(function (element) {
                d_cache[element] = d[element];
                d[element] = parseFloat(document.getElementById(element + "3").value);
            });
            if (!isCelsius) {
                d.ta = util.FtoC(d.ta);
                d.tr = util.FtoC(d.tr);
                d.vel = d.vel / 196.85;
            }
            pc.drawThings("3");
            bc.drawThings("3");
            r = comf.pmvElevatedAirspeed(d.ta, d.tr, d.vel, d.rh, d.met, d.clo, 0);
            renderPmvElevResults(r, "3");
            calcPmvElevCompliance(d, r, "3");
        } else {
            $('.inputbox3, .unit3, .tempunit3, .result3').hide();
            d3.selectAll("path.comfortzone3").remove();
            d3.selectAll("circle.point3").remove()
        }
    });

    $('#link').button({}).click(function () {
        if ($('#tr-input').is(':hidden')) {
            $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Dry-bulb_temperature" target="_new">Air temperature</a>');
            $('#tr-input, #tr-lab').show();
        } else {
            $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Operative_temperature" target="_new">Operative temperature</a>');
            $('#tr-input, #tr-lab').hide();
        }
    });

    $('#local-control').button();
    $('#radio').buttonset();

    $('#toggle-chart').button({
        icons: {
            primary: "ui-icon-transferthick-e-w"
        },
        text: false
    });

    $('#toggle-chart').click(function () {
        $('#temphumchart-div, #temphumchart-title').toggle();
        $('#chart-div, #chart-title-pmv').toggle();
        update("1");
        update("2");
        update("3");
    });

    $('#customClo').button({
        icons: {
            primary: 'ui-icon-person'
        }
    }).click(function () {
        $('#customCloToggle').toggle('fast');
    });

    $('button').button();
    $('.buttons').buttonset();

    $('#ta1, #ta2, #ta3').spinner({
        step: envVarLimits.ta.si.step,
        min: envVarLimits.ta.si.min,
        max: envVarLimits.ta.si.max,
        numberFormat: "n"
    });

    $('#tr1, #tr2, #tr3').spinner({
        step: envVarLimits.tr.si.step,
        min: envVarLimits.tr.si.min,
        max: envVarLimits.tr.si.max,
        numberFormat: "n"
    });

    $('#vel1, #vel2, #vel3').spinner({
        step: envVarLimits.vel.si.step,
        min: envVarLimits.vel.si.min,
        max: envVarLimits.vel.si.max,
        numberFormat: "n"
    });

    $('#clo1, #clo2, #clo3').spinner({
        step: envVarLimits.clo.step,
        min: envVarLimits.clo.min,
        max: envVarLimits.clo.max,
        numberFormat: "n"
    });

    $('#met1, #met2, #met3').spinner({
        step: envVarLimits.met.step,
        min: envVarLimits.met.min,
        max: envVarLimits.met.max,
        numberFormat: "n"
    });

    $('#rh1, #rh2, #rh3').spinner({
        step: envVarLimits.rh.step,
        min: envVarLimits.rh.min,
        max: envVarLimits.rh.max,
        numberFormat: "n"
    });

    $('select#humidity-spec').selectmenu({
        width: 165
    });

});

$('#humidity-spec').change(function () {
    var v = $('#humidity-spec').val();
    var ta1 = parseFloat($('#ta1').val());
    var ta2 = parseFloat($('#ta2').val());
    var ta3 = parseFloat($('#ta3').val());
    if (!isCelsius) ta1 = util.FtoC(ta1), ta2 = util.FtoC(ta2), ta3 = util.FtoC(ta3);
    var maxVapPress1 = parseFloat(psy.satpress(ta1));
    var maxVapPress2 = parseFloat(psy.satpress(ta2));
    var maxVapPress3 = parseFloat(psy.satpress(ta3));
    var maxHumRatio1 = psy.humratio(psy.PROP.Patm, maxVapPress1);
    var maxHumRatio2 = psy.humratio(psy.PROP.Patm, maxVapPress2);
    var maxHumRatio3 = psy.humratio(psy.PROP.Patm, maxVapPress3);
    var rh1 = parseFloat($('#rh1').val());
    var rh2 = parseFloat($('#rh2').val());
    var rh3 = parseFloat($('#rh3').val());
    if (!isCelsius && (window.humUnit === 'wetbulb' || window.humUnit === 'dewpoint')) rh1 = util.FtoC(rh1), rh2 = util.FtoC(rh2), rh3 = util.FtoC(rh3);
    if (window.humUnit === 'vappress')
        if (!isCelsius) rh1 *= 2953, rh2 *= 2953, rh3 *= 2953;
        else rh1 *= 1000, rh2 *= 1000, rh3 *= 1000;

    if (v === 'rh') {
        $('#rh1').val(psy.convert(rh1, ta1, window.humUnit, 'rh'));
        $('#rh2').val(psy.convert(rh2, ta2, window.humUnit, 'rh'));
        $('#rh3').val(psy.convert(rh3, ta3, window.humUnit, 'rh'));
        $('#rh-unit1, #rh-unit2, #rh-unit3').html(' %');
        $('#rh1, #rh2, #rh3').spinner({
            step: envVarLimits.rh.step,
            min: envVarLimits.rh.min,
            max: envVarLimits.rh.max,
            numberFormat: "n"
        });
    } else if (v === 'dewpoint') {
        if (isCelsius) {
            $('#rh1').val(psy.convert(rh1, ta1, window.humUnit, 'dewpoint'));
            $('#rh2').val(psy.convert(rh2, ta2, window.humUnit, 'dewpoint'));
            $('#rh3').val(psy.convert(rh3, ta3, window.humUnit, 'dewpoint'));
            $('#rh-unit1, #rh-unit2, #rh-unit3').html(' &deg;C');
            $('#rh1, #rh2, #rh3').spinner({
                step: envVarLimits.tdp.si.step,
                min: envVarLimits.tdp.si.min,
                max: envVarLimits.tdp.si.max,
                numberFormat: "n"
            });
        } else {
            $('#rh1').val(util.CtoF(psy.convert(rh1, ta1, window.humUnit, 'dewpoint')));
            $('#rh2').val(util.CtoF(psy.convert(rh2, ta2, window.humUnit, 'dewpoint')));
            $('#rh3').val(util.CtoF(psy.convert(rh3, ta3, window.humUnit, 'dewpoint')));
            $('#rh-unit1, #rh-unit2, #rh-unit3').html(' &deg;F');
            $('#rh1, #rh2, #rh3').spinner({
                step: envVarLimits.tdp.ip.step,
                min: envVarLimits.tdp.ip.min,
                max: envVarLimits.tdp.ip.max,
                numberFormat: "n"
            });
        }

    } else if (v === 'wetbulb') {
        // SI units
        if (isCelsius) {
            $('#rh1').val(psy.convert(rh1, ta1, window.humUnit, 'wetbulb'));
            $('#rh2').val(psy.convert(rh2, ta2, window.humUnit, 'wetbulb'));
            $('#rh3').val(psy.convert(rh3, ta3, window.humUnit, 'wetbulb'));
            $('#rh-unit1, #rh-unit2, #rh-unit3').html(' &deg;C');
            $('#rh1, #rh2, #rh3').spinner({
                step: envVarLimits.twb.si.step,
                min: envVarLimits.twb.si.min,
                max: envVarLimits.twb.si.max,
                numberFormat: "n"
            });

            // IP units
        } else {
            $('#rh1').val(util.CtoF(psy.convert(rh1, ta1, window.humUnit, 'wetbulb')));
            $('#rh2').val(util.CtoF(psy.convert(rh2, ta2, window.humUnit, 'wetbulb')));
            $('#rh3').val(util.CtoF(psy.convert(rh3, ta3, window.humUnit, 'wetbulb')));
            $('#rh-unit1, #rh-unit2, #rh-unit3').html(' &deg;F');
            $('#rh1, #rh2, #rh3').spinner({
                step: envVarLimits.twb.ip.step,
                min: envVarLimits.twb.ip.min,
                max: envVarLimits.twb.ip.max,
                numberFormat: "n"
            });
        }
    } else if (v === 'w') {
        $('#rh1').val(psy.convert(rh1, ta1, window.humUnit, 'w'));
        $('#rh2').val(psy.convert(rh2, ta2, window.humUnit, 'w'));
        $('#rh3').val(psy.convert(rh3, ta3, window.humUnit, 'w'));
        $('#rh-unit1, #rh-unit2, #rh-unit3').html('');
        $('#rh1').spinner({
            step: 0.001,
            min: 0,
            max: maxHumRatio1
        });
        $('#rh2').spinner({
            step: 0.001,
            min: 0,
            max: maxHumRatio2
        });
        $('#rh3').spinner({
            step: 0.001,
            min: 0,
            max: maxHumRatio3
        });
    } else if (v === 'vappress') {
        if (isCelsius) {
            $('#rh1').val(psy.convert(rh1, ta1, window.humUnit, 'vappress') / 1000);
            $('#rh2').val(psy.convert(rh2, ta2, window.humUnit, 'vappress') / 1000);
            $('#rh3').val(psy.convert(rh3, ta3, window.humUnit, 'vappress') / 1000);
            $('#rh-unit1, #rh-unit2, #rh-unit3').html(' KPa');
        } else {
            $('#rh1').val(psy.convert(rh1, ta1, window.humUnit, 'vappress') / 2953);
            $('#rh2').val(psy.convert(rh2, ta2, window.humUnit, 'vappress') / 2953);
            $('#rh3').val(psy.convert(rh3, ta3, window.humUnit, 'vappress') / 2953);
            $('#rh-unit1, #rh-unit2, #rh-unit3').html(' in HG');
        }
        $('#rh1').spinner({
            step: 0.01,
            min: 0,
            max: maxVapPress1 / 1000.0
        });
        $('#rh2').spinner({
            step: 0.01,
            min: 0,
            max: maxVapPress2 / 1000.0
        });
        $('#rh3').spinner({
            step: 0.01,
            min: 0,
            max: maxVapPress3 / 1000.0
        });
    }
    window.humUnit = v;
});

$('#link').click(function () {
    $('#tr').val($('#ta').val());
});

$('.inputbox').keydown(function (event) {
    if (event.keyCode === 13) {
        var inputs = $('.inputbox:visible:enabled');
        var nextBox = inputs.index(this) + 1;
        if (nextBox === inputs.length) nextBox = 0;
        inputs[nextBox].focus();
    }
});

$('.inputcell1').click(function () {
    update("1");
});

$('.inputcell2').click(function () {
    update("2");
});

$('.inputcell3').click(function () {
    update("3");
});

$('.inputbox1').focusout(function () {
    update("1");
});
$('.inputbox2').focusout(function () {
    update("2");
});

$('.inputbox3').focusout(function () {
    update("3");
});

$('#unitsToggle').click(function () {
    toggleUnits();
    update("1");
    update("2");
    update("3");
});

$('#restart').click(function () {
    setDefaults1();
    setDefaults2();
    setDefaults3();
    update("1");
    update("2");
    update("3");
});

$('#specPressure').click(function () {
    var customPressure = prompt('Enter atmospheric pressure in '.concat(isCelsius ? 'Pascals (Pa)' : 'inches of mercury (inHg)'));
    if (customPressure !== '' && customPressure != null) {
        customPressure = parseFloat(customPressure);
        if (!isCelsius) {
            customPressure *= 3386.39;
        }
        if (!isNaN(customPressure) && customPressure >= 30000 && customPressure <= 110000) {
            psy.PROP.Patm = customPressure;
            pc.redraw_rh_lines();
            update("1");
            update("2");
            update("3");
        } else {
            window.alert('The entered atmospheric pressure is invalid.')
        }
    }
});

model = 'pmvElevatedAirspeed'; //model in this page is only the PMV/PPD
if (model === 'pmvElevatedAirspeed') {
    $('#pmv-inputs, #pmv-outputs, #cloInput, #actInput, #humidity-spec-cont, #chart-div, #chart-title-pmv, #toggle-chart').show();
    $('#adaptive-note, #adaptive-inputs, #adaptive-outputs, #chart-div-adaptive, #chart-title-adaptive, #temphumchart-div, #temphumchart-title').hide();
    if (model === 'pmvElevatedAirspeed') {
        $('#pmv-elev-outputs, #local-control-div').show();
        $('#pmv-out-label').html('PMV Adjusted');
    } else {
        $('#pmv-elev-outputs').hide();
    }
}

function update(i) {

    if ($('#link').is(':checked')) {
        $('#tr' + i).val($('#ta' + i).val());
    }

    // get user input and validate that complies with standard applicability limits
    validateUserEntry(i);

    d.wme = 0;

    if (!isCelsius) {
        d.ta = util.FtoC(d.ta);
        d.tr = util.FtoC(d.tr);
        d.vel /= 196.9;
        if (window.humUnit === 'wetbulb' || window.humUnit === 'dewpoint') d.rh = util.FtoC(d.rh);
        else if (window.humUnit === 'vappress') d.rh *= 2953;
    } else {
        if (window.humUnit === 'vappress') d.rh *= 1000;
    }
    d.rh = psy.convert(d.rh, d.ta, window.humUnit, 'rh');

    r = comf.pmvElevatedAirspeed(d.ta, d.tr, d.vel, d.rh, d.met, d.clo, 0);
    renderPmvElevResults(r, i);
    calcPmvElevCompliance(d, r, i);

    let b;
    if ($('#chart-div').is(':visible')) {
        b = pc.findComfortBoundary(d, 0.5);
        pc.redrawComfortRegion(b, i);
        var pointdata = [{
            "db": d.ta,
            "hr": pc.getHumRatio(d.ta, d.rh)
        }];
        pc.redrawPoint(pointdata, i);
    } else if ($('#temphumchart-div').is(':visible')) {
        b = bc.findComfortBoundary(d, 0.5);
        bc.redrawComfortRegion(b, i);
        bc.redrawPoint(i);
    }
    d3.selectAll('circle').moveToFront();
}

function renderPmvResults(r, i) {
    $('#pmv-res' + i).html(r.pmv.toFixed(2));
    $('#ppd-res' + i).html(r.ppd.toFixed(0));
    var sensation = util.getSensation(r.pmv);
    $('#sensation' + i).html(sensation);
    if (!isCelsius) {
        r.set = util.CtoF(r.set);
    }
    $('#set' + i).html(r.set.toFixed(1));
}

function renderPmvElevResults(r, i) {
    renderPmvResults(r, i);
    if (!isCelsius) {
        r.ta_adj = util.CtoF(r.ta_adj);
        r.cooling_effect = util.CtoF(r.cooling_effect) - 32;
    }
    $('#ta-still' + i).html(r.ta_adj.toFixed(1));
    $('#cooling-effect' + i).html(r.cooling_effect.toFixed(1));
}

function calcPmvElevCompliance(d, r, i) {
    var pmv_comply = (Math.abs(r.pmv) <= 0.8);
    var met_comply = d.met <= 2 && d.met >= 1;
    var clo_comply = d.clo <= 1.5;
    var local_control = $('#local-control').is(':checked');
    var special_msg = '';
    var compliance_ranges, unit_t, unit_v;
    comply = true;

    if (!met_comply) {
        comply = false;
        special_msg += '#' + i + ': ' + 'Metabolic rates below 1.0 or above 2.0 are not covered by this Standard<br>';
    }
    if (!clo_comply) {
        comply = false;
        special_msg += '#' + i + ': ' + 'Clo values above 1.5 are not covered by this Standard<br>';
    }

    compliance_ranges = getComplianceRanges(d, r, local_control);

    if (d.vel > compliance_ranges.vel_max && local_control) {
        comply = false;
        special_msg += '#' + i + ': ' + 'Air speed exceeds limit set by standard<br>';
    }
    if (d.vel > compliance_ranges.vel_max && !local_control) {
        comply = false;
        special_msg += '#' + i + ': ' + 'Maximum air speed has been limited due to no occupant control<br>';
    }
    if (!pmv_comply) {
        comply = false;
    }

    if (!isCelsius) {
        unit_t = '&deg;F';
        unit_v = ' fpm';
        compliance_ranges.vel_min *= 196.85039;
        compliance_ranges.vel_max *= 196.85039;
    } else {
        unit_t = '&deg;C';
        unit_v = ' m/s';
    }

    if ($('#vel1').val() > 0.2 || $('#vel2').val() > 0.2 || $('#vel3').val() > 0.2) {
        $("#pmv-out-label").html('PMV with elevated air');
        $("#ppd-out-label").html('PPD with elevated air');
        $("#pmv-elev-outputs").show();
    } else {
        $("#pmv-out-label").html('PMV');
        $("#ppd-out-label").html('PPD');
        $("#pmv-elev-outputs").hide();
    }
    renderCompliance(comply, special_msg, i);
    $("#vel-range" + i).html(compliance_ranges.vel_min.toFixed(1) + '&mdash;' + compliance_ranges.vel_max.toFixed(1) + unit_v)

}

function getComplianceRanges(d, r, local_control) {

    var a = {};
    var found_lower = false;
    var found_upper = false;
    var c;
    for (var v = 0; v <= 1.2; v += 0.01) {
        c = comf.pmvElevatedAirspeed(d.ta, d.tr, v, d.rh, d.met, d.clo, 0).pmv;
        if (c < 0.5 && c > -0.5) {
            a.vel_min = v;
            found_lower = true;
            break
        }
    }
    for (var v = 1.2; v >= 0; v -= 0.01) {
        c = comf.pmvElevatedAirspeed(d.ta, d.tr, v, d.rh, d.met, d.clo, 0).pmv;
        if (c > -0.5 && c < 0.5) {
            a.vel_max = v;
            found_upper = true;
            break
        }
    }

    if (!local_control) {
        var to = (d.ta + d.tr) / 2;
        if (to > 25.5) {
            a.vel_max = Math.min(a.vel_max, 0.8);
        } else if (to < 23.0) {
            a.vel_max = Math.min(a.vel_max, 0.2);
        } else {
            a.vel_max = Math.min(a.vel_max, 50.49 - 4.4047 * to + 0.096425 * to * to);
        }
    }

    if (!found_upper || !found_lower || a.vel_max < a.vel_min) {
        a.vel_max = 0;
        a.vel_min = 0;
    }

    a.vel_min = Math.min(a.vel_max, a.vel_min);
    a.vel_max = Math.max(a.vel_max, a.vel_min);

    return a
}

function renderCompliance(comply, special_msg, i) {
    var comply_msg = '&#10004;';
    var no_comply_msg = '&#10008';

    $('#vel-range' + i).html('');
    if (comply) {
        $('#comply-msg' + i).html(comply_msg);
        $('#comply-msg' + i).css('color', 'green');
        $('#special-msg' + i).html(special_msg);
    } else {
        $('#comply-msg' + i).html(no_comply_msg);
        $('#comply-msg' + i).css('color', 'red');
        $('#special-msg' + i).html(special_msg); //changed this for the special message
    }
}

function setDefaults1() {
    if (!isCelsius) toggleUnits();
    var hs = $('#humidity-spec').val();
    var rh = psy.convert(50, 25, 'rh', hs);
    if (hs === 'vappress') {
        rh /= 1000;
    }
    const defaults = {
        ta: envVarLimits.ta.si.default,
        tr: envVarLimits.tr.si.default,
        vel: envVarLimits.vel.si.default,
        rh: rh.toFixed(psy.PREC[hs]),
        met: envVarLimits.met.default,
        clo: envVarLimits.clo.default,
    };

    keys.forEach(function (element) {
        document.getElementById(element + '1').value = defaults[element];
    });
}

function setDefaults2() {
    if (!isCelsius) toggleUnits();
    var hs = $('#humidity-spec').val();
    var rh = psy.convert(50, 28, 'rh', hs);
    if (hs === 'vappress') {
        rh /= 1000;
    }
    const defaults = {
        ta: envVarLimits.ta.si.default + 3,
        tr: envVarLimits.tr.si.default - 3,
        vel: envVarLimits.vel.si.default,
        rh: rh.toFixed(psy.PREC[hs]),
        met: envVarLimits.met.default,
        clo: envVarLimits.clo.default,
    };

    keys.forEach(function (element) {
        document.getElementById(element + '2').value = defaults[element];
    });
}

function setDefaults3() {
    if (!isCelsius) toggleUnits();
    var hs = $('#humidity-spec').val();
    let rh = psy.convert(50, 22, 'rh', hs);
    if (hs === 'vappress') {
        rh /= 1000;
    }
    const defaults = {
        ta: envVarLimits.ta.si.default - 3,
        tr: envVarLimits.tr.si.default + 3,
        vel: envVarLimits.vel.si.default,
        rh: rh.toFixed(psy.PREC[hs]),
        met: envVarLimits.met.default,
        clo: envVarLimits.clo.default,
    };

    keys.forEach(function (element) {
        document.getElementById(element + '3').value = defaults[element];
    });
}
