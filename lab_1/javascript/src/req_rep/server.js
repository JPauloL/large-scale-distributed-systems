import * as zmq from "zeromq";

async function runServer(port)
{
    const sock = new zmq.Reply();
    
    await sock.bind(`tcp://*:${port}`);
  
    for await (const [msg] of sock) 
    {
        console.log('Received ' + ': [' + msg.toString() + ']');
        await sock.send('World');
        // Do some 'work'
    }
}

const args = process.argv.slice(2);

runServer(args.length > 0 ? args[0] : 5555);