//Global Variable
//var gConfirm, gActive, gRecover, gDeath;
var gData = [];
var date = new Date();
var strDate =  date.getDate()+ "/" + (date.getMonth()+1) + "/" + date.getFullYear();
var animate1 = true;
var countryName = [];
var globalData;


//Updating Doghnout Chart
function updateConfigByMutating(active,recover,death) {
    globalChart.data.datasets[0].data = [active,recover,death];
    globalChart.update();
}

//Updating Bar Chart
function updateConfigByMutating_Bar(active,recover,death) {
  barChart.data.datasets[0].data = [active,recover,death];
  barChart.update();
}

//Fetch World API DATA
async function getData(){
    try{
        //https://api.covid19india.org/data.json
        //https://api.covid19india.org/state_district_wise.json
        const json = await fetch('https://api.covid19api.com/summary');
        globalData = await json.json();
        //console.log(globalData);

        if (globalData.Message == ""){
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

          $("#searchCountry").text(globalData.Countries[76]["Country"]);
          $(".case-box-recover").text(roundData(globalData.Countries[76]["TotalRecovered"]));
          $(".case-box-death").text(roundData(globalData.Countries[76]["TotalDeaths"]));
          $(".case-box-confirm").text("Total Confirmed Cases : "+globalData.Countries[76]["TotalConfirmed"]);
          let active = globalData.Countries[76]["TotalConfirmed"]-globalData.Countries[76]["TotalRecovered"]-globalData.Countries[76]["TotalDeaths"]
          $(".case-box-active").text(roundData(active));
          $("#ctoday").text("Confirm : "+globalData.Countries[76]["NewConfirmed"]);
          $("#rtoday").text("Recover : "+globalData.Countries[76]["NewRecovered"]);
          $("#dtoday").text("Death : "+globalData.Countries[76]["NewDeaths"]);

          updateConfigByMutating_Bar(globalData.Countries[76]["NewConfirmed"],globalData.Countries[76]["NewRecovered"],globalData.Countries[76]["NewDeaths"]);

          saveCountryName(globalData);

          $("#loader").removeClass("show");
          $("#loader").addClass("hide");
          $("#content").removeClass("hide");
          $("#content").addClass("show");
        }else{
          //window.alert("PROBLEM : "+globalData["Message"])
        }

    }catch(error){
        console.log(error);
        throwError(2,error);
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
        text: 'Global Covid Cases till '+strDate
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

function throwError(a,type){
  if(a==1){
    console.log("CACHING PROBLEM: SLOW INTERNET");
  }else if(a == 2){
    console.log("CACHING PROBLEM: SLOW INTERNET");
  }else{
    console.log("ERROR : "+type);
  }
}

function saveCountryName(data){
  for(let i=0; i < data.Countries.length;i++){
    countryName.push(data.Countries[i]["Country"]);
  }
  //console.log(countryName);
}

var barChart = new Chart(document.getElementById("bar-chart-horizontal"), {
  type: 'horizontalBar',
  data: {
    labels: ["Confirmed", "Recovery", "Death"],
    datasets: [
      {
        label: "People",
        backgroundColor: ["#3333ff", "#33ff33","#ff3333"],
        data: [0,0,0]
      }
    ]
  },
  options: {
    legend: { display: false },
    title: {
      display: false,
    }
  }
});

//INPUT Event
$("#countryDataList").on("input",function(){
  let x =  $("#countryDataList").val();
  //console.log(x);
  generateCountryName(x);
})

//SEARCH Event
$("#button-render").on("click",function(){
  let name = $("#countryDataList").val().toUpperCase();
  renderCountryData(name);
})

function generateCountryName(input){
  var count = 0;
  $("#datalistOptions").html(" ");
  for(let i=0; i<countryName.length ; i++ ){
    if((countryName[i].toUpperCase()).indexOf(input.toUpperCase()) > -1 && count < 10){
      $("#datalistOptions").append("<option value=\""+countryName[i]+"\"></option>");
      count++;
    }
  }
}

function renderCountryData(name){
  let id;
  for(let i=0; i<countryName.length ;i++){
    //console.log(name+"===="+countryName[i].toUpperCase()+"<<<>>>>"+id+"<<<<>>>>"+i+"___")
    if(name == countryName[i].toUpperCase()){
      id = i;
      //console.log(id);
    }
  }

  if(id == undefined){
    window.alert("INVALID NAME");
  }else{
    //Render Data
    //console.log(globalData);
    $("#searchCountry").text(globalData.Countries[id]["Country"]);
    $(".case-box-recover").text(roundData(globalData.Countries[id]["TotalRecovered"]));
    $(".case-box-death").text(roundData(globalData.Countries[id]["TotalDeaths"]));
    $(".case-box-confirm").text("Total Confirmed Cases : "+globalData.Countries[id]["TotalConfirmed"]);
    let active = globalData.Countries[id]["TotalConfirmed"]-globalData.Countries[id]["TotalRecovered"]-globalData.Countries[id]["TotalDeaths"]
    $(".case-box-active").text(roundData(active));
    $("#ctoday").text("Confirm : "+globalData.Countries[id]["NewConfirmed"]);
    $("#rtoday").text("Recover : "+globalData.Countries[id]["NewRecovered"]);
    $("#dtoday").text("Death : "+globalData.Countries[id]["NewDeaths"]);

    updateConfigByMutating_Bar(globalData.Countries[id]["NewConfirmed"],globalData.Countries[id]["NewRecovered"],globalData.Countries[id]["NewDeaths"]);
  }

}
