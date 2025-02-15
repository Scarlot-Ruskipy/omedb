# OmeDB | TypeScript Database

Welcome to the public repository of OmeDB. This database will be used in my projects, I have made it public so that those interested in learning how to create their own database can take a look. Please note that there may be mistakes in this project as it is my first attempt at something like this. I hope to improve over time.

> [!IMPORTANT]  
> The project is not complete and may not work, in that instance open an issue and I'll see what I can do!

## Features ✨

- 🔐 Encryption | Ensures the database is secure and safe
- 📨 Speed | It handles queries within 0.6ms
- 🌟 Easy to setup | Run 1 command to build and start
- 💻 Operating System Support | Use any operating system to host it

## Upcoming Features 🗃️

- 🌐 Web Interface | Manage and interact with the database using the web interface

- 🚧 Client Wrapper | Interact with the database using our NPM package

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
| `debug` | Enable debugging on OmeDB (Work in Progress)    |

Example:

```
npm run auto interface
```

## Configuration ⚙️

All the port configurations and the database password are stored in the `.env` file. Here is an example of a configured `.env` file:

```env
#############################################
#           Database requirements           #
#############################################
DB_PASSWORD=uOj07YQ?4n&B
ENCRYPTION_KEY=f41f009cb3e96b5329aa89a61149a0f39eeec31e2216c8678679da159ccd9bcc
TCP_PORT=6520	# Default: 4047

#############################################
#             WEB requirements              #
#############################################
WWW_PORT=5555 # Default: 4048
```

Make sure to update the `.env` file with your own configurations before running the project. You can use the example provided in the [**`env.example`**](.env.example). file as a starting point.

## Credits 🙏

This project was created by [**Scarlot Ruskipy**](https://github.com/Scarlot-Ruskipy). Special thanks to:

- [**iabdelra7man**](https://github.com/iabdelra7man)

## License 📜

This project is licensed under the [**MIT License**](LICENSE).

## Contact 📬

If you have any questions or feedback, feel free to reach out to me on my [**Discord**](https://discord.gg/YydQAcfuC7).

Thank you for visiting and happy coding! 🎉