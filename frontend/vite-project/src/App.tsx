import { useEffect, useState } from 'react';
import { CustomError, User } from './types';
import { Input, Card, Modal, Spin } from 'antd';
import { MailOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './App.css'

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState< CustomError|null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filter, setFilter] = useState('');

  const showModal = (user:User) => {
    setSelectedUser(user)
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleFilterCange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setFilter(e.target.value)
  }
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://[::1]:3000');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error:unknown) {
        if(error instanceof Error){
        setError({ message: error.message });
      }else {
        setError({ message: 'An unknown error occurred' });
      }

      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Spin/>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div >
    <Input placeholder="default size" onChange = {handleFilterCange}style={{width:'100%'}} prefix={<UserOutlined />} />
    <div  className="card-container">
      
      
        {filteredUsers.map((user, index) => (<>
          <Card  className='card' key={index} title={user.name}  onClick={()=>showModal(user)}>

          <p><MobileOutlined />{user.phone}</p>
          <p><MailOutlined />{user.email}</p>
          </Card>
          {selectedUser && (
          <Modal
          title={ selectedUser.name}
          open={isModalOpen}
          onOk={handleCancel}
          onCancel={handleCancel}
          >
              <div className='flex'>
                <p>Телефон</p>
                <p className='big-card-p'>{selectedUser.phone}</p>
              </div>
              <div className='flex'>
                <p>Почта</p>
                <p className='big-card-p'>{selectedUser.email}</p>
              </div>
              <div className='flex'>
                <p>Дата приема</p>
                <p className='big-card-p'>{dayjs(selectedUser.hire_date).format('DD.MM.YYYY')}</p>
              </div>
              <div className='flex'>
                <p>Должность</p>
                <p className='big-card-p'>{selectedUser.position_name}</p>
              </div>
              <div className='flex'>
                <p>Подразделение</p>
                <p className='big-card-p'>{selectedUser.department}</p>
              </div>
              <div>Дополнительная информация</div>
              <div>{selectedUser.addInformation}</div>
          </Modal>
          )
}
          </>
        ))}
      
    </div>
   </div> 

  );

}

export default App
