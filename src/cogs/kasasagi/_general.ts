import { parseIntWithComma, escapeHtml } from "../../utils/text";
import {getBigGenre, getGenre, getNovelType, getNovelEnd, getNocgenre} from "../../utils/narou"
import { addQuestionIconBalloon, addExclamationIconBalloon } from "../../utils/ui";
import { saveJson } from "../../utils/misc";
import { minuteStringJapanese, getDateString, getYesterday, getDatetimeString, getDateStringJapanese, getDatetimeFromString, getDatetimeStringWithoutMilisecond } from "../../utils/time";
import { getNcodeFromURL, Ncode } from "../../utils/ncode";
import { nt } from "../../utils/narou-tweaker";
import { fetchNovelApi, fetchRankinApi, NovelApi, RankinApi } from "../../utils/api";
import { GraphType } from "../../utils/data";

import $ from 'jquery';
import { Chart } from "chart.js/auto";

/* General */
export function _general(r18?: boolean){
    nt.storage.local.get(null).then((option)=>{
        var m = $(".novelview_h3#title")
        if(m.length){
            if(option.kasasagiCustomStyle){
                var n = m.text().match("『(.*)』")
                var title = ""
                if(n){
                    title = n[1]
                }
                $(".novelview_h3#title").attr("style", "margin-bottom: 10px;")
                $(".novelview_h3#title").text(title)

                $("#today_data .caption").text("本日（"+getDateStringJapanese()+"）")
                $("#yesterday_data .caption").text("昨日（"+getDateStringJapanese(getYesterday())+"）")

                $(".novelview_h3:not(#title)").addClass("subtitle")
                $("#today_yesterday_data .novelview_h3.subtitle").text("アクセス解析（当日・前日）")
                $("#access_all .novelview_h3.subtitle").text("累計アクセス")
                $("#access_all .novelview_h3.subtitle").append(addExclamationIconBalloon("ユニークは約2日遅れ"));
                $("#access_all .novelview_h3.subtitle .ui-balloon").attr("style", "margin-left: .2em;");

                $("#access_all .caption").text("直近1週間のPV")
            }

            /* 当日・前日 */
            today()

            /* 累計 */
            total()

            /* 作品データ */
            api(r18)

            /* 殿堂入り */
            rank(r18)

            /* リンク集 */
            link(r18)
        }
    })
}


function today(){
    nt.storage.local.get(null).then((option)=>{
        var today_pv: Array<number|null> = [];
        var yesterday_pv: Array<number|null> = [];
        var today_pv_sum: Array<number|null> = [];
        var yesterday_pv_sum: Array<number|null> = [];
        var today_total: {[key: string]: number} = {}
        var yesterday_total: {[key: string]: number} = {}
        const hour = new Date().getHours()

        var i = 0
        $("#today_data .oneday_graph tr td.pv").each(function() {
            if(i<=hour){
                today_pv.push(parseIntWithComma($(this).text()))
            }else{
                today_pv.push(null)
            }
            i++
        });
        $("#yesterday_data .oneday_graph tr td.pv").each(function() {
            yesterday_pv.push(parseIntWithComma($(this).text()))
        });

        // Sum
        var i = 0
        $.each(today_pv, function(idx, val){
            if(idx<=hour){
                if(val==null || isNaN(val)){val=0}
                i += val;
                today_pv_sum[idx] = i
            }else{
                today_pv_sum[idx] = null
            }
        });
        var i = 0
        $.each(yesterday_pv, function(idx, val){
            if(val==null || isNaN(val)){val=0}
            i += val;
            yesterday_pv_sum[idx] = i
        });

        $("#today_data .oneday_access_table tr:not(.header)").each(function(){
            var key
            var l = $(this).find("td:first-child()")
            var v = $(this).find("td.right")

            if(l.length){
                var header = l.text().trim()
                if(header=="小計"){
                    key = "total"
                }else if(header=="パソコン版"){
                    key = "pc"
                }else if(header=="フィーチャーフォン版"){
                    key = "mobile"
                }else if(header=="スマートフォン版"){
                    key = "smp"
                }
            }

            if(key && v.length){
                today_total[key] = parseIntWithComma(v.text())
            }
        })

        $("#yesterday_data .oneday_access_table tr:not(.header)").each(function(){
            var key
            var l = $(this).find("td:first-child()")
            var v = $(this).find("td.right")

            if(l.length){
                var header = l.text().trim()
                if(header=="小計"){
                    key = "total"
                }else if(header=="パソコン版"){
                    key = "pc"
                }else if(header=="フィーチャーフォン版"){
                    key = "mobile"
                }else if(header=="スマートフォン版"){
                    key = "smp"
                }
            }

            if(key && v.length){
                yesterday_total[key] = parseIntWithComma(v.text())
            }
        })

        /* Export Button */
        if(option.kasasagiExportButton){
            _buttonToday(today_total, yesterday_total, today_pv, yesterday_pv, today_pv_sum, yesterday_pv_sum)
        }

        /* Table */
        if (option.kasasagiShowTable_GeneralDay){
            _tableToday(today_pv_sum, yesterday_pv_sum)
        }

        /* Graph */
        if (option.kasasagiShowGraph_GeneralDay){
            _graphToday(today_pv, yesterday_pv, today_pv_sum, yesterday_pv_sum, option.kasasagiGraphType_GeneralDay)
        }
    })
}

