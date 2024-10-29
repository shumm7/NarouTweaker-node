
import { getDatetimeString } from "../../utils/time";
import { saveJson } from "../../utils/misc";
import { addExclamationIconBalloon } from "../../utils/ui";
import { getNcodeFromURL } from "../../utils/ncode";
import { nt } from "../../utils/narou-tweaker";
import { GraphType } from "../../utils/data";

import $ from 'jquery';
import { Chart } from "chart.js/auto";
import rangeSlider from 'range-slider-input';
import 'range-slider-input/dist/style.css';

/* Chapter Unique */
export function _chapterUnique(){
    nt.storage.local.get(null).then(function(option){
        var m = $(".novelview_h3")
        if(m.length){
            var match = m.text().match("『(.*)』 エピソード別 アクセス解析")
            if(option.kasasagiCustomStyle && match){
                var title = match[1]

                $(".novelview_h3").text("エピソード別 ユニークアクセス")
                $(".novelview_h3").addClass("subtitle")
                if(title!=undefined){$(".novelview_h3").before("<div class='novelview_h3' id='title' style='margin-bottom: 10px;'>" + title + "</div>")}
                
                $("form#datepicker_form").insertAfter(".novelview_h3.subtitle")
                $(".novelview_h3.subtitle").append(addExclamationIconBalloon("エピソード単位のユニークの合計＝作品全体のユニークではありません"));
                $(".novelview_h3.subtitle .ui-balloon").attr("style", "margin-left: .2em;");
                $(".attention").parent().remove();
            }

            var chapterpv: number[] = [];
            $('.chapter-graph-list__item').each(function() {
                var text = $(this).text().trim();
                var res = text.match(/ep.(\d*): (\d*)人/);
                if(res!=null){
                    const ep = Number(res[1])
                    const person = Number(res[2])
                    if(!isNaN(ep) && !isNaN(person)){
                        chapterpv[ep] = person
                    }
                }
            });

            var data: Array<number|null> = []
            for(let i=1; i<chapterpv.length; i++) {
                if(chapterpv[i]==null){
                    data[i-1] = null;
                }else{
                    data[i-1] = chapterpv[i]
                }
            }

            /* Export Button */
            if(option.kasasagiExportButton){
                _button(data)
            }

            /* Graph */
            if (option.kasasagiShowGraph_ChapterUnique){
                _graph(data, option.kasasagiGraphType_ChapterUnique)
            }

            /* Table */
            if(option.kasasagiShowTable_ChapterUnique){
                _table(data)
            }
        }
    })
}

function _button(data: Array<number|null>){
    $("#chapter_graph").after('<div class="ui-button--center"><input class="ui-button" type="submit" value="エクスポート" id="export-chapter-unique"></div>')
    $("#export-chapter-unique").on("click", function(){
        const ncode = getNcodeFromURL()?.ncode()
        if(ncode){
            var date = $("input[name='date']").attr("value")
            var raw = {
                date: date,
                generatedTime: getDatetimeString(),
                ncode: ncode,
                data: {
                    unique: data
                }
            }
            saveJson(raw, `chapter-unique_${ncode}_${date}.json`);
        }
    })
}

