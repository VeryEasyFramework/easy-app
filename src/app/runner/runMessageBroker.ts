import { MessageBroker } from "#/realtime/messageBroker.ts";

/**
 * Run the message broker.
 */
export default function runMessageBroker(port?: number) {
  MessageBroker.getInstance(port).run();
}
