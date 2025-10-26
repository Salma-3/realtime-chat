import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import UsersLoadingSkeleton from './UsersLoadingSkeleton';
import NoChatsFound from './NoChatsFound';

function ContactList() {
  const { getAllContacts, allContacts: contacts, isUsersLoading, setSelectedUser } = useChatStore();

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
              {/* TODO: Make this online status dynamic with sockets*/}
              <div className={`avatar online`}>
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