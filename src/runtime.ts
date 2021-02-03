import { getServerEnvs } from './utils'

Object.assign(process.env, getServerEnvs())
