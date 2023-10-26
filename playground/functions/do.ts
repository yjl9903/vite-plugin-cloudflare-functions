export class Counter implements DurableObject {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  // Handle HTTP requests from clients.
  async fetch(request: Request) {
    // Apply requested action.
    const url = new URL(request.url);

    // Durable Object storage is automatically cached in-memory, so reading the
    // same key every request is fast.
    // You could also store the value in a class member if you prefer.
    let value = +(await this.state.storage.get('value')) || 0;

    switch (url.pathname) {
      case '/increment':
        ++value;
        break;
      case '/decrement':
        --value;
        break;
      case '/':
        // Serves the current value.
        break;
      default:
        return new Response('Not found', { status: 404 });
    }

    // You do not have to worry about a concurrent request having modified the value in storage.
    // "input gates" will automatically protect against unwanted concurrency.
    // Read-modify-write is safe.
    await this.state.storage.put('value', value);

    return new Response('' + value);
  }
}