function total(){
    nt.storage.local.get(null).then((option)=>{

        // Total
        var total_pv: {[key: string]: number} = {}
        var total_unique: {[key: string]: number} = {}
        $(".total_access_table tr:not(.header)").each(function(){
            var header = $(this).find("td:nth-child(1)").text().trim()
            var pv = $(this).find("td:nth-child(2)").text()
            var unique = $(this).find("td:nth-child(3)").text()
            
            var key
            if(header=="累計"){
                key = "total"
            }else if(header=="パソコン版"){
                key = "pc"
            }else if(header=="フィーチャーフォン版"){
                key = "mobile"
            }else if(header=="スマートフォン版"){
                key = "smp"
            }
            if(key){
                total_pv[key] = parseIntWithComma(pv)
                total_unique[key] = parseIntWithComma(unique)
            }
        })


        // Week
        var week_pv: Array<number|null> = []
        var week: Array<string> = []
        $("#access_all .total_graph tr:not(.header)").each(function(){
            week_pv.push(parseIntWithComma($(this).children("td.pv").text()))
            week.push($(this).children("td.day").text())
        })

        /* Graph */
        if (option.kasasagiShowGraph_GeneralTotal){
            _graphTotal(week, week_pv, option.kasasagiGraphType_GeneralTotal)
        }

        /* Export Button */
        if(option.kasasagiExportButton){
            _buttonTotal(total_pv, total_unique, week, week_pv)
        }
    })
}

function api(r18?: boolean){
    nt.storage.local.get(null).then((option)=>{
        const ncode = getNcodeFromURL()?.ncode()

        if (option.kasasagiShowTable_API && ncode!==undefined){
            // API URL
            var url = "https://api.syosetu.com/novelapi/api/?out=json&libtype=2&ncode=" + ncode
            if(r18){
                url = "https://api.syosetu.com/novel18api/api/?out=json&libtype=2&ncode=" + ncode
            }
            
            $("#access_all").after("<div id='novel_detail'></div>")
            $("#novel_detail").append(`<p class='novelview_h3'>作品データ</p>`)
            if(option.kasasagiCustomStyle){
                $("#novel_detail .novelview_h3").addClass("subtitle")
                $("#novel_detail .novelview_h3.subtitle").append(addQuestionIconBalloon("なろう小説APIから取得した情報です", url));
                $("#novel_detail .novelview_h3.subtitle .ui-balloon").attr("style", "margin-left: .2em;");
            }
            $("#novel_detail").append(`<div id='novel_data'><span class='loading-api'>情報を取得中...</span></div>`)
            $("#novel_detail #novel_data").append(`
                <div class='novel_info'></div>
                <div class='novel_statics'></div>
            `)


            fetchNovelApi(ncode, r18, function(data){
                if(data){
                    $("#novel_data .loading-api").remove()

                    /* Info */
                    _tableApi(ncode, data, r18)

                    /* Export Button */
                    if(option.kasasagiExportButton){
                        _buttonApi(ncode, data)
                    }
                }else{
                    $("#novel_data .loading-api").text("情報の取得に失敗しました。")
                }
            });
        }
    })
}

