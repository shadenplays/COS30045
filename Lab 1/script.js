$(document).ready(function() {

    function hideAllImages() {
        $("#pet2019").hide();
        $("#pet2021").hide();
        $("#both").hide();
    }

    // Show the 2019 image
    $("#showImageBtn2019").click(function() {
        hideAllImages(); 
        $("#pet2019").show();
        $("#Chartcap").text("Pets 2019 data.");
    });

    // Show the 2021 image
    $("#showImageBtn2021").click(function() {
        hideAllImages(); 
        $("#pet2021").show();
        $("#Chartcap").text("Pets 2021 data.");
    });

    $("#showBoth").click(function() {
        hideAllImages(); 
        $("#both").show();
        $("#Chartcap").text("Both data.");
    });
});