import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Layout.module.css';
import sidebarToggleIcon from '../../assets/sidebar-icon.png';
import uploadIcon from '../../assets/upload_icon.png';
import folderIcon from '../../assets/folder_icon.png';
import folderAddIcon from '../../assets/folder-add-icon.png';
import plusIcon from '../../assets/plus_icon.png';
import moreIcon from '../../assets/more_icon.png';

function Sidebar() {
  const [folders, setFolders] = useState([]);
  const [openFolderId, setOpenFolderId] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('folders'));
    if (saved && Array.isArray(saved)) setFolders(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleNewFolder = () => {
    const newId = folders.length ? folders[folders.length - 1].id + 1 : 1;
    const newFolder = {
      id: newId,
      title: `폴더 ${newId}`,
      chats: [],
      showMenu: false,
      showChatMenu: [],
    };
    setFolders([...folders, newFolder]);
  };

  const handleNewChat = (folderId) => {
    setFolders(prev =>
      prev.map(f =>
        f.id === folderId
          ? {
              ...f,
              chats: [
                ...f.chats,
                {
                  id: f.chats.length ? f.chats[f.chats.length - 1].id + 1 : f.id * 100 + 1,
                  title: `채팅 ${f.chats.length + 1}`,
                },
              ],
              showChatMenu: [...f.showChatMenu, false],
            }
          : f
      )
    );
    setOpenFolderId(folderId);
  };

  const toggleFolderMenu = (folderId) => {
    setFolders(prev =>
      prev.map(f =>
        f.id === folderId
          ? { ...f, showMenu: !f.showMenu }
          : { ...f, showMenu: false, showChatMenu: f.showChatMenu?.map(() => false) || [] }
      )
    );
  };

  const toggleChatMenu = (folderId, chatId) => {
    setFolders(prev =>
      prev.map(f => {
        if (f.id !== folderId) return f;
        const newShow = f.showChatMenu.map((v, i) => f.chats[i].id === chatId ? !v : false);
        return { ...f, showChatMenu: newShow };
      })
    );
  };

  const handleRename = (folderId) => {
    const newName = prompt('새 폴더 이름을 입력하세요:');
    if (!newName) return;
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, title: newName } : f));
  };

  const handleDelete = (folderId) => {
    setFolders(prev => prev.filter(f => f.id !== folderId));
  };

  const handleRenameChat = (folderId, chatId) => {
    const newName = prompt('새 채팅 이름을 입력하세요:');
    if (!newName) return;
    setFolders(prev =>
      prev.map(f => {
        if (f.id !== folderId) return f;
        return {
          ...f,
          chats: f.chats.map(c => c.id === chatId ? { ...c, title: newName } : c),
        };
      })
    );
  };

  const handleDeleteChat = (folderId, chatId) => {
    setFolders(prev =>
      prev.map(f => {
        if (f.id !== folderId) return f;
        const idx = f.chats.findIndex(c => c.id === chatId);
        return {
          ...f,
          chats: f.chats.filter(c => c.id !== chatId),
          showChatMenu: f.showChatMenu.filter((_, i) => i !== idx),
        };
      })
    );
  };

  const handleFolderClick = (folderId) => {
    setOpenFolderId(openFolderId === folderId ? null : folderId);
    setSelectedFolderId(folderId);
    setSelectedChatId(null);
  };

  const handleChatClick = (chatId, folderId) => {
    setSelectedChatId(chatId);
    setSelectedFolderId(folderId);
  };

  return (
    <div className={`${styles.sidebarContainer} ${!isSidebarOpen ? styles.collapsed : ''}`}>
      <div className={styles.sidebarToggle}>
        <img src={sidebarToggleIcon} alt="Toggle Sidebar" onClick={toggleSidebar} />
      </div>

      {isSidebarOpen && (
        <>
          <div className={styles.uploadSection}>
            <div className={styles.uploadRow}>
              <img src={uploadIcon} alt="Upload" />
              <span>데이터 업로드</span>
            </div>
            <div className={styles.uploadInfo}>TF_TEAMS.csv 외 9개</div>
          </div>

          <div className={styles.folderHeader}>
            <span>폴더</span>
            <img src={folderAddIcon} alt="Add Folder" onClick={handleNewFolder} />
          </div>

          <div className={styles.folderList}>
            {folders.map((folder) => (
              <div key={folder.id} className={styles.folderItemWrapper}>
                <div className={styles.folderItem}>
                  <div onClick={() => handleFolderClick(folder.id)} className={`${styles.folderTitle} ${selectedFolderId === folder.id ? styles.selected : ''}`}>
                    <img src={folderIcon} alt="Folder" />
                    <span>{folder.title}</span>
                  </div>
                  <div className={styles.folderIcons}>
                    <img src={plusIcon} alt="Add Chat" onClick={() => handleNewChat(folder.id)} />
                    <img src={moreIcon} alt="Menu" onClick={() => toggleFolderMenu(folder.id)} />
                    {folder.showMenu && (
                      <div className={styles.contextMenu}>
                        <div className={styles.menuItem} onClick={() => handleRename(folder.id)}>수정</div>
                        <div className={styles.menuItem} onClick={() => handleDelete(folder.id)}>삭제</div>
                      </div>
                    )}
                  </div>
                </div>

                {openFolderId === folder.id && (
                  <div className={styles.chatList}>
                    {folder.chats.map((chat, i) => (
                      <div key={chat.id} className={`${styles.chatItem} ${selectedChatId === chat.id ? styles.selected : ''}`}>
                        <Link to={`/chat/${chat.id}`} onClick={() => handleChatClick(chat.id, folder.id)}>{chat.title}</Link>
                        <img src={moreIcon} alt="Chat Menu" onClick={() => toggleChatMenu(folder.id, chat.id)} />
                        {folder.showChatMenu[i] && (
                          <div className={styles.contextMenu}>
                            <div className={styles.menuItem} onClick={() => handleRenameChat(folder.id, chat.id)}>수정</div>
                            <div className={styles.menuItem} onClick={() => handleDeleteChat(folder.id, chat.id)}>삭제</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;
