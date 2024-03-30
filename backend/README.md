# VIP Score Bot

Bot for taking score snapshot for VIP (Vested Interest Program)

# How to use

```bash
npm i
```

```bash
npm run start
```

# Configuration

| Name                    | Description                                    | Default                               |
|-------------------------|------------------------------------------------|---------------------------------------|
| SERVER_PORT             | Server port                                    | 6000                                  |
| AGENT_MNEMONIC       | Mnemonic seed                                  | ''                                    |
| L1_LCD_URL              | LCD URL                                        | 'https://next-stone-rest.initia.tech' |
| UPDATE_INTERVAL         | Update interval for taking L2 balance snapshot | 1000 * 60 * 60 * 24 * 7               |

> In minitia-balance-bot, we use [direnv](https://direnv.net) for managing environment variable for development. See [sample of .envrc](.envrc_sample)
