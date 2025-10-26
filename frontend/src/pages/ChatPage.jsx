import { useAuthStore } from "../store/useAuthStore"

function ChatPage() {
  const { logout } = useAuthStore();
  return (
    <div>
      <button className="relative z-10 btn btn-primary" onClick={logout}>logout</button>
      chat page
    </div>
  )
}

export default ChatPage