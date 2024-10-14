import * as zmq from "zeromq";
  
async function runServer(port)
{
    const responder = new zmq.Reply();
    
    responder.connect(`tcp://localhost:${port}`);

    for await (const [msg] of responder) 
    {
        console.log('received request:', msg.toString());
            setTimeout(function() {
                responder.send("World");
            }, 1000);
    }
}

const args = process.argv.slice(2);

runServer(args.length > 0 ? args[0] : 5556);