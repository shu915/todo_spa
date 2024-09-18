import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FiSend } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components'


const InputName = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  padding: 2px 7px;
  margin: 12px 0;
`

const CurrentStatus = styled.div`
  font-size: 19px;
  margin: 8px 0 12px 0;
  font-weight: bold;
`

const IsCompletedButton = styled.button`
  color: #fff;
  font-weight: 500;
  font-size: 17px;
  padding: 5px 10px;
  background: #f2a115;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`

const EditButton = styled.button`
  color: #fff;
  font-weight: 500;
  font-size: 17px;
  padding: 5px 10px;
  background: #0ac620;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`

const DeleteButton = styled.button`
  color: #fff;
  font-weight: 500;
  font-size: 17px;
  padding: 5px 10px;
  background: #f54242;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  `

const ButtonWrap = styled.div`
  display: flex;
  gap: 0.5rem;  
`

export const EditTodo = () => {
  const navigate = useNavigate();


  const initialTodoState = {
    id: null,
    name: "",
    is_completed: false
  }

  const [currentTodo, setCurrentTodo] = useState(initialTodoState);

  const getTodo = id => {
    axios.get(`/api/v1/todos/${id}`)
      .then(res => {
        setCurrentTodo(res.data)
      }).catch(e => {
        console.log(e);
      })
  }

  const { id } = useParams();

  useEffect(() => {
    getTodo(id)
  }, [id])

  const notify = () => {
    toast.success('Todo successfully updated!', {
      position: 'bottom-center',
      hideProgressBar: true
    })
  }

  const handleInputChange = e => {
    const { name, value } = e.target;
    setCurrentTodo({ ...currentTodo, [name]: value });
  }

  const updateIsCompleted = (value) => {
    const data = {
      id: value.id,
      name: value.name,
      is_completed: !value.is_completed
    }
    axios.patch(`/api/v1/todos/${value.id}`, data)
      .then(res => {
        setCurrentTodo(res.data)
      })
  }

  const updateTodo = () => {
    axios.patch(`/api/v1/todos/${currentTodo.id}`, currentTodo)
      .then(res => {
        notify();
        navigate('/todos');
      }).catch(e => {
        console.log(e);
      })
  }

  const deleteTodo = () => {
    const sure = window.confirm('Are you sure?');
    if (sure) {
      axios.delete(`/api/v1/todos/${currentTodo.id}`)
        .then(res => {
          navigate('/todos');
        }).catch(e => {
          console.log(e);
        })
    }
  }

  return (
    <>
      <h1>Editing Todo</h1>
      <div>
        <div>
          <label htmlFor="name">Current Name</label>
          <InputName
            type="text"
            name="name"
            value={currentTodo.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <span>Current Status</span><br />
          <CurrentStatus>
            {currentTodo.is_completed ? "Completed" : "Uncompleted"}
          </CurrentStatus>
        </div>
      </div>
      <ButtonWrap>

        {currentTodo.is_completed ? (
          <IsCompletedButton onClick={() => updateIsCompleted(currentTodo)}>
            Uncompleted
          </IsCompletedButton>
        ) : (
          <IsCompletedButton onClick={() => updateIsCompleted(currentTodo)}>
            Completed
          </IsCompletedButton>
        )}
        <EditButton onClick={updateTodo}>
          Update
        </EditButton>
        <DeleteButton onClick={deleteTodo}>
          Delete
        </DeleteButton>
      </ButtonWrap>

    </>

  )
}
