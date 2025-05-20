import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

//레이아웃 페이지
/*
여기서 Header, Footer, 사이드바, 메인컨텐츠 영역에 대한 값을 지정해준다
*/
function Layout({ title }) {
  return (
    <div className={styles.page}>
      <Header title={title} />
      <div className={styles.contentArea}>
        <Sidebar styles={styles} />
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
