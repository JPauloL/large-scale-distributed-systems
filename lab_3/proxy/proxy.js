import * as zmq from "zeromq";

async function receiveSubs(sub, pub)
{
    for await (const msg of pub)
    {
        console.log(msg);
        await sub.send(msg);
    }
}

async function receiveMessages(sub, pub)
{
    for await (const msg of sub)
    {
        console.log(msg)
        await pub.send(msg);
    }
}

async function runProxy(sub_port, pub_port)
{
    const sub = new zmq.XSubscriber();
    await sub.bind(`tcp://*:${sub_port}`);
    
    const pub = new zmq.XPublisher();
    await pub.bind(`tcp://*:${pub_port}`);

    receiveSubs(sub, pub);
    receiveMessages(sub, pub);
}

const args = process.argv.slice(2);

runProxy(...(args.length > 1 ? [args[0], args[1]] : [5555, 5556]));
