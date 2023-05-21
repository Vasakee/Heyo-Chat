const chats = [
  {
    isGroupChat: false,
    users: [
      {
        name: "Basil",
        email: "basil@example.com",
      },
      {
        name: "Shedrack",
        email: "shedrack@example.com",
      },
    ],
    _id: "617a077e18c25468bc7c4dd4",
    chatName: "Basil",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Guest User",
        email: "guest@example.com",
      },
      {
        name: "Shedrack",
        email: "shedrack@example.com",
      },
    ],
    _id: "617a077e18c25468b27c4dd4",
    chatName: "Guest User",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Elliot",
        email: "elliot@example.com",
      },
      {
        name: "Shedrack",
        email: "shedrack@example.com",
      },
    ],
    _id: "617a077e18c2d468bc7c4dd4",
    chatName: "Elliot",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Basil",
        email: "basil@example.com",
      },
      {
        name: "Shedrack",
        email: "shedrack@example.com",
      },
      {
        name: "Guest User",
        email: "guest@example.com",
      },
    ],
    _id: "617a518c4081150716472c78",
    chatName: "Friends",
    groupAdmin: {
      name: "Guest User",
      email: "guest@example.com",
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Jemimah",
        email: "jemimah@example.com",
      },
      {
        name: "Shedrack",
        email: "shedrack@example.com",
      },
    ],
    _id: "617a077e18c25468bc7cfdd4",
    chatName: "Jemimah",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Basil",
        email: "basil@example.com",
      },
      {
        name: "Shedrack",
        email: "piyush@example.com",
      },
      {
        name: "Guest User",
        email: "guest@example.com",
      },
    ],
    _id: "617a518c4081150016472c78",
    chatName: "Chill Zone",
    groupAdmin: {
      name: "Guest User",
      email: "guest@example.com",
    },
  },
];

module.exports = { chats }