function rank(r18?: boolean){
    if(r18){return}

    nt.storage.local.get(null).then((option)=>{
        const ncode = getNcodeFromURL()?.ncode()
        if (option.kasasagiShowTable_Rank && ncode!==undefined){
            var url = "https://api.syosetu.com/rank/rankin/?out=json&libtype=2&ncode=" + ncode
            if(r18){
                url = "https://api.syosetu.com/novel18api/api/?out=json&libtype=2&ncode=" + ncode
            }

            $($(".access_information")[0]).before("<div id='novel_rank'></div>")
            $("#novel_rank").append(`<p class='novelview_h3'>殿堂入り</p>`)
            if(option.kasasagiCustomStyle){
                $("#novel_rank .novelview_h3").addClass("subtitle")
                $("#novel_rank .novelview_h3.subtitle").append(addQuestionIconBalloon("なろう殿堂入りAPIから取得した情報です", url));
                $("#novel_rank .novelview_h3.subtitle .ui-balloon").attr("style", "margin-left: .2em;");
            }
            $("#novel_rank").append(`<div id='novel_rank_data'><span class='loading-api'>情報を取得中...</span></div>`)
            $("#novel_rank #novel_rank_data").append(`
                <div class='rank_list'></div>
            `)

            fetchRankinApi(ncode, function(data){
                if(data){
                    $("#novel_rank_data .loading-api").remove()

                    /* Info */
                    _tableRank(ncode, data)

                    /* Export Button */
                    if(option.kasasagiExportButton){
                        _buttonRank(ncode, data)
                    }
                }else{
                    $("#novel_rank_data .loading-api").text("情報の取得に失敗しました。")
                }
            });
        }
    })
}

