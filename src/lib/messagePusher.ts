import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
  appId: process.env.APP_ID!,
  key: process.env.KEY!,
  secret: process.env.SECRET!,
  cluster: process.env.CLUSTER!,
  useTLS: true,
});

export const pusherClient = new PusherClient(process.env.KEY!, {
  cluster: process.env.CLUSTER!,
});