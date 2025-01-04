import * as fs from 'fs';
import * as path from 'path';

const dotenvPath = path.resolve(__dirname, '../../.env');

function loadEnv(filePath: string): void {
    if (!fs.existsSync(filePath)) {
        console.error(`.env file not found at path: ${filePath}`);
        return;
    }

    const envConfig = fs.readFileSync(filePath, 'utf-8');
    const envVariables = envConfig.split('\n');

    envVariables.forEach(variable => {
        const [key, value] = variable.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

loadEnv(dotenvPath);