function link(r18?: boolean){
    nt.storage.local.get(null).then((option)=>{
        const ncode = getNcodeFromURL()?.ncode()

        if (option.kasasagiShowTable_ExternalLink && ncode!==undefined){
            const title = $("#title").text()

            var box = $(`<div class="access_information" id="external_urls"></div>`)

            if(!r18){
                const url = `https://ncode.syosetu.com/${ncode}/`
                box.append(`
                    <div class="external_urls-header">Google検索</div>
                    <div class="external_urls-column">
                        <span class="external_urls-item"><a href="https://www.google.com/search?q=${title}" target="_blank"><i class="fa-solid fa-magnifying-glass"></i>作品タイトル</a></span>
                        <span class="external_urls-item"><a href="https://www.google.com/search?q=${ncode}" target="_blank"><i class="fa-solid fa-tag"></i>Nコード</a></span>
                        <span class="external_urls-item"><a href="https://www.google.com/search?q=site:mypage.syosetu.com/mypagenovelhyoka/list%20%22${title}%22" target="_blank"><i class="fa-regular fa-star"></i>評価したユーザ</a></span>
                        <span class="external_urls-item"><a href="https://www.google.com/search?q=site:mypage.syosetu.com/mypagefavnovelmain/list%20%22${title}%22" target="_blank"><i class="fa-solid fa-book-bookmark"></i>ブクマしたユーザ</a></span>
                    </div>
                    <div class="external_urls-header">X</div>
                    <div class="external_urls-column">
                        <span class="external_urls-item"><a href="https://x.com/search?q=${title}" target="_blank"><i class="fa-solid fa-magnifying-glass"></i>作品タイトル</a></span>
                        <span class="external_urls-item"><a href="https://x.com/search?q=${url}" target="_blank"><i class="fa-solid fa-link"></i>作品URL</a></span>
                        <span class="external_urls-item"><a href="https://x.com/hashtag/narou${ncode.toUpperCase()}" target="_blank"><i class="fa-solid fa-hashtag"></i>ハッシュタグ</a></span>
                    </div>
                    <div class="external_urls-header">外部サービス</div>
                    <div class="external_urls-column">
                        <span class="external_urls-item"><a href="https://rawi-novel.work/writer/ai?ncode=${ncode}" target="_blank"><i class="fa-solid fa-robot"></i>RaWiで分析</a></span>
                        <span class="external_urls-item"><a href="https://db.narou.fun/works/${ncode.toUpperCase()}" target="_blank"><i class="fa-solid fa-database"></i>なろうファンDB</a></span>
                    </div>
                `)
            }else{
                const url = `https://novel18.syosetu.com/${ncode}/`
                box.append(`
                    <div class="external_urls-header">Google検索</div>
                    <div class="external_urls-column">
                        <span class="external_urls-item"><a href="https://www.google.com/search?q=${title}" target="_blank"><i class="fa-solid fa-magnifying-glass"></i>作品タイトル</a></span>
                        <span class="external_urls-item"><a href="https://www.google.com/search?q=${ncode}" target="_blank"><i class="fa-solid fa-tag"></i>Nコード</a></span>
                        <span class="external_urls-item"><a href="https://www.google.com/search?q=site:xmypage.syosetu.com/mypagenovelhyoka/list%20%22${title}%22" target="_blank"><i class="fa-regular fa-star"></i>評価したユーザ</a></span>
                        <span class="external_urls-item"><a href="https://www.google.com/search?q=site:xmypage.syosetu.com/mypagefavnovelmain18/list%20%22${title}%22" target="_blank"><i class="fa-solid fa-book-bookmark"></i>ブクマしたユーザ</a></span>
                    <div class="external_urls-header">X</div>
                        <span class="external_urls-item"><a href="https://x.com/search?q=${title}" target="_blank"><i class="fa-solid fa-magnifying-glass"></i>作品タイトル</a></span>
                        <span class="external_urls-item"><a href="https://x.com/search?q=${url}" target="_blank"><i class="fa-solid fa-link"></i>作品URL</a></span>
                        <span class="external_urls-item"><a href="https://x.com/hashtag/narou${ncode.toUpperCase()}" target="_blank"><i class="fa-solid fa-hashtag"></i>Xでハッシュタグ検索</a></span>
                    </div>
                `)
            }

            $($(".access_information")[0]).before(box)
        }
    })
}

function _buttonToday(today_total: {[key: string]: number}, yesterday_total: {[key: string]: number}, today_pv: Array<number|null>, yesterday_pv: Array<number|null>, today_pv_sum: Array<number|null>, yesterday_pv_sum: Array<number|null>){
    const ncode = getNcodeFromURL()?.ncode()
    if(ncode){
        $("#today_all").append('<div class="ui-button--center"><input class="ui-button" type="submit" value="エクスポート" id="export-general-day"></div>')
        $("#export-general-day").on("click", function(){
            var date = getDateString();
            var raw = {
                date: date,
                generatedTime: getDatetimeString(),
                ncode: ncode,
                data: {
                    today: {
                        date: date,
                        highlight: today_total,
                        pv: today_pv,
                        sum: today_pv_sum
                    },
                    yesterday: {
                        date: getDateString(getYesterday()),
                        highlight: yesterday_total,
                        pv: yesterday_pv,
                        sum: yesterday_pv_sum
                    }
                }
            }
            saveJson(raw, `oneday-pv_${ncode}_${date}.json`);
        })
    }
}

