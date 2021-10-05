import axios from 'axios'

export default axios.create({
  headers: {
    'x-vtex-user-agent': process.env.VTEX_APP_ID,
  },
})
