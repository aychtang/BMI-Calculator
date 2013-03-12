$(function(){
  var currentUser = {};
  var socket = io.connect('127.0.0.1');
  socket.on('connect', function(){
      socket.on('postData', function (data) {
        var info = data;
        $('div.bmi').html("");
        $('div.bmi').append('<p class="userbmi">Your BMI is '+currentUser.bmi.toFixed(2)+'.</p>');
        $('div.bmi').append('<p>The average BMI is '+info['AVG(bmi)']+'</p>');
        $('div.bmi').append('<p>Your BMI is '+(currentUser.bmi/info['AVG(bmi)']).toFixed(2)+'% of average.</p>');
      });
    });

  $('.submittal').click(function(event){
    var weight = $('.weight').val();
    var height = $('.height').val();
    var bmi = weight/(height/100 * height/100);
    var userInfo = {weight: weight, height:height, bmi:bmi};
    currentUser = userInfo;
    if(height.match(/^\d{1,3}$/) && weight.match(/^\d{1,3}$/)){
      $('div.bmi').removeClass('error');
      $('div.bmi').addClass('success');
      socket.send(JSON.stringify(userInfo));
    } else {
      $('div.bmi').html("");
      $('div.bmi').append('<p>Please input the correct data.</p>');
      $('div.bmi').addClass('error');
    }

    $('div.feedback').html("");
    if(currentUser.bmi < 18.5){
      $('div.feedback').append('<p>You are underweight</p>');
    } else if (currentUser.bmi > 18.5 && currentUser.bmi < 25){
      $('div.feedback').append('<p>You are normal.</p>');
    } else if (currentUser.bmi > 25 && currentUser.bmi < 33) {
      $('div.feedback').append('<p>You are overweight</p>');
    } else if (currentUser.bmi > 34){
      $('div.feedback').append('<p>You are morbidly obese.</p>');
    }
    event.preventDefault();
  });

});

var partyMode = function(times){
  for(i = times; i > 0; i--){
    $('input.submittal').click();
  }
};