function _tableToday(today_pv_sum: Array<number|null>, yesterday_pv_sum: Array<number|null>){
    $("#today_data .oneday_graph tr:nth-child(1) th[colspan='2']").after('<th colspan="2">積算PV</th>')
    $("#yesterday_data .oneday_graph tr:nth-child(1) th[colspan='2']").after('<th colspan="2">積算PV</th>')

    const aryMax = function (a: number|null, b: number|null) {return Math.max(a ?? 0, b ?? 0);}

    var max = today_pv_sum.reduce(aryMax) ?? 0
    $("#today_data .oneday_graph tr td.pv").each(function() {
        var time = parseInt($(this).parent().children(".hour").text().trim());
        var value = today_pv_sum[time]
        if(value===null){
            var bar = 0
            $(this).parent().children(".bar").after('<td class="pv sum"></td>')
            $(this).parent().children(".sum").after('<td class="bar sum"><p class="graph" style="width:'+bar+'%;"></td>')
        }else{
            var bar = Math.floor(value / max * 100)
            if(isNaN(bar) || !isFinite(bar)){bar = 0}
            $(this).parent().children(".bar").after('<td class="pv sum">'+value.toLocaleString()+'</td>')
            $(this).parent().children(".sum").after('<td class="bar sum"><p class="graph" style="width:'+bar+'%;"></td>')
        }
    });

    var max = yesterday_pv_sum.reduce(aryMax) ?? 0
    $("#yesterday_data .oneday_graph tr td.pv").each(function() {
        var time = parseInt($(this).parent().children(".hour").text());
        var value = yesterday_pv_sum[time]
        if(value===null){
            var bar = 0
            $(this).parent().children(".bar").after('<td class="pv sum"></td>')
            $(this).parent().children(".sum").after('<td class="bar sum"><p class="graph" style="width:'+bar+'%;"></td>')
        }else{
            var bar = Math.floor(value / max * 100)
            if(isNaN(bar) || !isFinite(bar)){bar = 0}
            $(this).parent().children(".bar").after('<td class="pv sum">'+value.toLocaleString()+'</td>')
            $(this).parent().children(".sum").after('<td class="bar sum"><p class="graph" style="width:'+bar+'%;"></td>')
        }
    });
}

function _graphToday(today_pv: Array<number|null>, yesterday_pv: Array<number|null>, today_pv_sum: Array<number|null>, yesterday_pv_sum: Array<number|null>, graphType: GraphType){
    $("#yesterday_data").after('<canvas class="access-chart" id="general-day" style="width: 100%; margin-top:10px; margin-bottom:10px;"></canvas>')
    var graph = null

    var hours: Array<number> = [];
    for(var i=0; i<24; i++){
        hours.push(i);
    }

    function generateOnedayGraph(){
        graph = new Chart(document.getElementById("general-day") as HTMLCanvasElement, {
            type: graphType,
            data: {
                labels: hours,
                datasets: [
                    {
                        label: '本日PV',
                        data: today_pv,
                        backgroundColor: "#2299ff"
                    },
                    {
                        label: '昨日PV',
                        data: yesterday_pv,
                        backgroundColor: "#90ccff"
                    },
                    {
                        label: '本日積算PV',
                        data: today_pv_sum,
                        backgroundColor: "#ffa500",
                        hidden: true
                    },
                    {
                        label: '昨日積算PV',
                        data: yesterday_pv_sum,
                        backgroundColor: "#ffd27f",
                        hidden: true
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            label: function(p){
                                return " " + p.raw;
                            },
                            title: function(p) {
                                var date
                                if(p[0].datasetIndex==0 || p[0].datasetIndex==2){
                                    date = getDateStringJapanese();
                                }else if(p[0].datasetIndex==1 || p[0].datasetIndex==3){
                                    date = getDateStringJapanese(getYesterday());
                                }
                                return p[0].dataset.label + " （" + date + " " + p[0].label + "時）";
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            
                        }
                    },
                    x: {
                        ticks: {
                            display: true
                        }
                    }
                },
            }
        });
    }

    generateOnedayGraph()
}


