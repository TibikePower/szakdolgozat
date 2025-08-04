# Vue Monopoly Game

A multiplayer Monopoly-style game built with Vue.js and Socket.IO.

## Project Structure

The project is organized into:

- `client`: Vue.js front-end application
- `server`: Node.js back-end server
  - `models`: Game logic classes
  - `utils`: Utility functions
  - `config`: Server configuration

## Development Setup

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```

### Development

Run the development server and client concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Start the server
npm run server:dev

# Start the client
npm run client:dev
```

### Building for Production

```bash
npm run client:build
npm run start
```

### Running Simulations

```bash
npm run simulate
```

## License

This project is part of a thesis work. See documentation for details.
