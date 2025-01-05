# OmeDB | TypeScript Database

Welcome to the public repository of OmeDB. This database will be used in my projects, I have made it public so that those interested in learning how to create their own database can take a look. Please note that there may be mistakes in this project as it is my first attempt at something like this. I hope to improve over time.

> [!IMPORTANT]  
> The project is not complete and may not work, in that instance open an issue and I'll see what I can do!

## Features ✨

- 🔐 Encryption | Ensures the database is secure and safe
- 📨 Speed | It handles queries within 0.6ms
- 🌟 Easy to setup | Run 1 command to build and start

## Upcoming Features 🗃️

- 🌐 Web Interface | Manage and interact with the database using the web interface

- 🚧 Client Wrapper | Interact with the database using our NPM package

- 💻 Operating System Support | Use any operating system to host it

- 🔗 Shared instances | Ensure the database will be up for a while and not be under pressure when handling too much load for queries

- 📂 Command Line | To ensure easy usage the command line will ask what options you want to have enabled, incase you don't want a long string to run, we offer storing a config file of all options selected so that the questionair is done once.

## Installation 🛠️

To get started with this project, follow these steps:

1. Clone the repository: `git clone https://github.com/Scarlot-Ruskipy/omedb.git`
2. Navigate to the project directory: `cd omedb`
3. Install dependencies: `npm install`

## Usage 📖

To start the project run the command below; This will start the database without the Web-Interface.

```bash
npm run auto
```

To start with the Web-Interface you can pass options in the npm command.

| Option       | Description                                      |
|--------------|--------------------------------------------------|
| `interface`      | Start the database with the Web-Interface        |
| `port <n>` | Specify the port number for the Web-Interface    |
| `debug` | Enable debugging on OmeDB (Work in Progress)    |

Example:

```
npm run auto interface port 9999
```

## Credits 🙏

This project was created by **Scarlot Ruskipy**. Special thanks to:

- [iabdelra7man](https://github.com/iabdelra7man)

## License 📜

This project is licensed under the [MIT License](LICENSE).

## Contact 📬

If you have any questions or feedback, feel free to reach out to me on my [Discord](https://discord.gg/YydQAcfuC7).

Thank you for visiting and happy coding! 🎉
