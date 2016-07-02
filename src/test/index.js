import './handler'
import './router'

process.on('unhandledRejection', err => {
  console.error('unhandled rejection:', err)
})
