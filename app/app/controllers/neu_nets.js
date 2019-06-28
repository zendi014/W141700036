//npm install brain.js npm install mathjs

const brain = require("brain.js");
const math = require("mathjs");

const net = new brain.NeuralNetwork();

var q1 = 0; q2 = 0;
l1 = 2.75;
l2 = 4.67;
let pi = 22/7

var gdt = [];

set_data();

function set_data(){
  for(i=0; i <= 200; i++){
      fk(Math.random() * 100 , Math.random() * 100)
      if(i == 200){
        get_output();
      }
  }
}



function fk(t1, t2){
    px = l2 * sc("c", t1) * sc("c", t2) + l1 * sc("c", t1);
    py = l2 * sc("s", t1) * sc("c", t2) + l1 * sc("s", t1);
    pz = l2 * sc("s", t2);
    var dt = {
      input: {
        px: px/10, py:py/10, pz:pz/10
      },
      output: {
        t1: math.sin(math.unit(t1, 'deg')), t2: math.sin(math.unit(t2, 'deg'))
      }
    }
    gdt.push(dt);
}



function get_output() {
    net.train(gdt, {
          iterations: 100,    // the maximum times to iterate the training data --> number greater than 0
          errorThresh: 0.005,   // the acceptable error percentage from training data --> number between 0 and 1
          log: false,           // true to use console.log, when a function is supplied it is used --> Either true or a function
          logPeriod: 10,        // iterations between logging out --> number greater than 0
          learningRate: 0.1,    // scales with delta to effect training rate --> number between 0 and 1
          // hiddenLayers: [4, 8],
          momentum: 0.1,        // scales with next layer's change value --> number between 0 and 1
          callback: null,       // a periodic call back that can be triggered while training --> null or function
          callbackPeriod: 10,   // the number of iterations through the training data between callback calls --> number greater than 0
          timeout: Infinity     // the max number of milliseconds to train for --> number greater than 0
    })

    var output = net.run({ px: 0.5241349135106567, py:0.30260943340705877, pz:0.33021886681411767 }); //30 30
    o1 = math.unit(math.asin(output.t1), "rad");
    o2 = math.unit(math.asin(output.t1), "rad");
    console.log(o1.value / 2 / pi * 360, o2.value / 2 / pi * 360);
}



/*
function fk_(t1, t2){
    px = l2 * sc("c", t1) * sc("c", t2) + l1 * sc("c", t1);
    py = l2 * sc("s", t1) * sc("c", t2) + l1 * sc("s", t1);
    pz = l2 * sc("s", t2);

    console.log(px, py, pz);
}
*/


function sc(ct, val){
	if(ct == "c"){//cos
		return math.cos( math.unit(val, 'deg') );
	}else{
		return math.sin( math.unit(val, 'deg') );
	}
}
