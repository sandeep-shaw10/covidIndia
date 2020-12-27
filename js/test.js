
$(document).ready(function(){
    $("#openbtn").on("click",function(){
        $("#mySidenav").css("width","250px");
    });
    $(".closebtn").on("click",function(){
        $("#mySidenav").css("width","0px");
    });
});