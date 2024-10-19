import { addExclamationIconBalloon } from "../../utils/ui"
import { getDateString, getDatetimeString } from "../../utils/time"
import { saveJson } from "../../utils/misc"
import { getNcodeFromURL } from "../../utils/ncode"
import { makeGraph, getValueFromTables, GraphDataset } from "./utils"
import { GraphType } from "../../utils/data"
import { getLocalOptions } from "../../utils/option"

import $ from 'jquery';

/* Day Unique */
export function _dayUnique(){
    getLocalOptions(null, (option)=>{
        if($(".novelview_h3").length){
            if(option.kasasagiCustomStyle){
                var m = $(".novelview_h3")
                var n = m.text().trim().match(/『(.*)』 日別\[全エピソード\] アクセス解析\(ユニーク\)/)
                var title = ""
                if(n){
                    title = n[1]
                }

                $(".novelview_h3").text("日別（ユニーク）")
                $(".novelview_h3").addClass("subtitle")
                if(title!=undefined){$(".novelview_h3").before("<div class='novelview_h3' id='title' style='margin-bottom: 10px;'>" + title + "</div>")}

                $(".novelview_h3.subtitle").append(addExclamationIconBalloon("ユニークは約2日遅れ"));
                $(".novelview_h3.subtitle .ui-balloon").attr("style", "margin-left: .2em;");
                $(".attention").parent().remove();
            }

            var data = getValueFromTables()

            /* Graph */
            if(option.kasasagiShowGraph_DayUnique){
                _graph(data.datasets, data.labels, option.kasasagiGraphType_DayUnique)
            }

            /* Export Button */
            if(option.kasasagiExportButton){
                _button(data.datasets, data.labels)
            }
        }
    })
}

function _graph(datasets: Array<GraphDataset>, labels: Array<string>, graphType: GraphType){
    $("form").after('<canvas class="access-chart" id="day_unique" style="width: 100%; margin-bottom:10px;"></canvas>')
    makeGraph("day_unique", graphType, "日別（ユニーク）", datasets, labels, "人")
}

function _button(datasets: Array<GraphDataset>, labels: Array<string>){
    interface GraphDataExports {
        unique: {[key: string]: number|null},
        date: string
    }
    const ncode = getNcodeFromURL()?.ncode()

    if(ncode){
        $(".access_information").before('<div class="ui-button--center"><input class="ui-button" type="submit" value="エクスポート" id="export-day-unique"></div>')
        $("#export-day-unique").on("click", function(){
            var date = getDateString();
            var data: Array<GraphDataExports> = []
            
            $.each(labels, function(idx, date){
                data[idx] = {
                    date: date,
                    unique: {}
                }
                $.each(datasets, function(_, value){
                    var key
                    value.label = value.label.trim()
                    if(value.label=="合計"){key = "total"}
                    else if(value.label=="パソコン版"){key = "pc"}
                    else if(value.label=="スマートフォン版"){key = "smp"}
                    else if(value.label=="フィーチャーフォン版"){key = "mobile"}

                    if(key){
                        data[idx]["unique"][key] = value.data[idx]
                    }
                })
            })

            var raw = {
                date: date,
                generatedTime: getDatetimeString(),
                ncode: ncode,
                data: data
            }
            saveJson(raw, `day-unique_${ncode}_${date}.json`);
        })
    }
}