function _graph(data: Array<number|null>, graphType: GraphType){
    const m = 5
    const tickCounts = (labels: number, step: number) => (Math.ceil(labels / step));
    const aryMax = function (a: number|null, b: number|null) {return Math.max(a ?? 0, b ?? 0);}
    const sliderLabel = (v: number|null) =>{
        const value = Number(v)
        if(!isNaN(value)){
            if(value==0){
                return "1"
            }else{
                return `${value}`
            }
        }else{
            return "-"
        }
    }
    const setValue = (valMin: number, valMax: number) => {
        valMax = Math.ceil((valMax===0 ? m : valMax) / m) * m
        valMin = Math.ceil(valMin / m) * m
        if(valMin === valMax && valMin - m >= 0){
            valMin -= m
        }
        return [valMin, valMax]
    }

    const rangeMin = 0
    const rangeMax = tickCounts(data.length, m) * m
    const unit = "人"
    var old_graph = $('.chapter-graph-list');
    var labels_show: number[] = [];

    /* Data */
    for(let i=rangeMin; i<rangeMax; i++) {
        labels_show[i] = i+1;
    }

    /* Range Bar */
    var [curMin, curMax] = setValue(rangeMin, rangeMax)
    old_graph.before(`
        <div class="slider-outer" id="chapter-range">
            <div class="range-slider__label range-slider__leftlabel">${sliderLabel(curMin)}</div>
            <div class="range-slider"><!-- range slider element -->
                <input type="range" /><!-- hidden -->
                <input type="range" /><!-- hidden -->
                <div class="range-slider__thumb" data-lower></div>
                <div class="range-slider__thumb" data-upper></div>
                <div class="range-slider__range"></div>
            </div>
            <div class="range-slider__label range-slider__rightlabel">${sliderLabel(curMax)}</div>
        </div>
    `)
    
    const slider = document.querySelector('#chapter-range .range-slider')
    if(slider!==null){
        rangeSlider(slider, {
            min: rangeMin,
            max: rangeMax,
            step: "any",
            value: [rangeMin, rangeMax],
            onInput: (value: [number, number], userInteraction: boolean) => {
                var [valMin, valMax] = setValue(value[0], value[1])
                if(!isNaN(value[0]) && !isNaN(value[1]) && (curMin!==valMin || curMax!==valMax)){
                    $("#chapter-range .range-slider__leftlabel").text(sliderLabel(valMin))
                    $("#chapter-range .range-slider__rightlabel").text(sliderLabel(valMax))
                    curMin = valMin
                    curMax = valMax
                    graph?.destroy()
                    generateGraph(curMin, curMax)
                }
            }

        })
    }


    /* Graph */
    old_graph.before('<canvas class="access-chart" id="chapter" style="width: 100%; margin-bottom:10px;"></canvas>')
    var graph: Chart|null = null

    function generateGraph(min: number, max: number){
        var elm = document.getElementById("chapter") as HTMLCanvasElement
        if(elm!==null){
            graph = new Chart(elm, {
                type: graphType,
                data: {
                    labels: labels_show,
                    datasets: [
                        {
                            label: '閲覧人数（ユニーク）',
                            data: data,
                            backgroundColor: "rgb(34,153,255)"
                        },
                    ],
                },
                options: {
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(p){
                                    return p.dataset.label + ": " + p.raw + unit;
                                },
                                title: function(p) {
                                    return "ep." + p[0].label;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            ticks: {
                                stepSize: Math.max(10, Math.ceil((data.reduce(aryMax) ?? 0)/(1000*m))*m),
                                callback: function(value, index){
                                    return value + unit;
                                }
                            }
                        },
                        x: {
                            ticks: {
                                display: false,
                                maxTicksLimit: tickCounts(max - min, m) + 2,
                            },
                            min: min,
                            max: max
                        }
                    },
                }
            })
        }
    }

    generateGraph(curMin, curMax);
}

function _table(data: Array<number|null>){
    function makeTableDiffs(id: string, label: [string, string, string, string], header: Array<number>, data: Array<number|null>){
        const size = Math.max(header.length, data.length)
        const aryMax = function (a: number|null, b: number|null) {return Math.max(a ?? 0, b ?? 0);}
        const max_data = data.reduce(aryMax)
        
        var outer = $("<table class='data-table'></table>")
        outer.attr("id", id);
        var table = outer.append("<tbody></tbody>")
        table.append("<tr><th>"+label[0]+"</th><th colspan='2'>"+label[1]+"</th><th>"+label[2]+"</th><th>"+label[3]+"</th></tr>")

        for(let i=0; i<size; i++){
            const s_idx = header[i]!==null ? `${header[i]}` : ""
            const s_value = data[i]!==null ? `${data[i]}` : ""
            let bar: number
            let value: number|null = data[i]
            if(value===null){
                value = 0
            }
            if(max_data==null || max_data<=0){
                bar = Math.floor(value / 0 * 100);
            }else{
                bar = Math.floor(value / max_data * 100);
            }
            if(isNaN(bar) || !isFinite(bar)){bar = 0}


            var s_rateBefore: string = ""
            var s_rateDeclease: string = ""
            if(i>0){
                var value_before = data[i-1]
                if(value_before==undefined || value_before<=0 || value_before==null){
                    value_before = 1
                }

                /* 前エピソード比 */
                var rate_before = Math.round(value / value_before * 100)
                if(isNaN(rate_before) || !isFinite(rate_before)){
                    s_rateBefore = ""
                }else{
                    s_rateBefore = `${rate_before}%`
                }

                /* 離脱数 */
                var rate_declease = -(value_before - value);
                if(isNaN(rate_declease)){
                    s_rateDeclease = "";
                }else{
                    s_rateDeclease = `${rate_declease}`
                }
            }


            table.append(`
                <tr>
                    <td class='key'>${s_idx}</td>
                    <td class='value'>${s_value}</td>
                    <td class='bar'>
                        <p class='graph' style='width: ${bar}%;'></p>
                    </td>
                    <td class='rate'>${s_rateBefore}</td>
                    <td class='rate'>${s_rateDeclease}</td>
                </tr>
            `)
        }
        return outer;
    }

    /* Label */
    var labels = []
    for(let i=0; i<data.length; i++) {
        labels[i] = i+1;
    }
    
    /* Table */
    var old_graph = $('.chapter-graph-list');
    old_graph.after(makeTableDiffs("chapter-unique", ["ep.", "ユニーク（人）", "前EP比", "離脱数"], labels, data))

    old_graph.remove();
}