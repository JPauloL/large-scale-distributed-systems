import * as zmq from "zeromq";

async function receiveWork(receiver, sender)
{
    for await (const [msg] of receiver)
    {
        const msec = parseInt(msg.toString(), 10);
    
        // simple progress indicator for the viewer
        process.stdout.write(msg.toString() + ".");
    
        // do the work
        // not a great node sample for zeromq,
        // node receives messages while timers run.
        await new Promise((resolve) => {
            setTimeout(async () => {
            await sender.send("");
            resolve();
            }, msec);
        })
    }
}

async function runWorker(in_port, out_port)
{
    const receiver = new zmq.Pull();
    const sender   = new zmq.Push();

    receiveWork(receiver, sender);
    
    receiver.connect(`tcp://localhost:${in_port}`);
    sender.connect(`tcp://localhost:${out_port}`);
    
    process.on('SIGINT', function() {
      receiver.close();
      sender.close();
      process.exit();
    });
}

const args = process.argv.slice(2);

runWorker(...(args.length > 1 ? [args[0], args[1]] : [5557, 5558]));