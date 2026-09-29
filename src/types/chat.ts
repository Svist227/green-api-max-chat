interface Chat {
    chatId:string,
    isSelf?: boolean,
    name:string,
  type: 'user' | 'group' | 'supergroup' | 'channel'
    phoneNumber: number | null;
    username: string | null;
//   colMessage: number;
}
