import * as zmq from "zeromq";

let i = 0;

function work(sender, sink) {
    console.log("Sending tasks to workers...");
  
    // The first message is "0" and signals start of batch
    sink.send("0");
  
    let  total_msec = 0;
  
    // send 100 tasks
    while (i < 100) {
        var workload = Math.abs(Math.round(Math.random() * 100)) + 1;
        total_msec += workload;
        process.stdout.write(workload.toString() + ".");
        sender.send(workload.toString());
        i++;
    }
    console.log("Total expected cost:", total_msec, "msec");
    sink.close();
    sender.close();
    process.exit();
}

async function runVentilator(send_port, sink_port)
{
    process.stdin.resume();
    process.stdin.setRawMode(true);
    
    // Socket to send messages on
    const sender = new zmq.Push();
    await sender.bind(`tcp://*:${send_port}`);
    
    const sink = new zmq.Push();
    sink.connect(`tcp://localhost:${sink_port}`);
    
    console.log("Press enter when the workers are ready...");
    process.stdin.on("data", function() {
      if (i === 0) {
        work(sender, sink);
      }
      process.stdin.pause();
    });
}

const args = process.argv.slice(2);

runVentilator(...(args.length > 1 ? [args[0], args[1]] : [5557, 5558]));