function _buttonTotal(total_pv: {[key: string]: number}, total_unique: {[key: string]: number}, week: Array<string>, week_pv: Array<number|null>){
    const ncode = getNcodeFromURL()?.ncode()
    if(ncode){
        $("#access_all").append('<div class="ui-button--center"><input class="ui-button" type="submit" value="エクスポート" id="export-general-total"></div>')
        $("#export-general-total").on("click", function(){
            var date = getDateString();
            var raw = {
                date: date,
                generatedTime: getDatetimeString(),
                ncode: ncode,
                data: {
                    highlight: {
                        pv: total_pv,
                        unique: total_unique
                    },
                    week: {
                        day: week,
                        pv: week_pv
                    }
                }
            }
            saveJson(raw, `access-all_${ncode}_${date}.json`);
        })
    }
}

function _graphTotal(week: Array<string>, week_pv: Array<number|null>, graphType: GraphType){
    $("#access_all").append('<canvas class="access-chart" id="general-total" style="width: 100%; margin-top:10px; margin-bottom:10px;"></canvas>')
    var graph = null

    function generateTotalGraph(){
        graph = new Chart(document.getElementById("general-total") as HTMLCanvasElement, {
            type: graphType,
            data: {
                labels: week,
                datasets: [
                    {
                        label: '直近1週間のPV',
                        data: week_pv,
                        backgroundColor: "#2299ff"
                    }
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
                                return " " + p.raw;
                            },
                            title: function(p) {
                                var date
                                if(p[0].datasetIndex==0 || p[0].datasetIndex==2){
                                    date = getDateStringJapanese();
                                }else if(p[0].datasetIndex==1 || p[0].datasetIndex==3){
                                    date = getDateStringJapanese(getYesterday());
                                }
                                return p[0].label + " （PV）";
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            stepSize: 10
                        }
                    },
                    x: {
                        ticks: {
                            display: true
                        }
                    }
                },
            }
        });
    }

    generateTotalGraph()
}


