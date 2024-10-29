import { parseIntWithComma } from "../../utils/text";
import { Chart } from "chart.js/auto";
import { nt } from "utils/narou-tweaker";

import $ from 'jquery';

export interface AnalyticsDataset {
    labels: Array<string>
    datasets: Array<GraphDataset>
}

export interface GraphDataset {
    label: string,
    backgroundColor: string,
    data: Array<number|null>,
    hidden?: boolean
}

/* Utilities */
/**
 * @deprecated
 */
export function makeTable(id: string, label: [string, string], header: Array<string|null>, data: Array<number|null>){
    const size = Math.max(header.length, data.length)
    const aryMax = function (a: number|null, b: number|null) {return Math.max(a ?? 0, b ?? 0);}
    const max_data = data.reduce(aryMax)
    
    var outer = $("<table class='data-table'></table>")
    outer.attr("id", id);
    var table = outer.append("<tbody></tbody>")
    table.append("<tr><th>"+label[0]+"</th><th colspan='2'>"+label[1]+"</th></tr>")
    for(let i=0; i<size; i++){
        var h = header[i]!==null ? `${header[i]}` : ""
        var d = data[i]!==null ? `${data[i]}` : ""
        var d_t = data[i]
        if(d_t===null){d_t = 0}

        if(max_data===null){
            var bar = Math.floor(d_t / 0 * 100);
        }else{
            var bar = Math.floor(d_t / max_data * 100);
        }


        table.append("<tr><td class='key'>"+ h +"</td><td class='value'>"+d+"</td><td class='bar'><p class='graph' style='width:"+bar+"%;'></p></td></tr>")
    }
    return outer;
}

export function getValueFromTables(): AnalyticsDataset{
    /* Value Type */
    const value_type = $(".access_header tr td.item").text().trim()
    let datasets: Array<GraphDataset> = []
    let labels: Array<string> = []

    /* Legends */
    var classes: Array<string> = []
    $(".access_header tr td:not(.day, .item)").each(function(_){
        const name = $(this).text().trim() //各色のラベル名（パソコン版, スマートフォン版 etc）
        const color = $(this).css("background-color") //各色の色名
        const cls = $(this).prop("class") //各色のクラス名

        $(".access_per_day tr").each(function(_){
            if($(this).find("td.graph div.progress_box div").prop("class")==cls){
                $(this).addClass(cls)
            }
        })

        if(cls==="total"){
            datasets.push({label: name, backgroundColor: color, data: []})
        }else{
            datasets.push({label: name, backgroundColor: color, data: [], hidden: true})
        }
        classes.push(cls)
    })

    /* Datasets */
    $(".access_per_day:not(.hide)").each(function(_){
        const table = $(this)
        labels.push(table.find("tr td.day").text().trim())

        $.each(classes, function(idx, cls){
            const pv = table.find(`tr.${cls} td.item`).text()
            var num
            if(value_type=="ユニーク"){
                var m = pv.match(/(.*)人/)
                if(m==null){
                    num = 0
                }else{
                    num = parseIntWithComma(m[1])
                }
                if(isNaN(num)){
                    num = 0
                }
            }else if(value_type=="PV"){
                num = parseIntWithComma(pv)
                if(isNaN(num)){
                    num = 0
                }
            }
            datasets[idx].data.push(num!==undefined ? num : 0)
        })
    })

    $.each(datasets, function(idx, _){
        datasets[idx].data = datasets[idx].data.reverse()
    })

    return {
        datasets: datasets,
        labels: labels.reverse()
    }
}

export function makeGraph(_id: string, _graph_type: nt.storage.local.GraphType, _graph_name: string, datasets: Array<GraphDataset>, labels: Array<string>, unit: string = ""){
    return new Chart(document.getElementById(_id) as HTMLCanvasElement, {
        type: _graph_type,
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: {
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: function(p){
                            var n = Number(p.raw)
                            if(isFinite(n)){
                                return `${p.dataset.label}: ${n.toLocaleString()}${unit.length > 0 ? " " + unit : ""}`
                            }else{
                                return `${p.dataset.label}: -${unit.length > 0 ? " " + unit : ""}`
                            }
                        },
                        title: function(p) {
                            return _graph_name + ": " + p[0].label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value, index){
                            return value + unit;
                        }
                    }
                },
                x: {
                    ticks: {
                        display: false,
                        //maxTicksLimit: tickCounts(max - min, 5) + 2,
                    },
                }
            },
        }
    });
}