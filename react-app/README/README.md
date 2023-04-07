## Redux Store Tree
```
store = {
  session: {
    user: {
      userData
    },
    memberships: {
      [serverId]: {
        serverData
      }
    },
    friends: {
      allUsers: {
        userData
      }
    }
  },
  servers: {
    allServers: {
      [serverId]: {
        serverData
      }
    },
    singleServer: {
      serverData,
      Channels: {
        allChannels: {
          [channelId]: {
            channelData
          }
        }
      }
      Members: {
        allUsers: {
          [userId]: {
            userData
          }
        }
      },
      Host: {
        userData
      },
      AllCategories: [ categories list ]
    }
  },
  channels: {
    allChannels: {
      [channelId]: {
        channelData
      }
    },
    singleChannel: {
      channelData,
      Messages: {
        [messages_id]: {
          messageData
        }
      },
      HostServer: {
        serverData
      },
      Subscribers: {
        [userId]: {
          userData
        }
      }
    }
  }
}
