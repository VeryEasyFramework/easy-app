import ServeUnixHandler = Deno.ServeUnixHandler;
import ServeUnixOptions = Deno.ServeUnixOptions;
import HttpServer = Deno.HttpServer;

export class RealtimeServer {
    server: HttpServer

    constructor() {

    }

    start() {
        let socketPath: string
        Deno.args.forEach((arg, index) => {
            if (arg === '--socket') {
                socketPath = Deno.args[index + 1]
            }

        })
        this.server = Deno.serve({
            path: socketPath,
        }, async (request) => {
            const {socket, response} = Deno.upgradeWebSocket(request);
            socket.onopen = () => {
                console.log('Socket opened')
            }
            socket.onmessage = (e) => {
                console.log('Message received', e.data)
            }
            socket.onerror = (e) => {
                console.error('Socket error', e)
            }
            socket.onclose = () => {
                console.log('Socket closed')
            }
            return response
        })
    }
}



