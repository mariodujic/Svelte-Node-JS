<script>
  import io from 'socket.io-client'
  import {v4 as uuidv4} from 'uuid';
  import {port} from "../system.config";

  export let padding = `${8}px`

  let socket = io(`http://localhost:${port}`)
  let chatMessages = []
  let chatUsers = []
  let message = ''

  let user = localStorage.getItem('user') || uuidv4().substring(0, 4)
  $: localStorage.setItem('user', user)
  socket.emit('user', user)

  let sendMessage = () => {
    socket.emit('message', message, user)
    message = ''
  }

  socket.on("messages", (messages) => {
    chatMessages = messages
  })

  socket.on("users", (users) => {
    chatUsers = users
  })
</script>

<main>
  <div class="main-section" style="--padding:{padding}">
    <div class="chat-section">
      <div class="spacer"></div>
      <div class="message-section">
        {#if (chatMessages.length === 0)}
          <p>No messages</p>
        {/if}
        <ul class="messages">
          {#each chatMessages as chatMessage}
            <li>
              <b>({chatMessage.user})</b> {chatMessage.message}
            </li>
          {/each}
        </ul>
      </div>
      <form action="">
        <input autocomplete="off" bind:value={message}/>
        <button class="send-message" type="submit" on:click|preventDefault={sendMessage}>Send</button>
      </form>
    </div>
    <div class="users-section">
      {#each chatUsers as user}
        <div class="username">
          {user}
        </div>
      {/each}
    </div>
  </div>
</main>

<style>
  .main-section {
    display: flex;
    flex-direction: row;
    height: 100vh;
    background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
  }

  .main-section form {
    display: flex;
    gap: 10px;
    padding: var(--padding)
  }

  .main-section input {
    flex: 1;
  }

  .chat-section {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .spacer {
    flex-grow: 1;
  }

  .message-section {
    padding: var(--padding)
  }

  .message-section ul {
    list-style-type: none;
    padding-inline-start: 0;
  }

  .messages {
    float: bottom;
  }

  .send-message {
    padding: 10px 30px;
    font-size: 24px;
    cursor: pointer;
    background-color: #c71b1b;
    color: #ffffff;
    transition: all 0.3s;
  }

  .users-section {
    display: flex;
    flex-direction: column;
    flex: 0.3;
    max-width: 300px;
    background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  }

  .username {
    text-align: center;
    line-height: 2.2;
    background: #dddddd;
  }
</style>
