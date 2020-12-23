
$(document).ready(function(){
    $("#openbtn").on("click",function(){
        $("#mySidenav").css("width","250px");
    });
    $(".closebtn").on("click",function(){
        $("#mySidenav").css("width","0px");
    });
});
            
async function getData(){
    try{
        //https://api.covid19india.org/data.json
        //https://api.covid19india.org/state_district_wise.json
        const json = await fetch('https://api.covid19india.org/data.json');
        const data = await json.json();
        //console.log(data.cases_time_series);
        const dataConfirm = []
        const dataDeath = []
        const dataRecover = []
        for(let i=0;i<data.cases_time_series.length;i++){
            dataConfirm[i] = data.cases_time_series[i].dailyconfirmed
            dataDeath[i] = data.cases_time_series[i].dailydeceased
            dataRecover[i] = data.cases_time_series[i].dailyrecovered
        }
        console.log("CONFIRM CASES\n" + dataConfirm);
        console.log("DEATH CASES\n" + dataDeath);
        console.log("RECOVER CASES\n" + dataRecover);
    }catch(error){
        console.log(`The Error : ${error}`);
    }
}     
getData();