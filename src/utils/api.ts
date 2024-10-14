export function getBigGenre(genre:number){
    if(genre==1){
        return "恋愛"
    }
    else if(genre==2){
        return "ファンタジー"
    }
    else if(genre==3){
        return "文芸"
    }
    else if(genre==4){
        return "SF"
    }
    else if(genre==99){
        return "その他"
    }
    else if(genre==98){
        return "ノンジャンル"
    }
    else{
        return ""
    }
}

export function getGenre(genre:number){
    if(genre==101){
        return "異世界〔恋愛〕"
    }
    else if(genre==102){
        return "現実世界〔恋愛〕"
    }
    else if(genre==201){
        return "ハイファンタジー〔ファンタジー〕"
    }
    else if(genre==202){
        return "ローファンタジー〔ファンタジー〕"
    }
    else if(genre==301){
        return "純文学〔文芸〕"
    }
    else if(genre==302){
        return "ヒューマンドラマ〔文芸〕"
    }
    else if(genre==303){
        return "歴史〔文芸〕"
    }
    else if(genre==304){
        return "推理〔文芸〕"
    }
    else if(genre==305){
        return "ホラー〔文芸〕"
    }
    else if(genre==306){
        return "アクション〔文芸〕"
    }
    else if(genre==307){
        return "コメディー〔文芸〕"
    }
    else if(genre==401){
        return "VRゲーム〔SF〕"
    }
    else if(genre==402){
        return "宇宙〔SF〕"
    }
    else if(genre==403){
        return "空想科学〔SF〕"
    }
    else if(genre==404){
        return "パニック〔SF〕"
    }
    else if(genre==9901){
        return "童話〔その他〕"
    }
    else if(genre==9902){
        return "詩〔その他〕"
    }
    else if(genre==9903){
        return "エッセイ〔その他〕"
    }
    else if(genre==9904){
        return "リプレイ〔その他〕"
    }
    else if(genre==9999){
        return "その他〔その他〕"
    }
    else if(genre==9801){
        return "ノンジャンル〔ノンジャンル〕"
    }
    else{
        return ""
    }
}

export function getGenreNumber(genre:string){
    if(genre=="異世界〔恋愛〕"){
        return 101
    }
    else if(genre=="現実世界〔恋愛〕"){
        return 102
    }
    else if(genre=="ハイファンタジー〔ファンタジー〕"){
        return 201
    }
    else if(genre=="ローファンタジー〔ファンタジー〕"){
        return 202
    }
    else if(genre=="純文学〔文芸〕"){
        return 301
    }
    else if(genre=="ヒューマンドラマ〔文芸〕"){
        return 302
    }
    else if(genre=="歴史〔文芸〕"){
        return 303
    }
    else if(genre=="推理〔文芸〕"){
        return 304
    }
    else if(genre=="ホラー〔文芸〕"){
        return 305
    }
    else if(genre=="アクション〔文芸〕"){
        return 306
    }
    else if(genre=="コメディー〔文芸〕"){
        return 307
    }
    else if(genre=="VRゲーム〔SF〕"){
        return 401
    }
    else if(genre=="宇宙〔SF〕"){
        return 402
    }
    else if(genre=="空想科学〔SF〕"){
        return 403
    }
    else if(genre=="パニック〔SF〕"){
        return 404
    }
    else if(genre=="童話〔その他〕"){
        return 9901
    }
    else if(genre=="詩〔その他〕"){
        return 9902
    }
    else if(genre=="エッセイ〔その他〕"){
        return 9903
    }
    else if(genre=="リプレイ〔その他〕"){
        return 9904
    }
    else if(genre=="その他〔その他〕"){
        return 9999
    }
    else if(genre=="ノンジャンル〔ノンジャンル〕"){
        return 9801
    }
    else{
        return null
    }
}

export function getNovelType(tp:Number){
    if(tp==1){
        return "連載"
    }
    else if(tp==2){
        return "短編"
    }else{
        return ""
    }
}

export function getNovelEnd(state:Number){
    if(state==0){
        return "完結"
    }
    else if(state==1){
        return "連載中"
    }else{
        return ""
    }
}

export function getNocgenre(genre:Number){
    if(genre==1){
        return "ノクターンノベルズ(男性向け)"
    }
    else if(genre==2){
        return "ムーンライトノベルズ(女性向け)"
    }
    else if(genre==3){
        return "ムーンライトノベルズ(BL)"
    }
    else if(genre==4){
        return "ミッドナイトノベルズ(大人向け)"
    }
    else{
        return ""
    }
}