function _tableApi(ncode: string, d: NovelApi, r18?:boolean){
    $("#novel_detail .novel_info").append("<table class='access-table'><tbody></tbody></table>")
    var table = $("#novel_detail .novel_info table tbody")

    function addValue(key: string, desc:string, value?:string|number, noEscape?:boolean){
        if(typeof value == "number"){
            value = `${value}`
        }

        if(!noEscape){
            desc = escapeHtml(desc)
            if(value){
                value = escapeHtml(value)
            }
        }
        if(value==undefined){
            table.append(`<tr><td>${key}</td><td class='right' colspan='2'>${desc}</td></tr>`)
        }else{
            table.append(`<tr><td>${key}</td><td class='right'>${desc}</td><td class='right'>${value}</td></tr>`)
        }
    }

    function getYesNo(state?: number){
        if(state==0){
            return "いいえ"
        }
        else if(state==1){
            return "はい"
        }else{
            return ""
        }
    }
    function getNcodeStr(ncode?: string){
        if(ncode!==undefined){
            var n = new Ncode(ncode).ncode()
            if(n){
                return n
            }
        }
        return ""
    }

    function numLocale(n: number|null|undefined, unit?: string): string{
        if(typeof n === "number" && isFinite(n)){
            return n.toLocaleString() + (typeof unit === "string" ? " " + unit : "")
        }
        return ""
    }

    function getDateStr(v: string | undefined): string{
        if(typeof v === "string"){
            return getDatetimeStringWithoutMilisecond(getDatetimeFromString(v))
        }
        return ""
    }

    table.append("<tr class='header'><th>作品情報</th><th>項目</th><th>データ</th></tr>")
    if(ncode.length > 0){
        addValue("タイトル", "<a href='https://ncode.syosetu.com/"+ncode+"/'>"+escapeHtml(d.title ?? "")+"</a>", undefined, true)
    }else{
        addValue("タイトル", d.title ?? "")
    }
    addValue("Nコード", getNcodeStr(d.ncode), d.ncode ?? "")
    addValue("あらすじ", d.story ?? "")
    addValue("キーワード", d.keyword ?? "")
    if(!r18){
        addValue("作者", `<a href='https://mypage.syosetu.com/${d.userid}/'>${escapeHtml(d.writer ?? "")}</a>`, d.userid, true)
    }else{
        addValue("作者", d.writer ?? "")
    }
    if(!r18){
        addValue("大ジャンル", getBigGenre(d.biggenre), d.biggenre)
        addValue("ジャンル", getGenre(d.genre), d.genre)
    }
    addValue("種類", getNovelType(d.novel_type), d.novel_type)
    if(r18){
        addValue("掲載サイト", getNocgenre(d.nocgenre), d.nocgenre)
    }
    addValue("連載状態", getNovelEnd(d.end), d.end)
    addValue("初回掲載日", getDateStr(d.general_firstup), d.general_firstup)
    addValue("最終掲載日", getDateStr(d.general_lastup), d.general_lastup)
    addValue("最終更新日", getDateStr(d.novelupdated_at), d.novelupdated_at)
    addValue("話数", numLocale(d.general_all_no, "話"), d.general_all_no)
    addValue("長期連載停止中", getYesNo(d.isstop), d.isstop)
    if(!r18){
        addValue("R15", getYesNo(d.isr15), d.isr15)
    }
    addValue("ボーイズラブ", getYesNo(d.isbl), d.isbl)
    addValue("ガールズラブ", getYesNo(d.isgl), d.isgl)
    addValue("残酷な描写あり", getYesNo(d.iszankoku), d.iszankoku)
    addValue("異世界転生", getYesNo(d.istensei), d.istensei)
    addValue("異世界転移", getYesNo(d.istenni), d.istenni)

    /* Statics */
    $("#novel_detail .novel_statics").append("<table class='access-table'><tbody></tbody></table>")
    table = $("#novel_detail .novel_statics table tbody")

    table.append("<tr class='header'><th>作品統計</th><th>項目</th><th>データ</th></tr>")
    addValue("文字数", numLocale(d.length, "字"), d.length)
    addValue("読了時間", minuteStringJapanese(d.time ?? ""), d.time)
    addValue("挿絵数", numLocale(d.sasie_cnt, "個"), d.sasie_cnt)
    addValue("会話率", numLocale(d.kaiwaritu,"%"), d.kaiwaritu)
    addValue("総合ポイント", numLocale(d.global_point, "pt"), d.global_point)
    addValue("日間ポイント", numLocale(d.daily_point, "pt"), d.daily_point)
    addValue("週間ポイント", numLocale(d.weekly_point, "pt"), d.weekly_point)
    addValue("月間ポイント", numLocale(d.monthly_point,"pt"), d.monthly_point)
    addValue("四半期ポイント", numLocale(d.quarter_point, "pt"), d.quarter_point)
    addValue("年間ポイント", numLocale(d.yearly_point, "pt"), d.yearly_point)
    if(!r18){
        addValue("ブックマーク数", numLocale(d.fav_novel_cnt, "件"), d.fav_novel_cnt)
    }else{
        addValue("Xブックマーク数", numLocale(d.fav_novel_cnt, "件"), d.fav_novel_cnt)
    }
    addValue("週間ユニークユーザ", numLocale(d.weekly_unique, "人"), d.weekly_unique)
    addValue("感想数", numLocale(d.impression_cnt, "件"), d.impression_cnt)
    addValue("レビュー数", numLocale(d.review_cnt, "件"), d.review_cnt)
    addValue("評価ポイント", numLocale(d.all_point, "pt"), d.all_point)
    addValue("評価者数", numLocale(d.all_hyoka_cnt, "人"), d.all_hyoka_cnt)
    addValue("最終更新日時<br>（システム用）", getDateStr(d.updated_at), d.updated_at)
}

