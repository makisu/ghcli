import { Command, flags } from '@oclif/command'
import { config } from "../config";

export default class RemoveAccessToken extends Command {
    static description = 'Removes access token'

    static flags = {

    }

    static args = []

    async run() {
        config.delete('accessToken')
        console.log('Access Token successfully deleted.')
    }
}
