var data_gltf;
const net = new brain.NeuralNetwork();

var q1 = 0, q2 = 0, 
    l1 = 2.75,
    l2 = 4.67,
    lr = 0.1,
    data_set_length = 1000,
    epoch = 500;

var cNeuNet = function (gltf) {
    data_gltf = gltf
}

cNeuNet.prototype = (function () {
    function onInit() {
        generate_data();
    }
    return {
        init: onInit
    }
})();

function generate_data(){
    for(i = 0; i <= data_set_length; i++){
        t1 = Math.random() * 100;
        t2 = Math.random() * 100;
        fk(t1, t2);
        if(i == data_set_length){
            training_data();
        }
    }
}

let global_data_set = [];
function fk(t1, t2) {
    px = l2 * sc("c", t1) * sc("c", t2) + l1 * sc("c", t1);
    py = l2 * sc("s", t1) * sc("c", t2) + l1 * sc("s", t1);
    pz = l2 * sc("s", t2);

    let data_set = {
        input: {
            px: px / 10,
            py: py / 10,
            pz: pz / 10,
        },
        output: {
            t1: math.sin(math.unit(t1, "deg")),
            t2: math.sin(math.unit(t2, "deg"))
        }
    }
    global_data_set.push(data_set);
}

function training_data(){
    console.log(global_data_set)
}

function sc(ct, val) {
    if (ct == "c") { //cos
        return math.cos(math.unit(val, 'deg'));
    } else {
        return math.sin(math.unit(val, 'deg'));
    }
}