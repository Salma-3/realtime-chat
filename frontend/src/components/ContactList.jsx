import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import UsersLoadingSkeleton from './UsersLoadingSkeleton';
import NoChatsFound from './NoChatsFound';
import { useAuthStore } from '../store/useAuthStore';

function ContactList() {
  const { getAllContacts, allContacts: contacts, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  useEffect(() => {
    getAllContacts();
  }, [getAllContacts])

  if(isUsersLoading) {
    return <UsersLoadingSkeleton />
  }

  if(contacts.length === 0) {
    return <NoChatsFound />
  }

  return (
    <div>
      {
        contacts.map(contact => (
          <div 
            key={contact.id} 
            onClick={() => setSelectedUser(contact)}
            className='mb-1 bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors'
          >
            <div className="flex items-center gap-3">
              <div className={`avatar ${onlineUsers.includes(contact.id) ? 'online' : 'offline'}`}>
                <div className="size-12 rounded-full">
                  <img src={contact.profilePic || '/avatar.png'} alt={contact.fullName} />
                </div>
              </div>
              <h4 className="text-slate-200 font-medium truncate">{contact.fullName}</h4>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default ContactList