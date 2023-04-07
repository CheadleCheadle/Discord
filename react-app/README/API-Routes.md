## Users


## Servers

###  Get all Servers

Returns all Servers

* Require Authentication: True
* Request
  * Method: GET
  * URL: /api/servers
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body: none

    ```json
    {
      "Servers": [
        {
          "id": 1,
          "name": "People",
          "type": "public",
          "max_users": 30,
          "topic": "Pets",
          "icon_url": "smthing.url",
          "description": "This discord is for people",
          "server_id": 2,
          "owner_id": 1
        }
      ]
    }

###  Get a Server by serverId

Returns a Single Server

* Require Authentication: True
* Request
  * Method: GET
  * URL: /api/servers/:serverId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body: none

    ```json
    {
      "Server":
        {
          "id": 1,
          "name": "People",
          "type": "public",
          "max_users": 30,
          "icon_url": "smthing.url",
          "description": "This discord is for people",
          "Host": {
            "id": 1,
            "first_name": "Name1",
            "last_name": "Name2",
            "username": "Name12"
          },
          "Channels": {
            {
              "id": 1,
              "name": "channel1",
              "type": "text",
              "topic": "Pets",
              "server_id": 1
            }
          },
          "Members": [
            {
              "id": 1,
              "username": "username",
              "first_name": "first_name",
              "last_name": "last_name",
              "status": "member"
            }
          ]
        }
    }


## Channels

### Get all Channels By Server_ID

Returns all channels by server_id

* Require Authentication: True
* Request
  * Method: GET
  * URL: /api/servers/:serverId/channels/:channelId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body: none

    ```json
    {
      "Channels": [
        {
          "id": 1,
          "name": "Channel-1",
          "type": "text",
          "max_users": 30,
          "topic": "Pets",
          "active_status": true,
          "active_users_num": 12,
          "server_id": 2
        }
      ]
    }
