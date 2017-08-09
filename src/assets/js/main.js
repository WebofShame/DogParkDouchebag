 $(document).ready(function () {
     // bind rover to 5
     $('#rover').poopRating(5, 5);
     // here we are listening for when rover takes a dump because we are responsible owners
     $('#rover').on('pooped', function (event, value) {
        console.log(value);
         alert('Your dog pooped ' + value + ' times....');
     });

     //  Made the comonent so that you can initialize using either direct id selector or by css class
     $('.scruffy-and-family').poopRating(5, 3);
 });