function _buttonApi(ncode: string, data: NovelApi){
    $("#novel_detail").append('<div class="ui-button--center"><input class="ui-button" type="submit" value="エクスポート" id="export-api-data"></div>')
    $("#export-api-data").on("click", function(){
        var date = getDateString();
        var raw = {
            date: date,
            generatedTime: getDatetimeString(),
            ncode: ncode,
            data: data
        }
        saveJson(raw, `api-data_${ncode}_${date}.json`);
    })
}


function _tableRank(ncode: string, d: Array<RankinApi>){
    $("#novel_rank .rank_list").append("<table class='data-table' name='d'><tbody></tbody></table>")
    $("#novel_rank .rank_list").append("<table class='data-table' name='w'><tbody></tbody></table>")
    $("#novel_rank .rank_list").append("<table class='data-table' name='m'><tbody></tbody></table>")
    $("#novel_rank .rank_list").append("<table class='data-table' name='q'><tbody></tbody></table>")
    var tableD = $("#novel_rank_data .rank_list table[name='d'] tbody")
    var tableW = $("#novel_rank_data .rank_list table[name='w'] tbody")
    var tableM = $("#novel_rank_data .rank_list table[name='m'] tbody")
    var tableQ = $("#novel_rank_data .rank_list table[name='q'] tbody")
    
    function addValue(data: RankinApi){
        if(data.rtype!==undefined && data.pt!==undefined && data.rank!==undefined){
        let rank = data.rank
        let point = data.pt
        let rtype = data.rtype.split("-")

        let date = rtype[0]
        let type = rtype[1]
        var cDate = new Date(date.substring(0, 4)+ "/" +date.substring(4, 6)+ "/" +date.substring(6))

        /*
        var type_s
        if(type=="d"){type_s="日間"}
        else if(type=="w"){type_s="週間"}
        else if(type=="m"){type_s="月間"}
        else if(type=="q"){type_s="四半期"}
        */

        var pointStr: string
        if(isNaN(point)){
            pointStr = ""
        }else{
            pointStr = point.toLocaleString()
        }

        var rankStr: string
        if(isNaN(rank)){
            rankStr = ""
        }else{
            rankStr = rank.toLocaleString()
        }

        const text = `<tr>
            <td class="date">${getDateString(cDate)}</td>
            <td class="rank">${rank}</td>
            <td class="point">${point}</td>
        </tr>`

        if(type=="d"){tableD.prepend(text)}
        else if(type=="w"){tableW.prepend(text)}
        else if(type=="m"){tableM.prepend(text)}
        else if(type=="q"){tableQ.prepend(text)}
        }
    }

    $.each(d, function(_, value){
        addValue(value)
    })

    tableD.prepend("<tr><th colspan='3'>日間</th></tr><tr class='header'><th>日付</th><th>順位</th><th>pt.</th></tr>")
    tableW.prepend("<tr><th colspan='3'>週間</th></tr><tr class='header'><th>日付</th><th>順位</th><th>pt.</th></tr>")
    tableM.prepend("<tr><th colspan='3'>月間</th></tr><tr class='header'><th>日付</th><th>順位</th><th>pt.</th></tr>")
    tableQ.prepend("<tr><th colspan='3'>四半期</th></tr><tr class='header'><th>日付</th><th>順位</th><th>pt.</th></tr>")
}

function _buttonRank(ncode: string, data: Array<RankinApi>){
    $("#novel_rank").append('<div class="ui-button--center"><input class="ui-button" type="submit" value="エクスポート" id="export-rank-data"></div>')
    $("#export-rank-data").on("click", function(){
        var date = getDateString();
        var raw = {
            date: date,
            generatedTime: getDatetimeString(),
            ncode: ncode,
            data: data
        }
        saveJson(raw, `rank-data_${ncode}_${date}.json`);
    })
}
