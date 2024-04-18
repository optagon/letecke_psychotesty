 window.onload = function() {

    let combinations = '{{ combinations.combination| tojson | safe }}';
    combinations = combinations.replace('[','');
    combinations = combinations.replace(']','');
    combinations = combinations.split('"').join('');
    let array = combinations.split(',');
    console.log(array[1]);

    outputHTML = "";
    function loop() {
     for(let i = 0; i < 10; i++) {

      setTimeout(function(){
      var element = document.getElementById('displayCombinations');
      element.innerHTML = array[i];
      //alert(outputHTML);
      }, 5000 * i);


     }
     }
loop()

}


function playLoop () {

 for(let i = 0; i < 10; i++) {
  file_path = 'sounds/sound'+i+'.mp3'
  console.log(file_path);


  let audio = new Audio('{{ url_for('static', filename='sounds/sound1.mp3')

  setTimeout(function(){
   audio.play();
   }, 15000 * i);

 })
}