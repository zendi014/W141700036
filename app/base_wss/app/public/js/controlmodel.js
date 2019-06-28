var q1 = 0; q2 = 0;
l1 = 2.75;
l2 = 4.67;
var main_gltf;


var arr = window.location.href.split("/");
// var result = arr[0] + "//" + arr[2].split(":")[0];
var result = arr[0] + "//" + arr[2];

var socket = io.connect(result);




var ControlModel = function(gltf_data) {
    main_gltf = gltf_data
}



ControlModel.prototype = (function(){

  function onInit() {
    document.addEventListener("keydown", button, false);

    socket_service()
  }



  var uid = new Date().getTime();

  function socket_service() {
      socket.emit('connection', uid);

      socket.on('message', function (data) {
        console.log(data)
      });

      socket.on('update_pos_socket', function (data) {
          ik(data.px, data.py, data.pz)
      });

      socket.emit('disconnect', uid);
  }



  function update_pos_socket(px, py, pz){
        data = {
            "px": px,
            "py": py,
            "pz": pz,
            "type": "to server",
            "uid":uid
        }
        socket.emit('update_pos_socket', data);
  }






  function button(k){
    if(k.keyCode == 65){ // A
        q1--;
    }
    if(k.keyCode == 68){ // D
        q1++;
    }
    if(k.keyCode == 87){ // W
        q2++;
    }
    if(k.keyCode == 88){ // X
        q2--;
    }

    if(k.keyCode == 65 || k.keyCode == 68 || k.keyCode == 87 || k.keyCode == 88){
        fk(q1, q2)
    }

    if(k.keyCode == 83){ // S
    }
  }



	function fk(t1, t2){
			px = l2 * sc("c", t1) * sc("c", t2) + l1 * sc("c", t1);
			py = l2 * sc("s", t1) * sc("c", t2) + l1 * sc("s", t1);
			pz = l2 * sc("s", t2);

      update_pos_socket(px, py, pz)
	}



	function ik(x, y, z){
			s2 = z/l2;
			c2 = math.sqrt(math.abs(1-(s2*s2)))
			t2 = math.atan2(s2, c2) / 2 / math.PI * 360

			a = (l1 + l2 * c2)
			c1 = x / a
			s1 = y / a
			t1 = math.atan2(s1, c1) / 2 / math.PI * 360

      update_pos(t1, t2)
	}




  function update_pos(q1, q2){
    if(q1 <= -80){
      q1 = -80;
    }if(q1 >= 80){
      q1 = 80;
    }

    if(q2 <= -80){
      q2 = -80;
    }if(q2 >= 80){
      q2 = 80;
    }

    main_gltf.scene.traverse(function(c){
      if(c instanceof THREE.SkinnedMesh){
        c.skeleton.bones[0].rotation.y = q1 / 100
        c.skeleton.bones[1].rotation.z = q2 / 100
      }
    })
  }





	function sc(ct, val){
		if(ct == "c"){//cos
			return math.cos( math.unit(val, 'deg') );
		}else{
			return math.sin( math.unit(val, 'deg') );
		}
	}







  return {
    init: onInit
  }
})();
