import * as zmq from "zeromq";

async function receiveResults(receiver)
{
    let started = false;
    let i = 0;
    let label = "Total elapsed time";

    for await (const [msg] of receiver)
    {
        // wait for start of batch
        if (!started) {
            console.time(label);
            started = true;
        
        // process 100 confirmations
        } else {
            i += 1;
            process.stdout.write(i % 10 === 0 ? ':' : '.');
            if (i === 100) 
            {
                console.timeEnd(label);
                receiver.close();
                process.exit();
            }
        }
    }
}

async function runSink(port)
{
    const receiver = new zmq.Pull();
    
    receiveResults(receiver);
    
    await receiver.bind(`tcp://*:${port}`);
}

const args = process.argv.slice(2);

runSink(args.length > 1 ? args[0] : 5558);