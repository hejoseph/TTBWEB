var l = "localhost";
var r = "192.168.150.10"
// alert('hey');
var ros = new ROSLIB.Ros({
			    url : 'ws://'+r+':9090'
			  });
			  ros.on('connection', function() {
			    console.log('Connected to websocket server.');
			    $('#result').text('Connection Opened');
			    $('#result').css("color","green");
			    $('#connect').hide();
			  });

			  ros.on('error', function(error) {
			    console.log('Error connecting to websocket server: ', error);
			    $('#result').text('Error');
			    $('#result').css("color","red");
			  });

			  ros.on('close', function() {
			    console.log('Connection to websocket server closed e.');
			    $('#result').text('Connection Closed');
			    $('#result').css("color","orange");
			  });


//get list of running parameters
			   ros.getParams(function(params) {
				    console.log(params);
				  });

			   //get param value 

			   var maxVelX = new ROSLIB.Param({
				    ros : ros,
				    name : '/run_id'
				  });

			  // maxVelX.set(0.8);
			  maxVelX.get(function(value) {
			    console.log('MAX VAL: ' + value);
			  });


  var cmdVel = new ROSLIB.Topic({
    ros : ros,
    name : '/cmd_vel_mux/input/teleop',
    messageType : 'geometry_msgs/Twist'
  });

function move(forward,left){
	var twist = new ROSLIB.Message({
    linear : {
      x : forward,
      y : 0.0,
      z : 0.0
    },
    angular : {
      x : 0.0,
      y : 0.0,
      z : left
    }
  });
  cmdVel.publish(twist);
}
var speed_forward = 2;

function goForward(){
  move(0.10,0.0);
}

function goBackward(){
  move(-0.10,0.0)
}

function turnLeft(){
  move(0.0,0.10)
}

function turnRight(){
  move(0.0,-0.10)
}

var listener = new ROSLIB.Topic({
    ros : ros,
    name : '/at_base',
    messageType : 'std_msgs/Bool'
  });

  listener.subscribe(function(message) {
    console.log('Received message on ' + listener.name + ': ' + JSON.stringify(message));
    $('#bot_at_base').text((message.data==true)?"yes":"no");
    // listener.unsubscribe();
  });


function load_waiting_list(){
	var listener = new ROSLIB.Topic({
    ros : ros,
    name : '/clients',
    messageType : 'custom_data/ClientArray'
  });

  listener.subscribe(function(message) {
    console.log('Received message on ' + listener.name + ': ' + JSON.stringify(message));
    var string_html ='<div id="waiting_list">';
    if(message.clients.length==0){
    	// alert('hi');
    	string_html+="Nobody for the moment ...";
    }
    for(i=0;i<message.clients.length;i++){
    	string_html+="<p>";
    	string_html+=message.clients[i].client_name+"  x="+message.clients[i].posx+"   y"+message.clients[i].posy+"   nb_item="+message.clients[i].nb_item;
    	string_html+="</p>";
    }
    string_html+="</div>";
    $('#waiting_list').replaceWith(string_html);
    // listener.unsubscribe();
  });
}

function request_page(){
	var pub = new ROSLIB.Topic({
			    ros : ros,
			    name : 'request_page',
			    messageType : 'std_msgs/Int8'
			  });
		var pressed = new ROSLIB.Message({
			    data : 1
			  });
			  pub.publish(pressed);
}

