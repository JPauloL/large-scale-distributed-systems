import * as zmq from "zeromq";

async function awaitResponses(requester)
{
    var replyNbr = 0;

    for await (const [msg] of requester)
    {
        console.log('got reply', replyNbr, msg.toString());
        replyNbr += 1;
    }
}

async function runClient(port)
{
    const requester = new zmq.Request();

    requester.connect(`tcp://localhost:${port}`);

    awaitResponses(requester);

    for (var i = 0; i < 10; ++i) 
    {
        await requester.send("Hello");
    }
}

const args = process.argv.slice(2);

runClient(args.length > 0 ? args[0] : 5555);