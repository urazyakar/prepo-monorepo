import { SupportedNetworks } from '@prepo-io/constants'

const config = {
  HOST: process.env.NEXT_PUBLIC_HOST ?? 'http://localhost:3000',
  NETWORK: (process.env.NEXT_PUBLIC_NETWORK as unknown as SupportedNetworks) ?? 'localhost',
  ROUNDED_DECIMALS: 4,
  CONFIG_CAT_SDK_KEY: 'xYjZCIkJi0eABaTu6QgigA/c-u2N7zb0EGnXQhvsjdsnQ',
}

const appConfig = {
  isProduction: !config.HOST.includes('localhost'),
}

export default { ...config, ...appConfig }