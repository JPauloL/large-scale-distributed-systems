import * as zmq from "zeromq";

async function runFrontend(frontend, backend)
{
    for await (const msg of frontend)
    {
        console.log("front msg:", msg.toString());
        await backend.send(msg);
    }
}

async function runBackend(frontend, backend)
{
    for await (const msg of backend)
    {
        console.log("back msg:", msg.toString());
        await frontend.send(msg);
    }
}

async function runBroker(front_port, back_port)
{
    const frontend = new zmq.Router();
    const backend  = new zmq.Dealer();

    await Promise.all([
        frontend.bind(`tcp://*:${front_port}`),
        backend.bind(`tcp://*:${back_port}`)
    ]);

    runFrontend(frontend, backend);
    runBackend(frontend, backend);
}


const args = process.argv.slice(2);

runBroker(...(args.length > 1 ? [args[0], args[1]] : [5555, 5556]));