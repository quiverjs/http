import {
  pipeStream, nodeToQuiverWriteStream
} from 'quiver-stream-util'

export const pipeStreamableToNodeStream = async function(streamable, nodeWrite) {
  if(streamable.toNodeStream) {
    const nodeRead = await streamable.toNodeStream()
    nodeRead.pipe(nodeWrite)

  } else {
    const readStream = await streamable.toStream()
    const writeStream = nodeToQuiverWriteStream(nodeWrite)

    await pipeStream(readStream, writeStream)
  }
}
