import { getDateString, getDatetimeString } from "../../utils/time"
import { saveJson } from "../../utils/misc"
import { getValueFromTables, GraphDataset, makeGraph } from "./utils"
import { getLocalOptions } from "../../utils/option"
import { GraphType } from "../../utils/data"
import { getNcodeFromURL } from "../../utils/ncode"

import $ from 'jquery';

/* Day PV */
export function _dayPV(){
    getLocalOptions(null, (option)=>{
        if($(".novelview_h3").length){
            if(option.kasasagiCustomStyle){
                var m = $(".novelview_h3")
                var title = ""
                var n = m.text().trim().match(/『(.*)』 日別\[全エピソード\] アクセス解析\(PV\)/)
                if(n){
                    title = n[1]
                }

                $(".novelview_h3").text("日別（PV）")
                $(".novelview_h3").addClass("subtitle")
                if(title!=undefined){$(".novelview_h3").before("<div class='novelview_h3' id='title' style='margin-bottom: 10px;'>" + title + "</div>")}
            }
            
            var data = getValueFromTables()

            /* Graph */
            if(option.kasasagiShowGraph_DayPV){
                _graph(data.datasets, data.labels, option.kasasagiGraphType_DayPV)
            }

            /* Export Button */
            if(option.kasasagiExportButton){
                _button(data.datasets, data.labels)
            }
        }
    })
}

function _graph(datasets: Array<GraphDataset>, labels: Array<string>, graphType: GraphType){
    $("form").after('<canvas class="access-chart" id="day_pv" style="width: 100%; margin-bottom:10px;"></canvas>')
    makeGraph("day_pv", graphType, "日別（PV）", datasets, labels, "")
}

function _button(datasets: Array<GraphDataset>, labels: Array<string>){
    interface GraphDataExports {
        pv: {[key: string]: number|null},
        date: string
    }

    const ncode = getNcodeFromURL()?.ncode()
    if(ncode){
        $(".access_information").before('<div class="ui-button--center"><input class="ui-button" type="submit" value="エクスポート" id="export-day-pv"></div>')
        $("#export-day-pv").on("click", function(){
            var date = getDateString();
            var data: Array<GraphDataExports> = []

            $.each(labels, function(idx, date){
                data[idx] = {
                    date: date,
                    pv: {}
                }
                $.each(datasets, function(_, value){
                    var key
                    value.label = value.label.trim()
                    if(value.label=="合計"){key = "total"}
                    else if(value.label=="パソコン版"){key = "pc"}
                    else if(value.label=="スマートフォン版"){key = "smp"}
                    else if(value.label=="フィーチャーフォン版"){key = "mobile"}

                    if(key){
                        data[idx]["pv"][key] = value.data[idx]
                    }
                })
            })

            var raw = {
                date: date,
                generatedTime: getDatetimeString(),
                ncode: ncode,
                data: data
            }
            saveJson(raw, `day-pv_${ncode}_${date}.json`);
        })
    }
}