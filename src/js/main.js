var iphone;
var apple;
var letter;

$('document').ready(function(){
	console.log('jquery running...');
	iphone = new Vivus('iphone', {file: 'src/assets/iphone.svg', duration: 200, start:'manual'});
	apple = new Vivus('apple', {file: 'src/assets/apple.svg', duration: 150, start:'manual'});
	letter = new Vivus('letter', {file: 'src/assets/letter.svg', duration: 200, start:'manual'});
})


var checkVisibility = function(){
	var $breaker1 = $( '#breaker1' );
	var $breaker2 = $( '#breaker2' );
	var $breaker3 = $( '#breaker3' );
	var $breaker4 = $( '#breaker4' );

	if ( $breaker1.is( ':in-viewport(300)' ) ) {
  	console.log('breaker 1 is visible')
	}
	if ( $breaker2.is( ':in-viewport(300)' ) ) {
  	iphone.play()
	}
	if ( $breaker3.is( ':in-viewport(300)' ) ) {
  	apple.play()
	}
	if ( $breaker4.is( ':in-viewport(300)' ) ) {
  	letter.play()
	}
}

$(window).scroll(function(){
	checkVisibility();
})