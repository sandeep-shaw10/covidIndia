//Global Variable
//var gConfirm, gActive, gRecover, gDeath;
var gData = [];
var date = new Date();
var strDate =  date.getDate()+ "/" + (date.getMonth()+1) + "/" + date.getFullYear();
var animate1 = true;

//Updating Chart
function updateConfigByMutating(active,recover,death) {
    globalChart.data.datasets[0].data = [active,recover,death];
    globalChart.update();
}

//Fetch World API DATA
async function getData(){
    try{
        //https://api.covid19india.org/data.json
        //https://api.covid19india.org/state_district_wise.json
        const json = await fetch('https://api.covid19api.com/summary');
        const globalData = await json.json();
        console.log(globalData);

        $(".world-confirm .total").text(roundData(globalData.Global["TotalConfirmed"]));
        $(".world-confirm .new").text("+"+roundData(globalData.Global["NewConfirmed"]));
        $(".world-recovery .total").text(roundData(globalData.Global["TotalRecovered"]));
        $(".world-recovery .new").text("+"+roundData(globalData.Global["NewRecovered"]));
        $(".world-death .total").text(roundData(globalData.Global["TotalDeaths"]));
        $(".world-death .new").text("+"+roundData(globalData.Global["NewDeaths"]));

        gData[0] = globalData.Global["TotalConfirmed"];
        gData[1] = globalData.Global["TotalRecovered"];
        gData[2] = globalData.Global["TotalDeaths"];
        gData[3] = gData[0] - (gData[1] - gData[2]);
        
        updateConfigByMutating(gData[3],gData[1],gData[2]);

    }catch(error){
        console.log(`The Error : ${error}`);
    }
}     
getData();

//FORMAT API DATA
function roundData(figure){
    let val ;
    if(figure>=1000000){
        val = figure/1000000;
        val = val.toFixed(2).toString()+" M";
    }else if(figure>=1000){
        val = figure/1000;
        val = val.toFixed(2).toString()+" K";
    }else{
        val = figure;
    }
    return val;
}

//CHARt
var globalChart = new Chart($("#doughnut-chart"), {
    type: 'doughnut',
    data: {
      labels: ["Active Cases", "Recovered Cases", "Death Case"],
      datasets: [
        {
          label: "Population (millions)",
          backgroundColor: ["#3e95cd","#3cba9f", "#ff3333"],
          data: [1,1,1]
        }
      ]
    },
    options: {
      title: {
        display: true,
        position: "bottom",
        text: 'Covid Cases till '+strDate
      },
      legend: {
        display: true,
        position : "bottom",
        labels: {
            boxWidth : 20,
        }
    }
    }
});

$("#doughnut-chart").mouseover(function(){
  if(animate1){
    //console.log(gData);
    updateConfigByMutating(0,0,0);
    setTimeout(function(){ updateConfigByMutating(gData[3],gData[1],gData[2]); }, 500);
    animate1 = false;
  }
});