$(document).ready(function(){

	request_page();

	// Subscribing to a Topic
  // ----------------------
  load_waiting_list();
  
  $('#validate_drink').click(function(){
  		var pub = new ROSLIB.Topic({
			    ros : ros,
			    name : 'valid_pressed',
			    messageType : 'std_msgs/Int8'
			  });
		var pressed = new ROSLIB.Message({
			    data : 1
			  });
			  pub.publish(pressed);
  });


	$('#command').click(function(){
		var client_name = $('#name').val();
		var posx = $('#posx').val();
		var posy = $('#posy').val();
		var nb_item = $('#nb_item').val();

		if(client_name==''||posx==''||posy==''||nb_item==''){
			return ;
		}
		var cmdClient = new ROSLIB.Topic({
			    ros : ros,
			    name : 'command_client',
			    messageType : 'custom_data/Client'
			  });
		var client = new ROSLIB.Message({
			    client_name : client_name.toString(),
			      posx : parseFloat(posx.toString()),
			      posy : parseFloat(posy.toString()),
			      nb_item : parseInt(nb_item.toString())
			  });
			  cmdClient.publish(client);
	});

	$('#calldrink').click(function(){
		// alert('hi');
    		// Publishing a Topic
		  // ------------------
		  		// alert("pub clicked");
			  var cmdVel = new ROSLIB.Topic({
			    ros : ros,
			    name : 'send_goals_node/coffee_command',
			    messageType : 'geometry_msgs/Twist'
			  });

			  var x = $('#x').val();
			  var y = $('#y').val();

			 //  var buffer = new ArrayBuffer(4);
				// var floatView = new Float32Array(buffer);

				// floatView[0] = x
				// console.log(x.toString()); //bits of the 32 bit float
				var a = 0.0;
				// x=parseFloat(x.toString());
				// alert(parseFloat(x.toString()));
			  // alert("ok");
			  // alert(x);
			  var twist = new ROSLIB.Message({
			    linear : {
			      x : 0.0,
			      y : 0.0,
			      z : 0.0
			    },
			    angular : {
			      x : 0.0,
			      y : 0.0,
			      z : 0.0
			    }
			  });
			  cmdVel.publish(twist);
    	});

	$('#submit').click(function(){
		// alert('hi');
    		// Publishing a Topic
		  // ------------------
		  		// alert("pub clicked");
			  var cmdVel = new ROSLIB.Topic({
			    ros : ros,
			    name : 'send_goals_node/coffee_command',
			    messageType : 'geometry_msgs/Twist'
			  });

			  var x = $('#x').val();
			  var y = $('#y').val();

			 //  var buffer = new ArrayBuffer(4);
				// var floatView = new Float32Array(buffer);

				// floatView[0] = x
				// console.log(x.toString()); //bits of the 32 bit float
				var a = 0.0;
				// x=parseFloat(x.toString());
				// alert(parseFloat(x.toString()));
			  // alert("ok");
			  // alert(x);
			  var twist = new ROSLIB.Message({
			    linear : {
			      x : parseFloat(x.toString()),
			      y : parseFloat(y.toString()),
			      z : 0.0
			    },
			    angular : {
			      x : 0.0,
			      y : 0.0,
			      z : 0.0
			    }
			  });
			  cmdVel.publish(twist);
    	});

    	$('#pub').click(function(){
    		// Publishing a Topic
		  // ------------------
		  		// alert("pub clicked");
			  var cmdVel = new ROSLIB.Topic({
			    ros : ros,
			    name : 'turtle1/cmd_vel',
			    messageType : 'geometry_msgs/Twist'
			  });

			  var twist = new ROSLIB.Message({
			    linear : {
			      x : 2.0,
			      y : 0.0,
			      z : 0.0
			    },
			    angular : {
			      x : 0.0,
			      y : 0.0,
			      z : 1.8
			    }
			  });
			  cmdVel.publish(twist);
    	});


    	$('#sub').click(function(){
    		var listener = new ROSLIB.Topic({
		    ros : ros,
		    name : 'turtle1/cmd_vel',
		    messageType : 'geometry_msgs/Twist'
		  });

		  listener.subscribe(function(message) {
		    console.log('Received message on ' + listener.name + ': ' + JSON.stringify(message)		);
		    listener.unsubscribe();
		  });
    	});

    	$('#up').click(function(){
    		// Publishing a Topicr
		  // ------------------
		  		// alert("pub clicked");
			  goForward();
    	});

    	$('#down').click(function(){
    		// Publishing a Topic
		  // ------------------
		  		// alert("pub clicked");
			  goBackward();
    	});

    	$('#left').click(function(){
    		// Publishing a Topic
		  // ------------------
		  		// alert("pub clicked");
			  turnLeft();
    	});

    	$('#right').click(function(){
    		// Publishing a Topic
		  // ------------------
		  		// alert("pub clicked");
			  turnRight();
    	});

});




$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        	turnLeft();
        break;

        case 38: // up
        	goForward();
        break;

        case 39: // right
	        turnRight();
        break;

        case 40: // down
        	goBackward();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});